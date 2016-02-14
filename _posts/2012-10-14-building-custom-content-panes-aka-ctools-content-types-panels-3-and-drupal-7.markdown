---
layout: post
title: "Building custom content panes (aka ctools content types) in panels 3, and Drupal 7"
header-img: "img/post-bg-pane.jpg"
subtitle: "Custom panes > blocks"
permalink: /article/building-custom-content-panes-aka-ctools-content-types-panels-3-and-drupal-7/
permalink-disqus: /article/building-custom-content-panes-aka-ctools-content-types-panels-3-and-drupal-7
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- ctools
- panels
---

Often on Drupal sites you need the ability to create re-usable panel panes for use on the site. Each panel pane would need custom configuration, and could even be context aware (aware of were they are placed on the site).

This is where ctools content types comes in. Ctools content types are one type of plugin that the ctools module provides. Out of the box, the ctools module provides a few content types to support core modules. These can be found in the [git repository](http://cgit.drupalcode.org/ctools/tree/plugins/content_types?id=7.x-1.x).

## Advantages of ctools content types versus blocks

<ul><li>You do not need administer blocks permission (which is very risky for content authors to have)</li><li>Tight integration with panels and other panelizer. Using panelizer affords you the option of not giving away the 'administer panels' permission</li><li>Custom configuration edit forms to allow the panes to be re-usable and to make sense for your content authors</li><li>Developers can abstract away any complexity in code, leaving the content authors with only the job of adding the pane and configuring it</li></ul><p>Unfortunately there is not a lot of documentation around content types, so I will go through a simple example with you.</p><h2>Example implementation of ctools content type plugin</h2><p>In this example I will go through creating a custom twitter timeline widget that can be configured to pull through a selected user's tweets, and with an option for limiting the number displayed.</p><h3>Step 1: Create a new custom module with this in the .module file:</h3>

{% highlight php linenos %}
<?php
/**
 * Implements hook_ctools_plugin_directory().
 */
function examplemodule_ctools_plugin_directory($owner, $plugin_type) {
  if ($owner == 'ctools' && $plugin_type == 'content_types') {
    return 'plugins/' . $plugin_type;
  }
}
?>
{% endhighlight %}

<p>Where the name of my custom module is 'examplemodule'.</p><p>This lets ctools know that any file in the folder 'plugins/content_types/' should be parsed for content type plugins. This also keeps your code really nice.</p>

<h3>Step 2: Create the include file for the plugin</h3>

    mkdir -p plugins/content_types
    cd plugins/content_types
    vim twitter_timeline.inc

<p>Notice the directory structure matches what was declared in the .module file.</p>

### Step 3: Declare the plugin to ctools

{% highlight php linenos %}
<?php
$plugin = array(
  'single' => TRUE,
  'title' => t('Twitter timeline'),
  'description' => t('Shows a twitter timeline with basic configuration options.'),
  'category' => t('Social media'),
  'edit form' => 'examplemodule_twitter_timeline_edit_form',
  'render callback' => 'examplemodule_twitter_timeline_render',
  'admin info' => 'examplemodule_twitter_timeline_admin_info',
  'defaults' => array(
    'username' => 'wiifm',
    'tweets_to_show' => 5,
  )
);
?>
{% endhighlight %}

<p>This piece of code lets ctools know what functions to call, what argument defaults there are and so fourth. It should be largely self explanatory. It also means that your pane will show up in panels now, as we can see from this picture:</p>

<img alt="" class="img-responsive img-thumbnail" height="331" width="324" src="/img/drupal-pane/ctools-content-type-add.png">


### Step 4: Implementing admin_info

<p>Admin information is an optional function to implement that helps describe the pane when it is included on a panel. I would recomment always implementing it so your content authors can always see at a glance what configuration a particular pane has.</p>

{% highlight php linenos %}
<?php
/**
 * 'admin info' callback for panel pane.
 */
function examplemodule_twitter_timeline_admin_info($subtype, $conf, $contexts) {
  if (!empty($conf)) {
    $block = new stdClass;
    $block->title = $conf['override_title'] ? $conf['override_title_text'] : '';
    $block->content = t('Showing @tweets_to_show tweets from <em>@@username</em>.', array(
      '@tweets_to_show' => $conf['tweets_to_show'],
      '@username' => $conf['username'],
    ));
    return $block;
  }
}
?>
{% endhighlight %}

<p>This is what the pane will look like after being configured</p>

<img alt="" class="img-responsive img-thumbnail" height="162" width="434" src="/img/drupal-pane/ctools-content-type-admin-info.png">

<h3>Step 5: Implementing the edit form</h3>

<p>The heart of ctools content types is the ability to create simple configuration forms for your content authors so they can easily create and edit panes. Edit forms use standard form API, so they are really easy to make</p>

{% highlight php linenos %}
<?php
/**
 * 'Edit form' callback for the content type.
 */
function examplemodule_twitter_timeline_edit_form($form, &$form_state) {
  $conf = $form_state['conf'];

  $form['username'] = array(
    '#title' => t('Twitter username'),
    '#description' => t('The username of the twitter account in which to pull the tweets from.'),
    '#type' => 'textfield',
    '#default_value' => $conf['username'],
    '#required' => TRUE,
  );

  $form['tweets_to_show'] = array(
    '#title' => t('Number of tweets to show'),
    '#description' => t('Used to control the number of tweets shown on the page initially. Defaults to 5.'),
    '#type' => 'select',
    '#options' => drupal_map_assoc(range(3, 12)),
    '#default_value' => $conf['tweets_to_show'],
    '#required' => TRUE,
  );

  return $form;
}
?>
{% endhighlight %}

<p>In order to save the configuration back to the $conf storage for the pane, you will also need a submit handler</p>

{% highlight php linenos %}
<?php
/**
 * The submit form stores the data in $conf.
 */
function examplemodule_twitter_timeline_edit_form_submit($form, &amp;$form_state) {
  foreach (array_keys($form_state['plugin']['defaults']) as $key) {
    if (isset($form_state['values'][$key])) {
      $form_state['conf'][$key] = $form_state['values'][$key];
    }
  }
}
?>
{% endhighlight %}

<p>There you have it, now you can configure the pane username, and the amount of tweets to show, all of which have sane defaults and helpful descriptions for your content authors. This is what this step looks like:</p>

<img alt="" class="img-responsive img-thumbnail" height="345" width="524" src="/img/drupal-pane/ctools-content-type-edit.png">

<h3>Step 6: Implemeting the render callback</h3><p>This is the guts of the pane, and is responsible for producing markup to be rendered on the page. I have taken a simplitest approach to this and have not used a theme function (and template), in reality I would encourage this as well.</p>

{% highlight php linenos %}
<?php
/**
 * Run-time rendering of the body of the block (content type)
 * See ctools_plugin_examples for more advanced info
 */
function examplemodule_twitter_timeline_render($subtype, $conf, $panel_args, $context = NULL) {
  $block = new stdClass();

  // initial content is blank
  $block->title = '';
  $block->content = '';

  // Include twitter javascript - by linking to the external file.
  drupal_add_js('//widgets.twimg.com/j/2/widget.js', 'external');

  // Add in the content
  $block->content .= '
    <script type="text/javascript">
      var t = new TWTR.Widget({
        version: 2,
        type: "profile",
        rpp: ' . check_plain($conf['tweets_to_show']) . ',
        interval: 30000,
        width: "300",
        height: "300",
        theme: {
          shell: {
            background: "#ededed",
            color: "#6a6a6a"
          },
          tweets: {
            background: "#fafafa",
            color: "#6a6a6a",
            links: "#6a6a6a"
          }
        },
        features: {
          avatars: false,
          hashtags: true,
          scrollbar: false,
          loop: true,
          live: true,
          behavior: "default"
        }
      });

      t.render().setUser("' . check_plain($conf['username']) . '").start();
    </script>';

  return $block;
}
?>
{% endhighlight %}

<p>Here is a sample panel page, with the twitter timelien pane on the right hand side</p>

<p><a href="/img/drupal-pane/ctools-content-type-page-1.png" target="_blank"><img alt="" class="img-responsive img-thumbnail" height="559" style="width: 600px; height: 428px;" width="783" src="/img/drupal-pane/ctools-content-type-page-1.png"></a></p>

<p>And as you can imagine, it is relatively easy to add more panes onto the panel, here is another on the same page</p>

<p><a href="/img/drupal-pane/ctools-content-type-page-2.png" target="_blank"><img alt="" class="img-responsive img-thumbnail" height="645" style="width: 199px; height: 400px;" width="321" src="/img/drupal-pane/ctools-content-type-page-2.png"></a></p>

<h2>Full module download</h2>

<p>I thought this post might be a bit code heavy, so I decided to <a href="http://dl.dropbox.com/u/759954/pixelite/examplemodule.tar.gz" target="_blank">include the full source of the module</a> in case you want to download and install it yourself. Feel free to rename it, extend it, do what you want with it.</p><h2>Final thoughts</h2><p>In this tutorial you have seen how easy it is to make a fully custom ctools content type plugin, from scratch. And hopefully begin to see how this is more powerful then traditional blocks.</p><p>What are your experiences with ctools content types, and helpful advice for others? Did this tutorial help you at all? Let me know in the comments.</p>
