---
layout: post
title: "Convert an existing textfield into a textarea in Drupal 7"
header-img: "img/post-bg-02.jpg"
subtitle: "SQL to the rescue"
permalink: /article/convert-existing-textfield-textarea-drupal-7
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- code
- updatehook
- database
---

For a recent project I was tasked with migrating the old Twitter 1.0 API widget to the new [Twitter embedded timeline](https://dev.twitter.com/docs/embedded-timelines) functionality.

The original field was a simple 255 character textfield:

<img src="/img/textarea/twitter_username.png" width="574" height="98" alt="Original textfield showing the single line field and it's original purpose" class="img-responsive img-thumbnail" />

This obviously would not hold the multi-line, roughly 500 character content of the new Twitter embedded timeline. So a change was required in order to extent the size of this field.

It is true, that you can simply delete the field, and then create a new one, with a new name. I chose instead to retain the existing field (and it's content), this way content authors would know what content used to be in the old textfield prior to conversion.

## Update hook to the rescue ##

Update hooks in Drupal can be used to perform one time database manipulations. This makes them ideal for this type of change.

Here is the entire update hook that was written (the field name was `field_twitter_search`):

{% highlight php %}
<?php
/**
 * Change Twitter into a textarea using fun SQL.
 */
function mts_show_update_7001() {
  // Manual database changes.
  db_query("UPDATE {field_config} SET type = 'text_long' WHERE field_name = 'field_twitter_search'");
  db_change_field('field_data_field_twitter_search', 'field_twitter_search_value', 'field_twitter_search_value', array(
    'type' => 'varchar',
    // PostgreSQL allows up to 10,000,000 (1 GB), MySQL allows up to 21844.
    'length' => '20000',
  ));
  db_change_field('field_revision_field_twitter_search', 'field_twitter_search_value', 'field_twitter_search_value', array(
    'type' => 'varchar',
    // PostgreSQL allows up to 10,000,000 (1 GB), MySQL allows up to 21844.
    'length' => '20000',
  ));

  // Clear caches.
  field_cache_clear(TRUE);

  // Apply the new field instance configuration.
  features_revert(array(
    'mts_show' => array('field'),
  ));
}
?>
{% endhighlight %}

To walk through this update hook, one step at a time:

{% highlight php %}
<?php
db_query("UPDATE {field_config} SET type = 'text_long' WHERE field_name = 'field_twitter_search'");
?>
{% endhighlight %}

This alters the field configuration and changes the type to be a textarea (changed from a textfield).

{% highlight php %}
<?php
db_change_field('field_data_field_twitter_search', 'field_twitter_search_value', 'field_twitter_search_value', array(
  'type' => 'varchar',
  // PostgreSQL allows up to 10,000,000 (1 GB), MySQL allows up to 21844.
  'length' => '20000',
));
?>
{% endhighlight %}

This (along with the next SQL query) alters the size of the data storage column in both the field data and field revision tables. Be careful to choose a size that is allowed by your database.

{% highlight php %}
<?php
field_cache_clear(TRUE);
?>
{% endhighlight %}

This clears Drupal's internal cache for the fields

{% highlight php %}
<?php
features_revert(array(
  'mts_show' => array('field'),
));
?>
{% endhighlight %}

Finally, you can revert your feature on top. This requires you to have exported the content type (and it's fields) with features. This allows you to for instance change the title and description of the field.

Here is a screenshot that shows the newly converted textarea, including new title and description

<img src="/img/textarea/twitter_embed_code.png" width="1066" height="152" alt="The new textarea field showing a multi-line field with room for more content" class="img-responsive img-thumbnail" />

## Conclusion ##

Drupal certainly does you no favours when it comes to field conversion with existing content already in those fields, luckily there still exist ways to get this done, in a cross database fashion.

Let me know if you have done similar conversions (rather than replacements), and how you went about that.
