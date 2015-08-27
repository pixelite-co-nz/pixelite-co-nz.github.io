---
layout: post
title: "Debugging Drupal performance with Cache Debug module"
subtitle: "Finding the offenders breaking your caching strategy"
excerpt: "Drupal performance relies on cache but poor Drupal code can break your caching system without you knowing about it!"
header-img: "img/post-bg-hero.png"
permalink: /article/debugging-drupal-performance-with-cache-debug/
author: "Josh Waihi"
twitter: "@joshwaihi"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- php
- cache
- performance
---
## Preface
This blog post is for developers, not site builders, as the analysis for cache debugging requires knowledge about the runtime stack of Drupal.

## The Problem with Caching in Drupal 7
To obtain performance in Drupal 7, Drupal relies heavily on caching. That is, to process something and cache the end result so that same work doesn't need to be repeated. Conditions also have to be created for when that cache expires or is invalidated.
Drupal has a caching layer to help with this. When you want to store something in cache, you use [cache_set](https://api.drupal.org/api/drupal/includes%21cache.inc/function/cache_set/7), to retrieve it, you use [cache_get](https://api.drupal.org/api/drupal/includes%21cache.inc/function/cache_get/7) and to wipe the cache bin clean, you can use [cache_clear_all](https://api.drupal.org/api/drupal/includes%21cache.inc/function/cache_clear_all/7).

Often, modules can implicitly clear or set cache unintentionally. This can lead to more caching overhead than you need. For example, theme registry clearing, use of the variable_set function or calls to other modules that call cache_clear_all. The problem is, how do you track down culprits to fix the issue?

## Enter Cache Debug

[Cache Debug](https://www.drupal.org/project/cache_debug) is a module that wraps around the caching layer and adds logging. Including stacktrace information. It means when a cache_set or cache_clear_all is called, you can trace back to what called it - understand the problem and fix it. Very quickly.

It comes with three logging options:

* **watchdog** - good if you're using syslog module but deadly if you're using dblog.
* **error_log** - logs to your php error log
* **arbitrary file** - specify your own log file to log to

## Configuring Cache Debug
Because the caching system is so highly utilized, cache logging can be incredibly verbose. Perhaps this is why there is no logging around this in Drupal core. Fortunately, Cache Debug is highly configurable to control what to log.

**NOTE:** Because the caching system is loaded and used before Drupal's variable system which manages configuration, it is best to set configuration in settings.php rather than in the database. However, there is a web UI that does set configuration in the database for ease of use.

### Basic configuration
If you've used the memcache module before, this should feel familiar. In order to use Cache Debug, you need to set it as the cache handler:

{% highlight php %}
<?php
$conf['cache_backends'][] = 'sites/all/modules/cache_debug/cache_debug.inc';
$conf['cache_default_class'] = 'DrupalDebugCache';
?>
{% endhighlight %}

This tells Drupal that there is a cache backend located in the path provided (make sure its correct for your Drupal site!) and that the default class for all cache bins is the DrupalDebugCache class. If you only want to monitor a single bin you may want to omit this option.

Since Cache Debug is a logger and not an actual caching system, it needs to pass cache requests onto a real cache system. By default, Debug Cache will use Drupal core's Database Cache system for cache storage, but if you're using memcache, redis or similar, you may want to set that as the handler for Cache Debug:

{% highlight php %}
<?php
$conf['cache_debug_class'] = 'MemCacheDrupal';
$conf['cache_cache_debug_form'] = 'DrupalDatabaseCache';
?>
{% endhighlight %}

You need to also configure those modules accordingly.

At this point, you'll be logging all cache calls and stack traces to set and clear calls to the php error log.

### Configure the logging location

You may want to choose your own logging location. For example, if you use dblog, then you won't want to log to watchdog because it will bloat your database. Likewise, if you don't want to bloat  our php error log, then you may want to log to an arbitrary file. You can choose your logging location by setting `cache_debug_logging_destination` to error_log (default), watchdog or file. For file you will also need to provide the location:

{% highlight php %}
<?php
$conf['cache_debug_logging_destination'] = 'file';
$conf['cache_debug_log_filepath'] = '/tmp/cachedebug.log';
?>
{% endhighlight %}

### Configuring logging options

You can choose to log calls to cache get, getMulti, set and clear. You can also choose to log a stacktrace of these calls to show the stack that triggered the call. This is most useful for calls to SET and CLEAR. For a minimal logging option with the most about of insight, you might want to try this:

{% highlight php %}
<?php
$conf['cache_debug_log_get'] = FALSE;
$conf['cache_debug_log_getMulti'] = FALSE;
$conf['cache_debug_log_set'] = TRUE;
$conf['cache_debug_log_clear'] = TRUE;
$conf['cache_debug_stacktrace_set'] = TRUE;
$conf['cache_debug_stacktrace_clear'] = TRUE;
?>
{% endhighlight %}

### Logging per cache bin

You don't have to log the entire caching layer if you know which bin to look at for the caching issue you're observing. For example, if you're looking for misuse of variable_set, you only need to log the cache_bootstrap bin. In which case you could do this:

{% highlight php %}
<?php
# Do not log to all cache bins so ensure this line is removed (from above):
# $conf['cache_default_class'] = 'DrupalDebugCache';
$conf['cache_bootstrap_class'] = 'DrupalDebugCache';
?>
{% endhighlight %}

### Configure for common issues
Variable set calls and theme registry rebuilds are the two most common issues and so Cache Debug has use cases for these issues built in. So long as Cache Debug is the cache handler for the bin, you can turn off logging and turn on these features and Cache Debug will only log when these issues occur:

{% highlight php %}
<?php
$conf['cache_default_class'] = 'DrupalDebugCache';
$conf['cache_debug_common_settings'] = array(
  'variables' => TRUE,
  'theme_registry' => TRUE,
);
// Turn off logging
$conf['cache_debug_log_get'] = FALSE;
$conf['cache_debug_log_getMulti'] = FALSE;
$conf['cache_debug_log_set'] = FALSE;
$conf['cache_debug_log_clear'] = FALSE;
?>
{% endhighlight %}

## Analysing the logged data

Cache debug logs to a log file like the example below:
<img src="{{ site.url }}/img/cache-debug/cache_debug-example.png" alt="Example output of cache debug logging" class="img-responsive img-thumbnail" />

In this snapshot of log output you can see both how cache debug logs cache calls and the stacktracing in action.

### Log format structure
A log line starts with a value that describes the cache bin, the cache command and the cache id. E.g. `cache_bootstrap->set->variables` would bet a cache_set call to the cache_bootstrap cache bin to set the variables cache key.
Some calls also log additional data, for example, cache clear also indicates if the call was a wildcard clear. Set calls also log how much data (length) was set.

### Stack trace logs
When stack tracing is enabled for specific commands, a stack trace will be logged immediately after the log event that triggered it. The trace rolls back through each function that led to the current cache command being triggered. In the example above you can see that cache_clear_all was called by drupal_theme_rebuild which was called by an include from phptemplate_init. If you look at the source code in phptemplate_init, you'll see that this means a cache rebuild was triggered from including template.php. In this case it was that Zen base theme had the theme registry rebuild left on.
