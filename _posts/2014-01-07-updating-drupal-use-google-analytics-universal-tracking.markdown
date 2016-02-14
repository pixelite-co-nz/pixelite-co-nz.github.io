---
layout: post
title: Updating Drupal to use Google Analytics Universal tracking
permalink: /article/updating-drupal-use-google-analytics-universal-tracking/
permalink-disqus: /article/updating-drupal-use-google-analytics-universal-tracking
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- google-analytics
---

So Google Analytics has a new version of Google Analytics dubbed "Universal Analytics", which has a bunch of new features, that could be handy for your website. I would dive into exactly what they are here, as you can read about them on [Google's own website](https://support.google.com/analytics/answer/2790010?hl=en).

In this post I will go through the steps to upgrade the Google Analytics 7.x-1.x module to the new 7.x-2.x version that supports Universal Analytics.

## Update the Drupal module ##

If you read the [Google Analytics module page](https://www.drupal.org/project/google_analytics) you will spot that there are two different branches in use, in order to get the correct version you will need to get the 7.x-2.x version.

You can do this with Drush:

{% highlight bash %}
drush dl google_analytics
drush updb
{% endhighlight %}

## Event tracking ##

If you have used custom event tracking in your website, a few changes are required.

Instead of

{% highlight javascript %}
_gaq.push(['_trackEvent', 'category', 'action', 'opt_label', opt_value, opt_noninteraction]);
{% endhighlight %}

It is now

{% highlight javascript %}
ga('send', 'event', 'category', 'action', 'opt_label', opt_value, {'nonInteraction': 1});
{% endhighlight %}

### Handy grep command ###

If you want to find the offending lines of code, you can use grep

{% highlight bash %}
grep -nrI "_trackEvent" *
{% endhighlight %}


## Custom variables are now dimensions and metrics ##

If you were using the old style custom variables, these are now completely gone, now replaced with dimensions and metrics. You can [read more about these on Google's website](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets).

Instead of

{% highlight javascript %}
_gaq.push(['_setCustomVar',
  1,                           // Slot
  'Customer Type',             // Name
  'Paid',                      // Value
  1                            // Scope (1 = User scope)
]);
{% endhighlight %}

It is now

{% highlight javascript %}
ga('set', 'dimension1', 'Paid');
{% endhighlight %}


### Drupal support of custom dimensions and metrics ###

The Drupal module has an active issue that allows you to configure this through the UI, <del>unfortunately this is still only a patch at the moment, but is looking likely to be committed shortly<del>.

Update 24 July 2014 - this is now bundled into the latest stable release now.

## DoubleClick data ##

If you were using the additional data that DoubleClick integration provided, this is now supported, this is just a tickbox on the admin settings page.

To enable it

{% highlight php %}
variable_set('googleanalytics_trackdoubleclick', 1)
{% endhighlight %}


## Other new features in Universal Analytics ##

### UserID tracking ###

This effectively allows you to track the same user across multiple devices. This comes in handy if your users can login to your Drupal site, and they would likely login on their mobile phones, and tablets etc. You can read more on [Google's page about User ID tracking](https://support.google.com/analytics/answer/3123663)

To enable it

{% highlight php %}
variable_set('googleanalytics_trackuserid', 1)
{% endhighlight %}

### Enhanced Link Attribution feature ###

Allows Google Analytics to differentiate URLs based on what link the user clicked on, really handy if you have many links pointing at the same page. You can read more on [Google's page about User ID tracking](https://support.google.com/analytics/answer/2558867)

To enable it

{% highlight php %}
variable_set('googleanalytics_tracklinkid', 1)
{% endhighlight %}

## Finally ##

Run this little gem over your codebase to ensure there are no legacy Google Analytics code lying around.

{% highlight bash %}
grep -nrI "_gaq" *
{% endhighlight %}


Let me know if you have any tips or tricks in the comments for the new Google Analytics
