---
layout: post
title: Attaching AJAX events to non-form page elements in Drupal
header-img: "img/post-bg-01.jpg"
subtitle: "Making AJAX request in Drupal using the form API is real nice and simple"
permalink: /article/attaching-ajax-events-non-form-page-elements-drupal
author: "Craig Pearson"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- ajax
- javascript
---

Making AJAX request in Drupal using the form API is real nice and simple, but did you know you can also attach AJAX actions to normal page elements easlily as well? In this quick tutorial I'll show you how to easily do just that. It also provides support for browsers that dont support Javascript.

The code below is pretty standard Drupal code. It sets up a couple of menu items, and a couple of pages. One page displays a link "Click to load" and upon clicking on that link you are taken to a page that has a list of links to some common search engines. Pretty straight forward.

{% highlight php linenos %}
<?php
/**
 * Implements hook_menu().
 */
function ajax_example_menu() {
  $items = array();
  $items['ajax_example'] = array(
    'title' => 'AJAX example',
    'page callback' => 'ajax_axample_landing_page',
    'access arguments' => array('access content'),
    'type' => MENU_NORMAL_ITEM,
  );
  $items['ajax_example/target'] = array(
    'title' => 'AJAX target content',
    'page callback' => 'ajax_example_target_page',
    'access arguments' => array('access content'),
    'type' => MENU_CALLBACK,
  );
  return $items;
}

/**
 * Page callback for returning content to display on the
 * example page.
 */
function ajax_axample_landing_page() {
  return l('Click to load', 'ajax_example/target');
}

/**
 * This is the target page, We want to load this using AJAX
 */
function ajax_example_target_page() {
  $links = array(
    'bing' => array(
      'title' => 'Bing',
      'href' => 'http://www.bing.com'
    ),
    'gogle' => array(
      'title' => 'Google',
      'href' => 'http://www.google.com'
    ),
    'yahoo' => array(
      'title' => 'Yahoo',
      'href' => 'http://www.yahoo.com'
    ),
  );
  return theme('links', array('links' => $links));
}
?>
{% endhighlight %}

<img alt="" class="img-responsive img-thumbnail" height="190" width="308" typeof="foaf:Image" src="/img/drupal-ajax/First.png">

<img alt="" class="img-responsive img-thumbnail" height="190" width="308" typeof="foaf:Image" src="/img/drupal-ajax/Second.png">

Now, what if I wanted to load the search engine links page via AJAX, and append them to the current page? It's actually really simple, and it doesn't involve much additional code either. Lets take a look. All I need to do is make a few changes. The first thing we want to do is alter the landing page code, which will make it look like this.

{% highlight php linenos %}
<?php
/**
 * Page callback for returning content to display on the
 * example page.
 */
function ajax_axample_landing_page() {
  drupal_add_js('misc/ajax.js');
  return l(t('Click to load')  , 'ajax_example/target/nojs/',
    array('attributes' => array('class' => array('use-ajax')))
  ) . '<div id="target"></div>';
}
?>
{% endhighlight %}

<p>The first thing I have done here is added <strong>misc/ajax.js</strong> to the page. This will ensure that the library is included.</p><p>Secondly I have added a <strong>/nojs/</strong> to the end of the link URI. This is a special property that the AJAX library uses when sending requests, it will be replaced with <strong>/ajax/</strong> when making ajax requests. This value is also passed to the page callback so we know how the request was made. We'll look at that function in a second.</p><p>You'll see I have also added a CSS class to the link. <strong>use-ajax</strong>. This tells Drupal to use ajax. When this class is added, Drupal will request the URL of the link with AJAX.</p><p>I tacked on a <strong>&lt;div id="target"&gt;&lt;/div&gt;</strong> after the link. This is where we want to put the results from our AJAX request.</p><p>We have to make some changes to the page callback we are requesting too. Let's now take a look those changes.</p>

{% highlight php linenos %}
<?php
/**
 * This is the target page, We want to load this using AJAX
 */
function ajax_example_target_page($type = 'ajax') {
  $links = array(
    'bing' => array(
      'title' => 'Bing',
      'href' => 'http://www.bing.com'
    ),
    'gogle' => array(
      'title' => 'Google',
      'href' => 'http://www.google.com'
    ),
    'yahoo' => array(
      'title' => 'Yahoo',
      'href' => 'http://www.yahoo.com'
    ),
  );

  $content = theme('links', array('links' => $links));
  if ($type != 'ajax') {
    return $content;
  }

  $commands = array();
  $commands[] = ajax_command_replace("#target", $content);
  ajax_deliver(array('#type' => 'ajax', '#commands' => $commands));
}
?>
{% endhighlight %}

<p>A few things have changed here, first up the function declaration now has an optional parameter, <strong>$type = 'ajax'</strong> this parameter is passed to the funciton by the Drupal AJAX library, it's value is <b>nojs</b> when javascript is not available. <em>NOTE: if you are using <strong>'page arguments'</strong> in your menu definition, then the <strong>$type</strong> variable will be last.</em></p><p>I have assigned the content to the <strong>$content</strong> variable and if the request isn't AJAX based we simply just return it. This allows those browsers that dont support Javascript like screen readers etc to still view the content that is linked to.</p><p>After that you'll see that I build a commands array and add the result of <strong>ajax_command_replace('#target', $content)</strong> to it. What I am doing here is telling Drupal that I want to run the ajax replace command, <strong>'#target'</strong> is the css selector of what I want to replace and <strong>$content</strong> contains the HTML I want to replace it with.</p><p>At this point I could also add any number of the pre-defined <a href="http://api.drupal.org/api/drupal/includes%21ajax.inc/group/ajax_commands/7">Drupal AJAX commands</a> to the commands array, or even some custom commands I'd defined myself. However for the purpose of this tutorial, we'll keep it simple</p><p>The last thing we do is make a call to <strong>ajax_deliver()</strong>. This renders the response as a valid JSON/AJAX response. From that point the Drupal AJAX library handles the rest.</p>

<img alt="" class="img-responsive img-thumbnail" height="190" width="308" typeof="foaf:Image" src="/img/drupal-ajax/Third.png">

<img alt="" class="img-responsive img-thumbnail" height="190" width="308" typeof="foaf:Image" src="/img/drupal-ajax/Forth.png">

Now when we click the link we get the Drupal AJAX spinner and then the page is updated with the list of search engines. It's as easy as that.
