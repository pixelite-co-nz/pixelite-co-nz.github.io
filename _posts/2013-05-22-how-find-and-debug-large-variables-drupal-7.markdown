---
layout: post
title: How to find and debug large variables in Drupal 7
permalink: /article/how-find-and-debug-large-variables-drupal-7
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- debugging
- code
- development
---


On a recent large Drupal project we were finding that the  table was holding around 4 MB of data. The issue of course with this is that this is loaded into memory on each page request regardless of whether or not you use it. Another issue is that the variable table holds serialized data, and there is an additional CPU overhead of actually de-serializing the data as well.

## Introducing Variable debug ##

So I wrote a module [Variable debug](http://drupal.org/project/variable_debug "A link to the module on Drupal.org") that is a straight forward and simple module that attempts to do only two things (at the moment):

1.  A list of the highest memory usage variables stored in the {variable} table sorted by highest to lowest. There is also a list of links to Drupal.org issues to help resolve some known high usage offenders. If you know of an issue that exists that aims to resolve in-efficient usage of the variable table, please raise a new issue in the issue queue for this module.

1.  A list of all suspected orphaned variables in the variable table. This is determined by whether or not the variable is:
    1. Not a variable provided by Drupal core
    1. Does not start with an enabled module name

    This can help you find and remove potential abandoned variables that are of no use to you and your site.

## Symptoms of rogue variables ##

Sometimes Drupal contributed modules use the variable table as a dumping ground for large variables that really should be stored in dedicated tables. Here is an example from one of our websites using the SQL query:

{% highlight sql %}
    SELECT LENGTH(value) AS length, name FROM variable ORDER BY length ASC;
{% endhighlight %}

And the end of the result:

{% highlight sql %}
    |    534 | hs_config_taxonomy-17                                           |
    |    551 | subscription_mail_status_activated_body                         |
    |    561 | hs_config_taxonomy-13                                           |
    |    573 | googleanalytics_custom_var                                      |
    |    580 | article_import_known_columnists                                 |
    |    600 | menu_masks                                                      |
    |    617 | order_completion_text_digital_auth                              |
    |    620 | menu_default_active_menus                                       |
    |    622 | order_completion_text_corporate_auth                            |
    |    626 | user_mail_register_no_approval_required_body                    |
    |    638 | menu_minipanels_hover                                           |
    |    660 | field_bundle_settings_node__page                                |
    |    666 | article_import_known_agencies                                   |
    |    700 | field_bundle_settings_node__collection                          |
    |    702 | field_bundle_settings_node__article                             |
    |    733 | order_completion_text_print_auth                                |
    |    781 | field_bundle_settings_node__promotion                           |
    |    869 | order_completion_text_digital                                   |
    |    903 | subscription_activation_text_unverified                         |
    |    939 | order_completion_text_print                                     |
    |    955 | order_completion_text_corporate                                 |
    |    991 | field_bundle_settings_node__subscription                        |
    |   1012 | subscription_activation_text_pending                            |
    |   1073 | field_bundle_settings_commerce_product__subscription_product    |
    |   1278 | entityreference:base-tables                                     |
    |   1783 | high_risk_districts                                             |
    |   1988 | commerce_enabled_currencies                                     |
    |   2356 | metered_useragent_whitelist                                     |
    |   2515 | rules_empty_sets                                                |
    |   2796 | apachesolr_index_last                                           |
    |   3178 | memcache_wildcard_flushes                                       |
    |   3673 | drupal_js_cache_files                                           |
    |   7804 | features_codecache                                              |
    |  14840 | drupal_css_cache_files                                          |
    | 852329 | imagefield_crop_info                                            |
    +--------+-----------------------------------------------------------------+
    1207 rows in set (0.02 sec)
{% endhighlight %}


Anything over several hundred bytes in the variable table really has to take a step back any look at better utilising cache tables.

## Integration with Drupal.org issues ##

The next feature I added to the module was known large variables, and links to Drupal.org issue queue items that contain patches to resolve the large memory usage.

Here is a screenshot showing the functionality.

<img src="/img/debug/Selection_048.png" alt="Screenshot of the functionality showing links to Drupal.org issues"  />

## Questions ##

Let me know in the comments if this helps you, also if you have any other known rogue variables that have Drupal.org issues, that would also be welcome.
