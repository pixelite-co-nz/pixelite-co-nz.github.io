---
layout: post
title: "How and why you should update PHP to PHP 5.5 with Drupal"
subtitle: "You should do this yesterday"
excerpt: "Secuirty, performance and new features are wins all around."
header-img: "img/post-bg-04.jpg"
permalink: /article/how-why-you-should-update-php-to-55-with-drupal/
author: "Sean Hamlin"
twitter: "@wiifm"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- php
- performance
- security
---

This post is a follow up to my previous blog post on [how to upgrade PHP to 5.4 to support Drupal 8](/article/upgrading-php-54-ubuntu-1204-lts-support-drupal-8).

## Why you should upgrade PHP

If you are looking for reasons to ditch PHP 5.3, here are some:

### Security

PHP 5.3 [reached end of life in August 2014](http://php.net/supported-versions.php), this means that if you are running this version, you are running an insecure version of PHP that potentially has security holes in it. This is bad for obvious reasons.

### Bundled opcode cache

PHP 5.5 is the first version that bundles an opcode cache with PHP, this means there is also no need to also run APC (unless you need userland caching in [APCu](https://github.com/krakjoe/apcu)).

### Performance

PHP [profiled the 5.4 release compared to 5.3 for Drupal](http://news.php.net/php.internals/57760), and that found that:

* 7% more requests/second
* 50% PHP memory reduction

PHP 5.5 offers more performance again, and there is a section at the bottom of this article that goes through a real life scenario.

### Cool new features

Read through the list of new features, here are some neat things you are missing out on:

* [try/catch/finally](http://php.net/manual/en/language.exceptions.php#language.exceptions.finally) is finally now in
* Short array syntax
{% highlight php %}
$array = [
  "foo" => "bar",
  "bar" => "foo",
];
{% endhighlight %}
* Function array dereferencing
{% highlight php %}
  $secondElement = getArray()[1];
{% endhighlight %}
* [Traits](http://php.net/manual/en/language.oop5.traits.php)

And [many](http://php.net/manual/en/migration54.new-features.php) [others](http://php.net/manual/en/migration55.new-features.php).

## How to upgrade to PHP 5.5

There are a number of ways to update your server to PHP 5.5.

### Upgrade to Ubuntu Trusty Tahr 14.04

Ubuntu Trusty Tahr 14.04 (which is an LTS version), which comes bundled with [PHP 5.5.9](http://packages.ubuntu.com/trusty/php5-common). This is probably the best solution if you are managing your own Ubuntu box.

### Install a PPA on Ubuntu Precise 12.04

If you are running the older Ubuntu Precise 12.04, you can add a PPA

{% highlight bash %}
sudo add-apt-repository ppa:ondrej/php5
sudo apt-get update
sudo apt-get install php5
php5 -v
{% endhighlight %}

It would be worth considering a dist upgrade though, but this at least can buy you some time.

### Acquia Cloud UI

If you use [Acquia Cloud](https://www.acquia.com/products-services/acquia-cloud) for hosting there is a convenient PHP version selector in the UI. 

<img src="{{ site.url }}/img/php55/cloud.png" alt="Acquia Cloud UI allows site administrators to change the PHP version" class="img-responsive img-thumbnail" />

More information can be found in the [documentation](https://docs.acquia.com/cloud/configure/environments/php#php-version). Be aware, once you upgrade beyond PHP 5.3, you cannot downgrade, so ensure you test your code on a development server first ;)

## Common coding issues

Although Drupal 7 core, and most popular contributed modules will already support PHP 5.5, it would pay to do a code audit on any custom code written to ensure you are not using things you should not be. Here are some links you should read:

* [PHP 5.4 incompatible changes](http://php.net/manual/en/migration54.incompatible.php)
* [PHP 5.5 incompatible changes](http://php.net/manual/en/migration55.incompatible.php)

Below are some of the most common issues I have found in sites:

### Call time pass-by-reference

If you have this in your code, you will have a bad time, as this is now a PHP fatal.

{% highlight php %}
foo(&$a); // Bad times.
{% endhighlight %}

### Only variables can be passed by reference

This will cause PHP to throw notices.

{% highlight bash %}
$ php -a
Interactive shell

php > ini_set('error_reporting', E_ALL);
php > var_dump(reset(explode('|', 'Jim|Bob|Cat')));
PHP Strict Standards:  Only variables should be passed by reference in php shell code on line 1

Strict Standards: Only variables should be passed by reference in php shell code on line 1
string(3) "Jim"
{% endhighlight %}

Where you will likely find this in Drupal in my experience is when manually rendering nodes:

This code works in PHP 5.3, but will throw notices in PHP 5.5:

{% highlight php %}
$rendered = drupal_render(node_view(node_load(1), 'teaser'));
{% endhighlight %}

The fix is to simply use a temporary variable:

{% highlight php %}
$view = node_view(node_load(1), 'teaser');
$rendered = drupal_render($view);
{% endhighlight %}

The reason being that <code>drupal_render()</code> expects a variable to be passed in (as it is passed by reference).

### How do you find coding issues

Enable the syslog module, and tail that in your development environment, hunt down and fix as many notices and warnings as possible. The more noisy your logs are, the harder it is to find actual issues in them. While you are at it, turn off the dblog module, this is only helpful if you do not have access to your syslog (as it is a performance issue to be continually writing to the database).

## Real world performance comparison

This was taken from a recent site that underwent a PHP 5.3 to 5.5 upgrade. Here are 2 New Relic overviews, taken with identical performance tests run against the same codebase. The first image is taken with PHP 5.3 running:

<img src="{{ site.url }}/img/php55/php53.png" alt="Performance of Drupal on PHP 5.3 is not that flash" class="img-responsive img-thumbnail" />

You can see PHP time is around 260ms of the request.

<img src="{{ site.url }}/img/php55/php55.png" alt="Performance of Drupal on PHP 5.5 is much better than 5.3" class="img-responsive img-thumbnail" />

With an upgrade to PHP 5.5, the time spent in PHP drops to around 130ms. So this is around a a 50% reduction in PHP time. This not only makes your application faster, but also it means you can serve more traffic from the same hardware.

## Comments

If you have gone through a recent PHP upgrade, I would be interested to hear how you found it, and what performance gains you managed to achieve.
