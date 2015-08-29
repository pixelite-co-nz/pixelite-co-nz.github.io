---
layout: post
title: "Site preview - the holy grail of Drupal"
subtitle: "Also introducing a new module preview sync"
excerpt: "So recently I did a talk at DrupalSouth Melbourne on site preview solutions that exist within Drupal at present. I noticed that no one had managed to do a comparison between them as they stand at the moment, so I aimed to help out there."
header-img: "img/post-bg-01.jpg"
permalink: /article/site-preview-the-holy-grail-of-drupal
author: "Sean Hamlin"
twitter: "@wiifm"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- preview
- content-staging
---

## What is site preview

> The ability to see (and have selected others see) changes to content and layout that is not yet visible to the general public

So recently I did a talk at [DrupalSouth Melbourne](https://melbourne2015.drupal.org.au/session/site-preview-holy-grail-drupal) on site preview solutions that exist within Drupal at present. I noticed that no one had managed to do a comparison between them as they stand at the moment, so I aimed to help out there.

Solutions compared in the talk:

* Drupal 7 (stock)
* SPS
* CPS
* Zariz
* Live preview
* What is coming in Drupal 8

I also wanted to introduce the new solution that was developed for the Ministry of Health New Zealand, that aimed to solve site preview in an entirely different manner.

## Slides

Here are my [full slides](http://bit.ly/drupalsouthsitepreview) from the talk if you want to read about the above options in more detail.

## How preview sync is different

Instead of try to take over your production site, and pollute it with complex revisioning and access control, and altering your EFQ and views using magic, it instead works with your existing workflow (workbench_moderation integration is <abbr title="out of the box">OOTB</abbr>), and aims to be a lightweight solution.

<img src="{{ site.url }}/img/site-preview/diagram.png" alt="Preview sync syndicates your production database to a separate preview environment" class="img-responsive img-thumbnail" />

Preview sync, takes a live snapshot (optimised) of your production database, and imports this to a separate dedicated preview environment. Then a number of actions take place, all of which are entirely alterable, so you can add your own tasks in, and remove tasks you don't need.

Example tasks in preview sync:

* environment switch to preview, this allows you to enable and disable modules, perform actions (e.g. redirecting email to a log). This is a powerful hook.
* publish the content currently in 'Needs Review', this allows your content approvers to see the content, including all surrounding content as if it was published on production, but in a safe and controlled environment
* re-index solr, if your site is largely driven by Apache Solr (which is not uncommon), this will allow the newly published content above to be inserted into the preview Solr index. This is a unique feature
* your task here, seriously, the task list is completely alterable, and any drush command can be remotely executed on the preview environment. Custom drush commands can be added. An example of which is the bundled workbench-moderation-publish drush command.

### Security

As all the complex access control is not needed on production (e.g. you are never sending un-published content to Solr), there is a huge security benefit to using preview sync. Access control to nodes is kept simple on production.

Also, as the preview environment is dedicated, you can lock down access, e.g. only allow access to your preview site from certain IPs. This way, your internal content approvers can still see the content, and no one else.

## Comments

If preview sync sounds like it could be useful to you, I am keen to know - please leave a comment below. I am also keen to hear if

* there is a missing feature that is needed for you to adopt preview sync
* key integrations with other contributed modules are missing
