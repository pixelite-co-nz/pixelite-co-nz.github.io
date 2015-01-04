---
layout: post
title: "Adding Apple and Android favicons to Drupal"
subtitle: "Icons on all the things"
excerpt: "As you end up building more and more websites that target mobile devices (e.g. iPhone, iPad, Android, Windows), you need to supply an ever increasing amount of favicons."
header-img: "img/post-bg-favicon.png"
permalink: /article/adding-apple-android-favicons-drupal
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- favicon
- theming
---

As you end up building more and more websites that target mobile devices (e.g. iPhone, iPad, Android, Windows), you need to supply an ever increasing amount of favicons. This process can be complex if done by hand, luckily there is an easy way to introduce these into your Drupal site.

## What you will need ##

Before we start you will need a high quality icon to begin with, the icon should be:

* 260x260px (i.e. square)
* a PNG with transparency as needed
* recognizable when shrunk right done to your browser favicon (so don't use your entire logo complete with words).

## Generating the favicons ##

This is where the really handy [realfavicongenerator.net](http://realfavicongenerator.net/) website comes into play. I have used many other websites that offer similar functionality, but this seems to be the best, and is dead simple to use.

You will need to upload the 260x260px PNG file, and also select a hex color for the Windows 8 tile, but this should be straight forward.

I also opt for the option "I will place favicon files (favicon.ico, apple-touch-icon.png, etc.) at the root of my web site." as this seems the most sensible place for them anyway.

When you complete the process, you will be able to download a zip file containing a whole bunch of icons and XML files, this is fine, extract them to your docroot for Drupal.

## Adding the favicons to Drupal ##

You now will need to edit your `html.tpl.php` inside your theme, and add the code that the generator provides. The code should resemble something like this:

{% highlight html linenos %}
<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
<link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">
<link rel="icon" type="image/png" href="/favicon-160x160.png" sizes="160x160">
<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
<meta name="msapplication-TileColor" content="#b91d47">
<meta name="msapplication-TileImage" content="/mstile-144x144.png">
{% endhighlight %}

You will notice though that Drupal likes to place it's default favicon into the `<head>` section of the page, we need to remove this in order for it not to mess up the above code you inserted.

{% highlight html %}
<link rel="shortcut icon" href="http://[YOURSITE]/misc/favicon.ico" type="image/vnd.microsoft.icon" />
{% endhighlight %}

The following code below can be inserted into your `template.php` file for your theme to remove the default favicon from Drupal:

{% highlight php linenos %}
<?php
/**
 * Remove the unneeded favicon from the head section.
 */
function YOURTHEME_html_head_alter(&$head_elements) {
  foreach ($head_elements as $key => $element) {
    if (!empty($element['#attributes'])) {
      if (array_key_exists('href', $element['#attributes'])) {
        if (strpos($element['#attributes']['href'], 'misc/favicon.ico') > 0) {
          unset($head_elements[$key]);
        }
      }
    }
  }
}
?>
{% endhighlight %}

There you have it all done.

## Update 5 January ##

[We have created a simple module "Responsive Favicons"](https://www.drupal.org/project/responsive_favicons) to help people new to Drupal get those metatags in the head section of the HTML, you can also upload the zip file and it will upload and extract them for you as well.

## Extra for experts - Google's theme-color meta tag ##

[Google recently announced](http://updates.html5rocks.com/2014/11/Support-for-theme-color-in-Chrome-39-for-Android) that from Chrome 39 onwards on Android Lollipop (5.0+), a new meta tag will be supported

{% highlight html %}
<meta name="theme-color" content="#b91d47" />
{% endhighlight %}

This is what your site's title bar now looks like (instead of boring and grey).

<img src="{{ site.url }}/img/favicon-theme-color.png" alt="The theme-color meta tag in use on www.maoritelevision.com" class="img-responsive img-thumbnail" style="max-height:600px;" />

This meta tag can be added to your `html.tpl.php` file as above.

## Comments ##

Let me know if this has helped you, and also if you have any other tips and tricks when it comes to favicons on your mobile devices.
