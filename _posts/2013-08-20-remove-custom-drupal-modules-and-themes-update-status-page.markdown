---
layout: post
title: Remove custom Drupal modules and themes from the update status page
permalink: /article/remove-custom-drupal-modules-and-themes-update-status-page
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- updatestatus
- drupalplanet
---


Throughout the course of building large complex Drupal sites, you invariably end up writing a suite of custom modules and features to produce the required functionality and behaviour for the site.

One issue is that when you do create these custom modules, the core update status page attempts to find new versions of your custom modules on the Drupal.org update server. Of course this check fails, but it takes up precious time to work that the module is not on drupal.org and also the grey box looks kind of ugly.

<img src="/img/remove-custom-drupal/update_status.png" width="588" height="193" alt="The update status page showing how modules on Drupal.org look nice and pretty and custom ones look grey and boring."  />

The above image is an example of this for one of my recent Drupal sites I worked on.

## Remove them from the update status page ##

In order to remove custom modules from this page, there is a convenient hook you can utilise [hook_update_projects_alter()](https://api.drupal.org/api/drupal/modules%21update%21update.api.php/function/hook_update_projects_alter/7). Here is an example piece of code that we have in one of our custom modules:

{% highlight php %}
/**
 * Implements hook_update_projects_alter().
 */
function MYMODULE_update_projects_alter(&$projects) {
  // We wish to remove our custom modules from any drupal.org updates.
  foreach($projects as $key => $project) {
    // Most custom module match this naming convention.
    if (preg_match('/^mts_.*$/', $key)) {
      unset($projects[$key]);
    }
    // These custom modules do not match the above.
    else if (in_array($key, array('token_i18n_macrons'))) {
      unset($projects[$key]);
    }
  }
}
{% endhighlight %}

Notice the `preg_match()` on module name - I find it really helpful to keep all custom modules (and themes) sudo namespaced by prefixing a small word at the front (in this case '`mts_`'). This means that this code will also work for future custom modules as well.

Hope this simple tutorial has helped you out a little. Let me know if you have any other tips and tricks for custom modules and Drupal in the comments.

## Update 22/08/2013 ##

It has been pointed out in the comments below, and on [Reddit](http://www.reddit.com/r/drupal/comments/1kqbsd/remove_custom_drupal_modules_and_themes_from_the/) that if you create a very specific hierarchy for your modules the above code is not needed. The correct hierarchy to use is

* `sites/all/modules/contrib` (all contribute modules)
* `sites/all/modules/custom` (all custom modules and features)

If you however maintain a separate directory for features (like we do, and have then nest under `sites/all/modules/features`) then the above code is still relevant.

