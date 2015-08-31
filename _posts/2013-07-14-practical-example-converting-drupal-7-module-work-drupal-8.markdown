---
layout: post
title: "A practical example for converting a Drupal 7 module to work with Drupal 8"
permalink: /article/practical-example-converting-drupal-7-module-work-drupal-8
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- development
- tutorial
---

Drupal.org has this information, but it is largely scattered around on these URLs:

* [https://drupal.org/update/modules/7/8](https://drupal.org/update/modules/7/8)
* [https://drupal.org/list-changes/drupal?to_branch=8.x](https://drupal.org/list-changes/drupal?to_branch=8.x)

It can be hard to find a real life example on how to update your contributed modules with the new Drupal 8 architecture.

Here is an example module that I maintain ([js_injector](https://drupal.org/project/js_injector)), which at the moment depends on:

* Drupal 7 core
* ctools exportables (see the [documentation](https://drupal.org/node/928026) for more information on this)

I am going to try and refactor the module to use Drupal 8 core components only and deprecate the ctools dependency.

## The .info is dead, long live YAML ##

One of the first things you will notice is there is no longer the `.ini` syntax .info file in the root of the module. It has now been converted to YAML.

**Old info file:**

{% highlight php %}
name = JS injector
description = Adds JavaScript to the page output based on configurable rules
core = 7.x
configure = admin/config/development/js-injector
dependencies[] = ctools
{% endhighlight %}

**New .info.yml file**

{% highlight php %}
name: 'JS injector'
type: module
description: 'Adds JavaScript to the page output based on configurable rules.'
core: 8.x
configure: admin/config/development/js-injector
{% endhighlight %}

So not too many changes here, mainly just syntax. It is important to read the [change record](https://drupal.org/node/1935708) for this if you .info file is more advanced, as items such as the new autoloader deprecate the Drupal 7 `files[]` super arrays.

## The switch from ctools exportables to Drupal 8's configuration entities (CMI) ##

One of the major changes to Drupal 8 is the Configuration Management Initiative (CMI). This initiative was introduced as a standardised way to have configuration stored outside your database, so that it could be staged and deployed. There were helper modules for Drupal 7 to do some of this (e.g. Features and strongarm) but there were always holes with this approach (e.g. try and export a block configuration). CMI solves this issue by storing *all* configuration as configuration entities that reside solely in the filesystem as YAML files.

You can take a sneak peak are what Drupal is storing in YAML if you open up the directory sites/default/files/config_[hash]/active

<img src="/img/d7-d8/d8-yaml.png" alt="YAML files sitting in the config directory in Drupal 8"  />

### What this meant for the js_injector module ###

This code could be re-used:

* the form API definition - pretty much no changes here which is nice

This code was changed/new:

* Removal of all ctools plugins supporting code
* Update hook to convert all legacy rows in the custom table into new configuration entities
* Removal of hook_schema() as this is no longer required
* New classes that implement/extend the required interfaces that the CMI provides
* Annotations, these are fun
* Converting all load functions to use the entity loading framework

All in all, it is a massive change to switch from ctools exportables to the new CMI configuration entities. But when it is all said and done, the new code is much cleaner, easier to read and is lazily loaded with the new Symfony autoloader.

Here is a screenshot of the new entitylist screen:

<img src="/img/d7-d8/js_injector_d8.png" alt="New CMI based entity list screen in Drupal 8"  />

Another really awesome resource I found for CMI information was actually the user roles CMI configuration found in Drupal 8 core. You can view the code [online within the repository](http://drupalcode.org/project/drupal.git/tree/refs/heads/8.x:/core/modules/user).

Helpful links:

* Blog post by PreviousNext on [config entities](http://previousnext.com.au/blog/understanding-drupal-8s-config-entities)
* Drupal 8 [conversion of user_roles into CMI](https://drupal.org/node/1479454)
* Drupal [change notice](https://drupal.org/node/1818734)

## hook_menu() is still there, but now with Symfony routes integration ##

**Old hook_menu() code:**

None, this was handled entirely by ctools exportables.

**New hook_menu() code:**

    $items['admin/config/development/js-injector'] = array(
      'title' => 'JS injector rules',
      'description' => 'Add and modify JavaScript injector rules.',
      'route_name' => 'js_injector_rule_admin',
    );

**New route information (in file js_injector.routing.yml):**

    js_injector_rule_admin:
      pattern: '/admin/config/development/js-injector'
      defaults:
        _entity_list: 'js_injector_rule'
      requirements:
        _permission: 'administer js_injector'

The new Symfony routing components extend what was impossible with plain ol hook_menu() in Drupal 7. It is now possible to overload path placeholders and have one that listens for an integer, and another that is listening for a string. Similarly you can also add HTTP requirements to each end point.

For more information see the [change request](https://drupal.org/node/1800686) and the [Symfony documentation](http://symfony.com/doc/current/book/routing.html).

## hook_init() is gone ##

I was wondering why this hook was not firing, turns out this was [removed recently](https://drupal.org/node/2013014) - I was able to replace it instead with [hook_page_build()](https://api.drupal.org/api/drupal/core%21modules%21system%21system.api.php/function/hook_page_build/8).

So this was a simple change. I actually like this change from Drupal here, as all to often contributed modules like to do silly expensive things within hook_init() not realising in Drupal 7 they fire on every page request.

## $_GET['q'] is gone ##

The PHP super global key` $_GET['q']` is 100% missing in Drupal 8, now you are forced to use the standard method current_path(). For more information see the [change request](https://drupal.org/node/1659562).

## variable_set()/variable_get() are gone ##

In Drupal 7, all variables are global, so accessing and saving them is done this way:

    // Load the site name out of configuration.
    $site_name = variable_get('site_name', 'Drupal');
    // Change the site name to something else.
    variable_set('site_name', 'This is the dev site.');

In Drupal 8, configuration will only be lazy-loaded when needed. The above code would therefore change as follows:

    // Load the site name out of configuration.
    $config = config('core.site_information');
    $site_name = $config->get('site_name');
    // Change the site name to something else.
    $config->set('site_name', 'My Awesome Site');
    $config->save();

It would be worth reading [this tutorial](https://drupal.org/node/1667896) for more information on how to upgrade your code.

## Conclusion ##

So it took a few hours of reading, writing, testing, breaking and fixing in order to upgrade the js_injector module to Drupal 8, but all in all, it was a positive experience. I have created a 8.x-1.x branch for js_injector and did the [entire upgrade largely with one commit](http://drupalcode.org/project/js_injector.git/commit/a007b54dddf2fc3f6c9f7fa88014c0d29d7c5f44).

I encourage you to read through the commit, hopefully this comes in handy for your module in the near future. I am keen to hear feedback on this branch, let me know how well the module worked for you on Drupal 8, and if you have any suggestions for improvements let me know.

<!-- Abbreviations -->
*[YAML]: YAML Ain't Markup Language
*[CMI]: Configuration Management Initiative
