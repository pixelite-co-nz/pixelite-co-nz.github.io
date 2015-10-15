---
layout: post
title: "Integrating multisite Drupal with Apache Solr"
subtitle: "Your options, the pros and the cons"
excerpt: "There are a number of ways to do this, this post will help explain the pros and cons of each approach."
header-img: "img/swing.jpg"
permalink: /article/integrating-multisite-drupal-with-apache-solr/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- solr
- multisite
---

There are a number of ways this can be solved with Drupal 7:

## 1. Use a search core per site

Using this approach, you create an unique Solr core (N.B. a single Solr application can contain 0 or more cores) per site and either:

* [Acquia Search Multiple Indexes](https://www.drupal.org/project/acquia_search_multi_subs) module (if using [Acquia Cloud](https://www.acquia.com/free))
* settings.php switch statements to switch on domain

to connect the appropriate search cores to the appropriate Drupal environments. Then you can enable (but not no need to configure) the [apachesolr_multisitesearch](https://www.drupal.org/project/apachesolr_multisitesearch) module. 

### Pros

* Each site’s index is isolate from each other, so there is no interfering with other indexes, and no ability to drop other indexes
* You can customise the Solr config per core

### Cons

* Need to provision a new Solr core every time you add a new site
* Need to change settings.php every time you add a new site

## 2. Use a single shared core, and apachesolr_multisitesearch

In this option you utilise a single shared Solr core, and send the documents from all sites into it. Using special attributes on the documents, you are able to query and get only the results you desire back out again.

The module you need to enable is [apachesolr_multisitesearch](https://www.drupal.org/project/apachesolr_multisitesearch). Just enabling the module makes your standard search pages return results only for your site. This is accomplished internally by adding a filtering query to each Solr query using [hook_apachesolr_query_alter()](http://cgit.drupalcode.org/apachesolr_multisitesearch/tree/apachesolr_multisitesearch.module#n243).

You can see the site hashes are different based on the [base_url](http://cgit.drupalcode.org/apachesolr/tree/apachesolr.module#n577) in Drupal already.

### Example of this working
 
Note the site hashes are different:

{% highlight bash %}
$ drush --uri=www.example1.com vget apachesolr_site_hash
apachesolr_site_hash: 'lm0ujj'

$ drush --uri=www.example2.com.au vget apachesolr_site_hash
apachesolr_site_hash: '9qt6o6'
{% endhighlight %}

### Example of this not working

Note the site hashes are the same, thus the search results will be blended:

{% highlight bash %}
$ drush --uri=www.example1.com vget apachesolr_site_hash
apachesolr_site_hash: '92ub55'

$ drush --uri=www.example2.com vget apachesolr_site_hash
apachesolr_site_hash: '92ub55'
{% endhighlight %}

You will find yourself in this predicament if you clone new sites from old sites (thus the database variable persists).

### In order to fix blended site hashes

1. drop the current index (both sites)
1. delete the variable 'apachesolr_site_hash' (both sites)
1. visit the admin page solr page (both sites) - this will regenerate the site hash
1. verify the site hash is now different (both sites)
1. reindex (both sites)

### Pros

* No need to provision a new Solr core every time you add a new site
* No need to change settings.php every time you add a new site
* Hooks into the delete query to prevent dropping the entire index

### Cons

* You need to ensure the site hash is different for each site, so if you clone one, you will need to delete the variable `apachesolr_site_hash` straight away
* If you ever drop Solr’s index, this will drop all documents across all sites. This should be hard to do (you will need to disable the apachesolr_multisitesearch module)
* You must share Solr config (e.g. the [schema XML](https://wiki.apache.org/solr/SchemaXml)), so you cannot change this per site

## Comments

If you run a multisite setup, and make use of Apache Solr, I am keen to hear how you integrated it, and if you have any tips or tricks to share.
