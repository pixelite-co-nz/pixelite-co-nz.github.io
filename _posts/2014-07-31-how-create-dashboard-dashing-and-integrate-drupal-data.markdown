---
layout: post
title: "How to create a dashboard with Dashing and integrate with Drupal data"
header-img: "img/dashing/dashboard.png"
permalink: /article/how-create-dashboard-dashing-and-integrate-drupal-data
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- dashing
- dashboards
- data visualisation
- drupalplanet
---

## What is Dashing ##

[Dashing](http://dashing.io/) is a Sinatra (think ruby but not rails) based framework that lets you build dashboards. It was originally made by the guys at Shopify for displaying custom dashboards on TVs around the office.

### Why use Dashing ###

Dashing makes your life easier, freeing you up to focus on more inportant things - like what data you are looking to display, and what time of widget you want to use.

Features of dashing:

* Opensource (MIT license)
* Widgets are tiny and encapsulated, made with SASS, HTML and coffeescript
* The dashboard itself is simply HTML and SASS, meaning you can theme and style it to suit your needs
* Comes bundled with several powerful widgets
* Widgets are powered by simply data bindings (powered by batman.js)
* Push and pull methods available to each widget
* Pull jobs can be configured to run in the background on a set interval (e.g. every 30 seconds, poll Chartbeat for new data)
* Layout is drag & drop interface for re-arranging widgets

### Why not make a dashboard in Drupal ###

There are [several](https://www.drupal.org/project/homebox) [dashboard](https://www.drupal.org/project/dashboardify) [modules](https://www.drupal.org/project/admin_dashboard) in Drupal, and yes you can go to a <del>bit</del> lot of trouble and re-create the power of Dashing in Drupal, but there is no need.

Dashing is great at what it does, and it *only does one thing*.

Another advantage is that you can query other sources of data - e.g. Google Analytics or MailChimp and display metrics from those applications on your dashboard.

A really great example (including code) and can found over at [http://derekweitzel.blogspot.co.nz/2014/03/a-hcc-dashboard-with-osg-accounting.html](http://derekweitzel.blogspot.co.nz/2014/03/a-hcc-dashboard-with-osg-accounting.html)

## Installation of Dashing on Ubuntu 14.04 ##

The only real requirement is ruby 1.9+ (this comes by default in Ubunty 14.04, in Ubuntu 12.04 you need to install **ruby-1.9** explicitly)

{% highlight bash %}
sudo apt-get install ruby ruby-dev nodejs g++ bundler
sudo gem install dashing
{% endhighlight %}

you can create a new dashboard with

{% highlight bash %}
dashing new awesome_dashboard
cd awesome_dashboard
bundle
{% endhighlight %}

You start the application by

{% highlight bash %}
sudo dashing start
{% endhighlight %}

You now have a dashboard on http://localhost:3030 ready to go

## Creating a new Dashing widget ##

There are already a few tutorials online, the best of which is probably just the [existing suite of widgets available](https://github.com/Shopify/dashing/wiki/Additional-Widgets).

Here we will go through a simple example where we want to graph the of pieces of content in the "Needs review" state (provided by Workbench moderation) in Drupal. This serves as a mini-todo list for content authors, as ideally this number should be as low as possible.

In this example, we are re-cycling the "List" widget.

**Place an instance of the "List" widget on a dashboard** - e.g. sample.erb

{% highlight html %}
    <li data-row="1" data-col="1" data-sizex="1" data-sizey="1">
      <div data-id="newsarticlesreview" data-view="List" data-unordered="true" data-title="News articles in 'Needs review'"></div>
      <i class="icon-check-sign icon-background"></i>
    </li>
{% endhighlight %}

**Create a new job to poll for data**

Create a new file in **jobs/newsarticlesreview.rb**, and place:

{% highlight ruby %}
#!/bin/env ruby
# encoding: utf-8

require 'net/http'
require 'uri'
require 'json'

# TODO replace with a real production host
server = "https://localhost"

SCHEDULER.every '30s', :first_in => 0 do |job|

  url = URI.parse("#{server}/api/content/dashboard?token=FawTP0fJgSagS1aYcM2a5Bx-MaJI8Y975NwYWP12B0E")
  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = (url.scheme == 'https')
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  response = http.request(Net::HTTP::Get.new(url.request_uri))

  # Convert to JSON
  j = JSON[response.body]

  # Send the joke to the text widget
  review_content = {}
  review_content['en'] = { label: 'English', value: j['en']['news_article']['needs_review'] }
  review_content['mi'] = { label: 'Māori', value: j['mi']['news_article']['needs_review'] }
  send_event("newsarticlesreview", { items: review_content.values })
end
{% endhighlight %}


## Create a Drupal data source ##

Now we need to feed the Dashing request with a Drupal API. I have chosen to do all of these custom, as they are straight forward. In theory you could also craft these with the services module as well.

**Create hook_menu() entry**

{% highlight php %}
/**
 * Implements hook_menu().
 */
function CUSTOM_menu() {
  // Dashboard API requests. Protected using a token.
  // e.g. api/content/dashboard?token=FawTP0fJgSagS1aYcM2a5Bx-MaJI8Y975NwYWP12B0E
  $items['api/content/dashboard'] = array(
    'title' => 'Content types broken down by workflow status',
    'page callback' => 'CUSTOM_content_dashboard',
    'access callback' => 'CUSTOM_dashboard_api_access',
    'access arguments' => array('api/content/dashboard'),
    'type' => MENU_CALLBACK,
    'file' => 'CUSTOM.dashboard.inc',
  );
  return $items;
}
{% endhighlight %}


Here we define a custom route, and declare the access callback. The access callback is special as it needs to ensure that access is restricted to only requests with a special token. The token being created from a hash of the Drupal salt combined with the current path and private key, and base64 encoded (much like [drupal_get_token()](https://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_get_token/7) without the session ID check).


{% highlight php %}
/**
 * Access callback to the dashboard API endpoints. These are protected by a
 * token.
 *
 * @param String $path
 *   The path that is being requested.
 *
 * @return Boolean
 *   Whether or not the use has access to the callback.
 */
function CUSTOM_dashboard_api_access($path) {
  global $is_https;

  // HTTPS only.
  $only_allow_https = (bool) variable_get('api_https_only', 1);
  if ($only_allow_https && !$is_https) {
    return FALSE;
  }

  // Only allow get requests.
  if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    return FALSE;
  }

  // Check token is correct.
  $params = drupal_get_query_parameters();
  if (!isset($params['token']) || empty($params['token'])) {
    return FALSE;
  }
  $valid_token = CUSTOM_token_validation($path);
  if ($params['token'] !== $valid_token) {
    return FALSE;
  }

  return TRUE;
}
{% endhighlight %}


And finally the data for the callback.


{% highlight php %}
/**
 * Gathers current content statistics from Drupal, including the amount of
 * content broken down by a) content type, b) workflow state, c) status.
 *
 * @return JSON
 */
function CUSTOM_content_dashboard() {
  $output = array();

  $languages = language_list('enabled');
  $types = node_type_get_types();

  // Workbench states.
  foreach ($languages[1] as $langcode => $language) {
    foreach ($types as $machine_name => $type) {
      // Workbench moderation in use (remove this if you do not have the module).
      if (workbench_moderation_node_type_moderated($machine_name)) {
        $results = db_query("SELECT COUNT(n.vid) AS total, w.state
                             FROM {node} n
                             JOIN {workbench_moderation_node_history} w
                               ON w.vid = n.vid
                             WHERE n.type = :type
                               AND n.language = :lang
                               AND w.current = 1
                             GROUP BY w.state", array(':type' => $machine_name, ':lang' => $langcode))->fetchAllAssoc('state');

        foreach ($results as $state => $result) {
          $output[$langcode][$machine_name][$state] = (int) $result->total;
        }
      }

      // No workbench moderation for this content type, use the status column.
      else {
        $results = db_query("SELECT COUNT(n.nid) AS total, n.status
                             FROM {node} n
                             WHERE n.type = :type
                               AND n.language = :lang
                             GROUP BY n.status", array(':type' => $machine_name, ':lang' => $langcode))->fetchAllAssoc('status');

        foreach ($results as $status => $result) {
          if ($status == NODE_PUBLISHED) {
            $status = 'published';
          }
          else {
            $status = 'unpublished';
          }
          $output[$langcode][$machine_name][$status] = (int) $result->total;
        }
      }
    }
  }

  drupal_json_output($output);
  drupal_exit();
}
{% endhighlight %}

And there you have it. Note the above code relies on workbench moderation being present, if you do not have it, simply remove the section of the code that is relevant. Note that the API response is considerably more complex and complete than the example calls for, but this just means you can display more data in more ways on your dashboard.

Here is the finished product:

<img src="/img/dashing/widget-example.png" width="379" height="343" alt="Dashing example widget"  />

## Extra for experts ##

Create a init.d script for dashing, [here is a good starter](https://gist.github.com/gregology/5313326#file-dashboard).

## Comments ##

Let me know if you have completed (or started) a recent project to visual data from Drupal (or related third party applications) and your experiences there. Pictures are always welcome.