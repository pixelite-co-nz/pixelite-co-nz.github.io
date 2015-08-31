---
layout: post
title: How to exclude CasperJS from your Google Analytics statistics
permalink: /article/how-exclude-casperjs-your-google-analytics-statistics
author: "Sean Hamlin"
categories:
- tutorial
tags:
- casperjs
- google-analytics
- drupalplanet
- javascript
---

This came up when I we were going through our usual regression suite for the production site, this regression suite is now > 1,000 tests, and visits a lot of pages on the site. I noticed that Google Analytics was recording hits for each CasperJS page load. This makes perfect sense, as essentially CasperJS is an entire headless webkit browser that executes *all* the JavaScript on the page.

## How to cleanly remove the statistics ## {#remove}

There are a number of ways you can remove page views from Google Analytics, for example:

1. Using Google Analytics filters on Google's website
1. Using JavaScript filters on your own website

I opted for option #2 - to alter the JavaScript on the website, as this in my mind produced the cleanest result. In this method, no tracking statistics are even sent to Google, and there is no messy UI to deal with. It also saves your statistics admins from having to set up messy filters in Google Analytics, as these if misconfigured, can really mess up your analytics.

## How to set up the tracking code ## {#code}

Old tracking code (default tracking code):

{% highlight javascript %}
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-1234567-1"]);
_gaq.push(["_trackPageview"]);
(function() {var ga = document.createElement("script");ga.type = "text/javascript";ga.async = true;ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ga, s);})();
{% endhighlight %}

Modified tracking code:

{% highlight javascript %}
if (!navigator.userAgent.match(/.*(Pingdom|CasperJS).*/gi)) {
  var _gaq = _gaq || [];
  _gaq.push(["_setAccount", "UA-1234567-1"]);
  _gaq.push(["_trackPageview"]);
  (function() {var ga = document.createElement("script");ga.type = "text/javascript";ga.async = true;ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ga, s);})();
}
{% endhighlight %}

In CasperJS, ensure the correct user agent is set:

I opted to use a Chrome user agent, with an extension on the end to denote CasperJS (and the version).

{% highlight javascript %}
var casper = require('casper').create({
  pageSettings: {
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.60 Safari/537.17 CasperJS/1.0.2',
  }
});
{% endhighlight %}

## How to alter the JavaScript in Drupal ## {#drupal}

If you use Drupal, then you can just use the following code in your own custom module:

{% highlight javascript %}
/**
 * Implements hook_js_alter().
 */
function EXAMPLEMODULE_js_alter(&$javascript) {
  // Alter Google Analytics code to suppress the tracking of CasperJS in the
  // stats. The checking of the user agent needs to be done at the JS level in
  // order to have 100% cacheable pages.
  $scope = variable_get('googleanalytics_js_scope', 'header');
  foreach ($javascript as $index => $js) {
    if ($js['type'] == 'inline' && $js['scope'] == $scope && strpos($js['data'], '_gaq.push([') > 0) {
      // Add additional JavaScript at the beginning and at the end.
      $start = 'if (!navigator.userAgent.match(/.*(Pingdom|CasperJS).*/gi)) {';
      $end = '}';
      $javascript[$index]['data'] = $start . $javascript[$index]['data'] . $end;
    }
  }
}
{% endhighlight %}

**Update 1<sup>st</sup> May 2013**

Have updated the JS alter hook to be more robust, as the original code was causing JS errors on Drupal search pages. If you have used the old code, please update the the new code (found above).

## Wait can you exclude other services from Google Analytics? ## {#more}

If you look at the above regex on the user agent matching, you can see I have added Pingdom into there as well. This is merely an example to show you the flexibility of this solution. You can adjust the regex to match the user agents you want to block.

If you remove CasperJS from Google Analytics in another fashion (or don't bother and have a reason), or have some improvements, let me know in the comments.
