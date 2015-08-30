---
layout: post
title: "High performance AJAX callbacks with Drupal 7 and the JS module"
permalink: /article/high-performance-ajax-callbacks-drupal-7-and-js-module
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- performance
- ajax
- module
---

As your site grows with the number of modules, the amount of memory and SQL queries required to perform a full bootstrap grows. Even though your AJAX callback might only need to perform a single SQL SELECT query, sometimes Drupal spends a lot of time loading and executing code that will never be used.

## Introducing the JS module ##

The [JS module](https://drupal.org/project/js) aims to solve this problem by providing an alternative way to bootstrap to *only* the required level needed to perform the task at hand. This has a major advantage of including only the necessary files needed to serve the request.

From the module's description:

<blockquote>
JavaScript callback handler is an interim solution for high-performance server requests including (but not limited to) AHAH, AJAX, JSON, XML, etc.

This project targets module developers and provides a "bare bone" callback handler which is intended to be addressed by modules wanting to improve response times for specialized tasks.
</blockquote>

## Drupal and bootstrap levels ##

By default a vanilla hook_menu() in Drupal will bootstrap to DRUPAL_BOOTSTRAP_FULL, which means it will load in all .module files, and execute hook_boot() and hook_init() for all enabled modules. With the JS module however you can select the bootstrap level you wish to go to (the less levels you load, the faster your code can effectively be), the only trade-off is in the functionality you might not have available.

Here is a list of the [bootstrap levels defined in Drupal core](https://api.drupal.org/api/drupal/includes!bootstrap.inc/function/drupal_bootstrap/7) (highest are the most lightweight, with each layer adding code and complexity):

{% highlight php %}
static $phases = array(
  DRUPAL_BOOTSTRAP_CONFIGURATION,
  DRUPAL_BOOTSTRAP_PAGE_CACHE,
  DRUPAL_BOOTSTRAP_DATABASE,
  DRUPAL_BOOTSTRAP_VARIABLES,
  DRUPAL_BOOTSTRAP_SESSION,
  DRUPAL_BOOTSTRAP_PAGE_HEADER,
  DRUPAL_BOOTSTRAP_LANGUAGE,
  DRUPAL_BOOTSTRAP_FULL,
);
{% endhighlight %}

For example if you wished to use the function variable_get() in your AJAX callback, you would need to ensure you had bootstrapped to at least the DRUPAL_BOOTSTRAP_VARIABLES level, and if you required access to the current $user object you would need DRUPAL_BOOTSTRAP_SESSION etc.

## Real world site performance of the JS module ##

In order to demonstrate the difference in performance, I decided to create a really simple module that highlights the difference between a traditional full Drupal bootstrap and the lightweight approach of the JS module. This simple module can be [cloned from my sandbox on Drupal.org](https://drupal.org/sandbox/wiifm/2145789).

On a large site with more than 185 modules enabled (including memcache + entitycache), I ran a series of tests to see what impact that had

### Full bootstrap (default Drupal hook_menu())  ###

**After a drush cc all** (206 database queries):

{% highlight bash %}
    seanh@wiifm /var/www/example git:master » time curl http://example.co.nz/js_example/results/35513
    {"title":"Example node title","success":true}
    real	0m5.085s
{% endhighlight %}

**Primed cache** (17 database queries):

{% highlight bash  %}
    seanh@wiifm /var/www/example git:master » time curl http://example.co.nz/js_example/results/35513
    {"title":"Example node title","success":true}
    real	0m0.514s
{% endhighlight %}

### Lightweight bootstrap (with JS module bootstrapping to DRUPAL_BOOTSTRAP_DATABASE) ###

**After a drush cc all** (9 database queries):

{% highlight bash  %}
    seanh@wiifm /var/www/example git:master » time curl http://example.co.nz/js/js_example/results/35513
    {"title":"Example node title","success":true}
    real	0m0.300s
{% endhighlight %}

**Primed cache** (6 database queries):

{% highlight bash  %}
    seanh@wiifm /var/www/example git:master » time curl http://example.co.nz/js/js_example/results/35513
    {"title":"Example node title","success":true}
    real	0m0.078s
{% endhighlight %}

The saving in terms of speed (more than 6 times faster with a primed cache) an less system resources (around one third of the database queries with a primed cache) are remarkable.

## Limitations ##

Access control can be trickier when on the lightweight bootstrap, so be careful and if anything be overly paranoid about any data you receive. You may also want to read up about [SQL injection and Drupal 7 - top 1 of 10 OWASP security risks](http://www.pixelite.co.nz/article/sql-injection-and-drupal-7-top-1-10-owasp-security-risks)

Performing theming can get tricky as well with a lightweight bootstrap, so if you need to harness the power of view modes, templating and node rendering, you might be better off to use a full bootstrap.

## Comments ##

Let me know if you have used the JS module in your Drupal site (and a link if it is public), and I would also be interested to see what benchmarks you get by running my sandbox module on your latest Drupal site.
