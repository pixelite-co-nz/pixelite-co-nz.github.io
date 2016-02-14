---
layout: post
title: "Error aggregation and alerting with Drupal 7 and Raygun.io"
header-img: "img/post-bg-raygun.png"
permalink: /article/error-aggregation-and-alerting-drupal-7-and-raygunio/
permalink-dsiqus: /article/error-aggregation-and-alerting-drupal-7-and-raygunio
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- errors
- drupalplanet
---

Being able to work out when an issue started occurring an what impact it is having on real people using your site is critical business information that too often gets overlooked.

## Existing (core) modules that can help ##

Drupal core ships with a few modules that go some way as to helping you track down application errors:

* **dblog** - writes PHP error and watchdog messages to the database, where they can be filtered. On cron the old messages are optionally truncated at pre-defined intervals.
* **syslog** - writes PHP error and watchdog messages to the syslog on the server. Logs are plain text and can be parsed by numerous standard programs (e.g. grep, Splunk).

The main issue with the above modules is that they:

* fail to aggregate errors for you - if the issue happens 1 or 1,000 times, you have no way no knowing this without working it out yourself
* provide enough detail in order to fix the underlying issue - there is no stacktrace, no line numbers etc
* are not application version specific - you don't know what release introduced the bug
* cannot log PHP white screens of death - for instance exceeding the PHP max execution time will not result in a watchdog entry, so you are potentially missing really important information.

## Introducing the Raygun.io module ##

The [Raygun.io](https://drupal.org/project/raygun) module aims to solve this problem by replacing the PHP's exception and error handler with custom error handlers. These handlers simply send the error and all it's surrounding metadata off to a third party server - in this case [Raygun.io](http://raygun.io/).

Raygun.io takes care of the aggregation and alerting around the errors. You can choose to have immediate notifications for new errors, or receive daily summaries of the days activity.

The error sending happens asynchronously so any errors will not hold up your main web thread from executing (useful if there are firewall(s) between your Drupal web servers and the internet).

## Screenshots ##

Main dashboard that can you filter by time and application version:

<a href="/img/raygun/raygun-dash.png">
  <img src="/img/raygun/raygun-dash.png" width="220" height="171" alt="" class="img-responsive img-thumbnail" />
</a>

Error drilldown:

<a href="/img/raygun/raygun-error.png">
  <img src="/img/raygun/raygun-error.png" width="220" height="199" alt="" class="img-responsive img-thumbnail" />
</a>

Drupal configuration form for the module:

<a href="/img/raygun/raygun-settings.png">
  <img src="/img/raygun/raygun-settings.png" width="143" height="220" alt="" class="img-responsive img-thumbnail" />
</a>

## Comments ##

Let me know if you have used third party error aggregation and alerting modules with your Drupal site and what lessons you have learned.
