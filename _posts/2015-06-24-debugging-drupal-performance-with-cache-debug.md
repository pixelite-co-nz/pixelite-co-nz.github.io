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
Drupal has a caching layer to help with this. When you want to store something in cache, you use [cache_set|https://api.drupal.org/api/drupal/includes%21cache.inc/function/cache_set/7], to retrieve it, you use [cache_get|https://api.drupal.org/api/drupal/includes%21cache.inc/function/cache_get/7] and to wipe the cache bin clean, you can use [cache_clear_all|https://api.drupal.org/api/drupal/includes%21cache.inc/function/cache_clear_all/7].

Drupal 7 relies heavily on expiry based caching strategies. That means cached items are considered "stale" once a certain period of time elapses. The problem with this strategy is it can be inaccurate. Changes can occur that effect the cached item, however, old cached item remains in cache and considered valid when really it should be cleared from cache. Modules try to be smart about this by either clearing the cache with cache_clear_all or by reseting the cached item with cache_set.

So what happens if a module clears the cache too regularly to a point where it impacts your performance? How to find the offending code? This can be a cumbersome problem to solve that in the past, I've only been able to do with either XHProf which limits you per sample, or tcpdump which can be very verbose and can't tell you where in code the problem actually is.

## Enter [Cache Debug|https://www.drupal.org/project/cache_debug]

Cache Debug is a module that wraps around the caching layer and adds logging. Including stacktrace information. It means when a cache_set or cache_clear_all is called, you can trace back to what called it - understand the problem and fix it. Very quickly.

It comes with three logging options:
* watchdog: good if your using syslog module but deadly if you're using dblog.
* error_log: logs to your php error log
* arbitrary file: specify your own log file to log to

## Configuring Cache Debug

## Analysing the logged data
