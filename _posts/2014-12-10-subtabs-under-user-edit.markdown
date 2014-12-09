---
layout: post
title: Tabs under User Edit tab in Drupal
header-img: "img/post-bg-tabs-under-tabs.png"
permalink: /article/subtabs-under-user-edit
author: "Gold (@unifex)"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- menus
- programming
---
#tl;dr;
To get your tabs to appear on the user edit page use [hook_user_categories()] and [hook_menu_alter()].
#The detail
Getting submenu items to appear within the user edit area of Drupal has not always worked as I would expect from reading the documentation around [hook_menu()]. As it happens the user module provides hooks to make this quite simple.

[hook_user_categories()] allows you to return a subset of the parameters you'd expect to see in [hook_menu()].

In this example we would have a new set of tabs added to the User Edit page.  The first is *Account* and is now presented because we have more than one tab here now.  The second is *Report Settings* and it would have a URL like `user/12345/edit/report_settings` where *report_settings* is taken from the name parameter.

```php
/**
 * Impliments hook_user_categories().
 */
function my_module_user_categories() {
  return array(
    array(
      'name' => 'report_settings',
      'title' => t('Report settings'),
      'weight' => 1,
      'access callback' => 'user_edit_access',
      'access arguments' => array(1),
    )
  );
}
```

At this point we have a new menu item presented as a tab on the user edit page and clicking it takes us to a blank form with a submit button. I think this is due to the way menu items can inherit behaviour from parent menu items. We'll be wanting to overload that behaviour though and present our own form.  This can be done through [hook_menu_alter()].

Checking the keys of the array passed to [hook_menu_alter()] we should find that we have a new one called `user/%user_category/edit/report_settings`. We can edit this one to point it at our prefered form built using the [Form API] as usual.

```php
/**
 * Impliments hook_menu_alter().
 */
function my_module_menu_alter(&$callbacks) {
  $callbacks['user/%user_category/edit/report_settings']['page arguments'] = array('my_module_user_report_settings', 1);
  // We need to set the file path as it defaults to the user module.
  $callbacks['user/%user_category/edit/report_settings']['file path'] = drupal_get_path('module', 'my_module');
  $callbacks['user/%user_category/edit/report_settings']['file'] = 'my_module.user.inc';
}
```

#Gotchas
* You will want to be clearing your menu cache a lot while getting this working. Every edit will require a `drush cc menu`.
* Ensure you have set the `file path` in the hook_menu_alter() if you have your have your page callback or form function for drupal_get_form() in a separate file.

#Comments
If you've found that this post has been helpful ping me in the comments, on twitter ([@Unifex]) or on [D.o] at [Gold].

[D.o]:http://drupal.org
[Gold]:http://drupal.org/u/Gold
[@unifex]:http://twitter.com/unifex
[hook_user_categories()]:https://api.drupal.org/api/drupal/modules%21user%21user.api.php/function/hook_user_categories/7
[hook_menu_alter()]:https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_menu_alter/7
[hook_menu()]:https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_menu/7
[Form API]:https://api.drupal.org/api/drupal/includes%21form.inc/group/form_api/7
