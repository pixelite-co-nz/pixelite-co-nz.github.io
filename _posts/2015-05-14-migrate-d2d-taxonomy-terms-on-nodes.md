---
layout: post
title: "Drupal Migrate D2D :: Taxonomy terms on nodes"
subtitle: "A 'gotcha'"
excerpt: "Migrate D2D doesn't handle taxonomies on nodes out of the box."
header-img: "img/migrate-d2d/migrate-d2d-header.png"
permalink: /article/migrate-d2d-taxonomy-terms-on-nodes/
author: "Gold"
twitter: "@unifex"
categories:
- migration
tags:
- drupal
- drupalplanet
- migrate
- migrated2d
---
A migration project I am currently working on hit a small hurdle with taxonomy terms on a content type. This took too long to resolve. Hopefully posting this here will save others the time and hassle I went though.

## Migrate D2D
I am going to assume that if you are reading this you are already using the [migrate_d2d] module so I won't go into the big explanation about what it is, why you should use it and just how greatful we all should be to [Mike Ryan].

## Node migration and taxonomies
After following the docs I found that my taxonomy field was not being populated. A little digging led me to the conclusion that this was not something d2d handled out of the box and it was something I would have to deal with myself. There are a number of moving parts involved with this and due to all of these I can understand _why_ it is not something migrate d2d could do.

### public function prepare($entity, $row)
The magic happens here.  The ```prepare()``` function is the final thing to be called before the node object is saved. This is where we get to do any final tweaks or tidyups. You can find full detail on this in the [Commonly implemented Migration methods] page in the [Migrate handbook].

In the ```prepare()``` function the ```$entity``` is the new object that we are about to save and the ```$row``` is our source object. At this point the taxonomy has been added to the ```$row```.

Within the ```$row``` object the taxonomy has been added with its vid as the root level attribute. If you don't know to watch for that it can catch you. Added to that it is the vid of the destination vocabulary that is used which caught me off guard. The situation I had did not have me migrating the vobacularies, just the terms within them and the vid for the Categories vocab was not the same on my development environment as it was on my staging environment. This caught me out initially as I don't have direct access to the staging database to examine the content of tables.

<figure>
  <img src="{{ site.url }}/img/migrate-d2d/row_object_krumo.png" alt="Krumo output of $row." class="img-responsive img-thumbnail" />
  <figcaption><small>source $row->{destination vid} = array({source tid}, {source tid}, {source tid})</small></figcaption>
</figure>

Once it was realised that the vid was from the destination vocabulary things got easier.  This is how the code looked in the end for me;
{% highlight php %}
  public function prepare($node, $row) {
    // The node's terms are in an array under their destination vocab ID and
    // this is different from environment to environment. However, we've only
    // got one taxonomy...
    $keys = array_keys((array) $row);
    foreach ($keys as $key) {
      if (is_numeric($key)) {
        $cat_vid = $key;
        break;
      }
    }
    if (!empty($row->{$cat_vid})) {
      foreach ($row->{$cat_vid} as $tid) {
        // We want the tid of the term we have migrated. This lets us look it up
        // our migrate_map table.
        $new_tid = db_select('migrate_map_tncategoryterms', 'm')
          ->fields('m', array('destid1'))
          ->condition('sourceid1', $tid)
          ->execute()
          ->fetchField();
        $node->field_category[LANGUAGE_NONE][]['tid'] = $new_tid;
      }
    }
  }
{% endhighlight %}

### Caveats
This worked for me because I only had **one** taxonomy field to worry about. The moment you get more than one you will want to revisit the assignment of $new_tid to the appropriate field. This shouldn't be a problem to hand code and if you have migrated the vocabularies too you may be able to use the migrate_map table to make something more dynamic.


## Comments

If you have (or are currently) using migrate I would be interested to hear how you found it. Especially if you are migrating terms, but not the vocabulary.

[migrate_d2d]:https://www.drupal.org/project/migrate_d2d
[Mike Ryan]:https://www.drupal.org/u/mikeryan
[Commonly implemented Migration methods]:https://www.drupal.org/node/1132582
[Migrate handbook]:https://www.drupal.org/migrate
