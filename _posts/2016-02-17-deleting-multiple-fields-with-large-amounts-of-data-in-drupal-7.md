---
layout: post
title: "Deleting multiple fields with large amounts of data in Drupal 7"
subtitle: "Sometimes truncation is best"
excerpt: "I recently was tasked with cleaning up a legacy Drupal 7 database to which had accumulated a lot of data in fields."
header-img: "img/plymouth.jpg"
permalink: /article/deleting-multiple-fields-with-large-amounts-of-data-in-drupal-7/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- updatehook
- database
---

## Background

I was recently tasked with cleaning up a legacy Drupal 7 database to which had accumulated a lot of data in several fields. The fields were no longer used, and the data could be deleted. The data however totalled more than *30 GB* with those 7 fields, and this presented a few challenges.

## Existing solutions that did not quite cut it

I search around the internet to see the best way to delete fields in Drupal 7 using an update hook. I came across this [stack overflow post](http://drupal.stackexchange.com/questions/46085/how-to-programmatically-remove-a-field-from-a-node) to which advised using something like:

{% highlight php %}
<?php
function EXAMPLE_update_7001() {
  field_delete_field('field_name');
  field_purge_batch(1);
}
?>
{% endhighlight %}

The main issue with the above code is that it only marks the data for deletion, and then slowly removes it on cron. This could take  weeks to fully remove the data. It was not an ideal solution in our case.

## Solution

If you want to expatiate the process of removing data from fields, and also the fields themselves, we found the code below would remove the 30 GB of data, remove the tables, update the content types, all in one nice update hook. It does rely on having removed the fields from your features, so that are the respective content type can be reverted successfully.

{% highlight php %}
<?php
function EXAMPLE_update_7001() {
  $fields_to_delete = array(
    'field_example_a',
    'field_example_b',
    'field_example_c',
    'field_example_d',
    'field_example_e',
    'field_example_f',
    'field_example_g',
    );
  foreach ($fields_to_delete as $field) {
    db_truncate('field_data_' . $field)->execute();
    db_truncate('field_revision_' . $field)->execute();
    field_delete_field($field);
    watchdog('EXAMPLE', 'Deleted the field @field from all content types.', array('@field' => $field));
  }

  /**
   * The fields aren't really deleted until the purge function runs, ordinarily
   * during cron. Count the number of fields we need to purge, and add five in
   * case a few other miscellaneous fields are in there somehow.
   */
  field_purge_batch(count($fields_to_delete) + 5);

  // Revert features to update the content type in Drupal to drop the field.
  features_revert(array('EXAMPLE' => array('field')));
}
{% endhighlight %}

## Conclusions

A couple of lessons can be learnt here

* Truncations, even on large data sets, are extremely quick, and awesome. The above update hook takes less than 1 minute to run end to end.
* If you are going to programmatically update nodes with a high degree of frequency, consider [disabling revisions](https://www.drupal.org/project/field_sql_norevisions) on those content types. Your database thanks you in advance.

## Comments

If you have had to delete fields in update hooks in Drupal, let me know if you used another method and how that went for you.
