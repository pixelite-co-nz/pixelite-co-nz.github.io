---
layout: post
title: "Dynamic content caching based on attributes in Drupal 7"
subtitle: "Simple code to maximise your varnish hitrate"
excerpt: "Out of the box, Drupal 7 comes with the ability to set the global cache lifetime for all pages on the site, this often is not enough for complex sites."
header-img: "img/cache-attributes.jpg"
permalink: /article/dynamic-content-caching-based-on-attributes-in-drupal-7/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- performance
- caching
- varnish
---

Out of the box, Drupal 7 comes with the ability to set the global cache lifetime for all pages on the site. I find this works generally quite well with small sites with not a lot of content or complex caching requirements. <a href="https://pantheon.io/docs/articles/drupal/drupal-performance-and-caching-settings/">Pantheon have a nice write</a> up on the performance settings page that comes with Drupal 7 core and what each of the settings mean.

**N.B.** In this article I am assuming you are running some form of reverse proxy (e.g. varnish) in front of Drupal (most Drupal managed cloud vendors like Acquia or Pantheon provide varnish as a part of it's offering as standard).

## The problem with Drupal 7 core settings

What happens when you are running a large site, with a very <a href="https://en.wikipedia.org/wiki/Long_tail">long tail of content</a>? All of a sudden running a global cache <abbr title="Time To Live">TTL</abbr> of 10 minutes can result in a very poor hit rate in varnish. Having a poor hit rate in varnish ultimately means your web servers end up doing more work, which often leads to having to shell out for additional hardware.

Generally, faced with this issue, you have 2 options:

## 1) Varnish with purging

In this option, you set a global high cache TTL, so that all content lives in varnish for an excessively long time (say 12 hours), and when certain events occur (say a news article gets published), then purge requests occur telling varnish to drop certain URLs from it's cache. I don't want to go into detail to much on this, but I will say there are a number of drawbacks with this approach:

* When you publish 1 node, often this node can potentially appear on dozens of pages (e.g. on landing pages as a teaser, or in a view), this means the purge rules get overly complex in a hurry. If you ever re-architect a portion of the site, often this means hundreds of purge rules need to be rewritten and tested, this can be very costly.
* Running a <abbr title="Content Delivery Network">CDN</abbr> (e.g. Akamai, or Cloudflare) can complicate things further, as you need to purge varnish first, then the CDN *and never in the reverse order*, else the CDN will end up caching the stale content all over again
* Having exposed filters on the page means you will need to use bans in varnish (to utlise regex), this is another topic for another day
* All too often, content editors resort to *nuking the varnish cache from orbit* and dropping the whole lot when the rules do not function as desired. This is especially bad as it means all the content in there needs to be entirely rebuilt again. This can (and often does) take down busy sites when it occurs in production.

## 2) Varnish with intelligent cache TTLs

Another option to which I want to discuss in this blog post is around using the attributes of the node in order to determine at runtime how long this piece of content should be cached in varnish.

Attributes you can use to help you work out the most effective cache TTL:

* content type
* content created age (now - created)
* recency of most recent revision
* when the last comment was made
* current time of day
* any other attribute of the node

What do I mean by this? Well let's say you run a large digital media organisation, and publish hundreds of fresh news articles per day, but after a week or so, they generally get no edits done to them at all. Your cache TTL rules could be:

* if content type == 'news_article' then
* if age < 1 week, then the cache TTL inherits from the global configuration
* else if age > 1 week, then increase cache TTL to 1 week

This way, your new content is able to get upgrades quite promptly, and your long tail of older news articles have a massively inflated cache TTL, meaning your varnish server should really be able to help out here. It is important to note, that these rules apply at a node by node level, and can be made to suit your business requirements.

### Modules out there already

I had a look around on Drupal.org to see what others had done in this area in the past, I was genuinely surprised at the lack of modules in this area, here is a short summary:

* <a href="https://www.drupal.org/project/cacheexclude">cacheexclude</a> - used to exclude certain URLs from cache, kind of the opposite of what we want here.
* <a href="https://www.drupal.org/project/max_age">max_age</a> - an (abandoned?) Drupal 6 module that aimed to provide different cache TTLs per content type in addition to the site wide default. This is close to what we want, there even is a <a href="https://www.drupal.org/node/1322158">patch to help port the module to Drupal 7</a>. 

### Example code

Rather than using any existing contrib modules, the code required to do what we want is very simple. Here is some simple custom code that can be used as a starting point for your code:

{% highlight php %}
<?php
/**
 * Implements hook_page_build().
 *
 * Responsible for setting the cache TTL based on the content attributes.
 */
function MYMODULE_page_build(&$page) {
  $node = menu_get_object();
  if (user_is_anonymous() && isset($node)) {
    $age_since_last_change = REQUEST_TIME - $node->changed;

    switch ($node->type) {
      case 'news_article' :
        // If the news article has not been edited in a week, then set the cache
        // TTL to a week.
        if ($age_since_last_change > 604800) {
          $max_age = 604800;
          drupal_add_http_header('Cache-Control', 'public,max-age=' . $max_age);
          drupal_add_http_header('Expires', gmdate(DATE_RFC1123, REQUEST_TIME + $max_age));
        }
        break;
    }
  }
}
?>
{% endhighlight %}

The above example is simple, but hopefully gives you a taste of what can be achieved with very little code.

### How to test your code

I have a few cURL aliases in my <code>.bashrc</code> that will come in handy if you do a lot of this type of thing:

{% highlight bash %}
# cURL
function curlh() { curl -sLIXGET "$@"; }
function curlc() { curl -sLIXGET "$@" | grep -E -i "^(Cache-Control|Age|Expires|Set-Cookie|X-Cache|X-Varnish|X-Hits|Vary)"; }
{% endhighlight %}

So if you are after all response headers you can:

{% highlight bash %}
$ curlh www.example.com
HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: max-age=604800
Content-Type: text/html
Date: Sun, 06 Sep 2015 22:52:40 GMT
Etag: "359670651"
Expires: Sun, 13 Sep 2015 22:52:40 GMT
Last-Modified: Fri, 09 Aug 2013 23:54:35 GMT
Server: ECS (cpm/F9D5)
X-Cache: HIT
x-ec-custom-error: 1
Content-Length: 1270
Connection: Keep-Alive
Age: 2265
{% endhighlight %}

If you just want the relevant caching response headers:

{% highlight bash %}
$ curlc www.example.com
Cache-Control: max-age=604800
Expires: Sun, 13 Sep 2015 22:52:40 GMT
X-Cache: HIT
Age: 2249
{% endhighlight %}

### What this technique relies on

1. **Expectation setting** - you will need to ensure all content authors and stakeholders are aware what this means. If a really old news article is edited, there potentially will be lag before the changes are live.
1. **Enough RAM in varnish** to house all your objects. If you are RAM constrained, and are seeing a lot of evictions at present, then this technique will not have the impact you will want it to. You might be better to upsize varnish first, then look at this technique.

## Comments

I am keen to hear what other large websites do in the area, especially around multiple layers of external cache invalidation and/or if custom cache TTL headers are used. Also if you know of any other contrib modules that can help here, let me know.
