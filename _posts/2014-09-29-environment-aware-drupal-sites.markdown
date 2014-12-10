---
layout: post
title: "Environment aware Drupal sites"
header-img: "img/post-bg-01.jpg"
permalink: /article/environment-aware-drupal-sites
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- environment
- hosting
---

As a course of developing for larger Drupal sites, you typically find yourself having multiple environments, one for development, one or more for staging or user acceptance testing, and another for production (and perhaps disaster recovery).

One thing that always comes up is making Drupal "environment" aware, so it knows how it should behave, what modules should be turned on (or off) and what servers it should be talking to for instance.

## Environment module ##

The [environment module](https://www.drupal.org/project/environment) allows you to define arbitrary environments (it also comes with some out of the box) in code. Example hook

{% highlight php linenos %}
<?php
/**
 * Implements hook_environment().
 */
function HOOK_config_environment() {
  return array(
    'prod' => array(
      'label' => t('Production'),
      'description' => t('Live sites are in full production and browsable on the web.'),
      'allowed' => array(
        'default' => TRUE,
      ),
    ),
    'dev' => array(
      'label' => t('Development'),
      'description' => t('Developer machines.'),
      'allowed' => array(
        'default' => FALSE,
      ),
    ),
    'staging' => array(
      'label' => t('Staging'),
      'description' => t('Bug fixes and testing are done here.'),
      'allowed' => array(
        'default' => FALSE,
      ),
    ),
  );
}
?>
{% endhighlight %}

You also may want to remove the default environments that come with the environment module

{% highlight php linenos %}
<?php
/**
 * Implements hook_environment_alter().
 */
function HOOK_config_environment_alter(&$environments) {
  // Remove default environments.
  unset($environments['production']);
  unset($environments['development']);
}
?>
{% endhighlight %}

Using this code, and some magic in settings.php, you can effectively tell Drupal which environment it is by switching on the HTTP_HOST. A stripped back example is:

{% highlight php linenos %}
<?php
// Include environment-specific config by parsing the URL.
// To override this, set $environment in settings.php
// BEFORE including this file.
if (!isset($environment)) {
  if (strpos($_SERVER['SERVER_NAME'], '.demo.net.nz') !== FALSE) {
    $environment = 'staging';
  }
  elseif (strpos($_SERVER['SERVER_NAME'], 'local') !== FALSE) {
    $environment = 'dev';
  }
  else {
    // Default to production.
    $environment = 'prod';
  }
}
// The environment module uses a lowercase variable.
$conf['environment']['default'] = $environment;
define('ENVIRONMENT', $environment);

// Load the environment config file, followed by host-specific
// over-rides (if any) in non-production environments.
$conf_path = DRUPAL_ROOT . "/sites/default/";
require $conf_path . "settings.$environment.php";
?>
{% endhighlight %}

Note this also lets you include a separate PHP file called "settings.dev.php" for development, where variable overrides (using global $conf) can be done on a per-environment basis.

### Environment switching ###

A natural extension of the environment module is to allow pulling a production database back to development, and then "switching" it into a development state. This switching is already a hook you can implement, allowing you to react on both the current and target environments.

An example of this is from the module's homepage:

{% highlight php linenos %}
<?php
/**
 * Implementation of hook_environment_switch().
 */
function HOOK_environment_switch($target_env, $current_env) {
  // Declare each optional development-related module
  $devel_modules = array(
    'context_ui',
    'devel',
    'devel_generate',
    'devel_node_access',
    'update',
    'views_ui',
  );
  switch ($target_env) {
    case 'production':
      module_disable($devel_modules);
      drupal_set_message('Disabled development modules');
      return;
    case 'development':
      module_enable($devel_modules);
      drupal_set_message('Enabled development modules');
      return;
  }
}
?>
{% endhighlight %}

Other common things we do in our environment switch to development include:

**Removing JS and CSS aggregation**

{% highlight php linenos %}
<?php
variable_set('preprocess_css', 0);
variable_set('preprocess_js', 0);
drupal_set_message(t('Removed aggregation from CSS and JS.'));
?>
{% endhighlight %}

**Changing the Apache Solr environment to point at localhost**

{% highlight php linenos %}
<?php
if (module_exists('apachesolr')) {
  $solr_env = array(
    'url' => 'http://127.0.0.1:8983/solr/dev',
    'make_default' => TRUE,
    'name' => 'DEV',
    'env_id' => 'solr',
    'service_class' => '',
    'conf' => array(
      'apachesolr_read_only' => '0',
    ),
  );
  apachesolr_environment_save($solr_env);
  drupal_set_message(t('Set solr environment to @name at @url', array(
    '@name' => $solr_env['name'],
    '@url' => $solr_env['url'],
  )));
}
?>
{% endhighlight %}

**Preventing API writes to production systems**

{% highlight php linenos %}
<?php
variable_set('brightcove_api_write_enabled', 0);
drupal_set_message(t('Stopped the Brightcove write API sync.'));
?>
{% endhighlight %}

**Granting helpful debugging permissions to certain roles**

{% highlight php linenos %}
<?php
if (module_exists('devel')) {
  $dev_perms = array(
    'access devel information',
    'switch users',
  );
  user_role_grant_permissions(DRUPAL_ANONYMOUS_RID, $dev_perms);
  user_role_grant_permissions(DRUPAL_AUTHENTICATED_RID, $dev_perms);
}
?>
{% endhighlight %}

The list goes on here.

## Environment indicator module ##

Now that Drupal is environment aware, it is really helpful if Drupal can inform the user what environment they are currently looking at. Out of the box the environment module has no UI, so enter the module [environment indicator](https://www.drupal.org/project/environment_indicator) to come save the day.

The new 7.x-2.x branch of environment indicator contains a lot of improvements over the 7.x-1.x branch, one of which is the integration with the core toolbar and shortcut modules.

To illustrate this, here is a screenshot of our toolbar in development (some links were stripped)

<a href="{{ site.url }}/img/toolbar.png" >
<img src="{{ site.url }}/img/toolbar.png" alt="Environment indicator and the toolbar module working together" class="img-responsive" />
</a>

The module also alters the favicon to include a tiny letter and coloured background to match the colour you chose

<img src="{{ site.url }}/img/toolbar-icon.png" width="181" height="38" alt="Environment indicator and the favicon working together"  />

This way you will never again forget which environment you are using, as the colours will be right there at the top of every page.

## Comments ##

I am keen to hear how other people solve the issue of environment aware Drupal applications, and how this is communicated to the end users of the application. What other modules are out there? What experiences have you had?
