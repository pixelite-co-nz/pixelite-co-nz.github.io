---
layout: post
title: "Estimating Drupal projects"
subtitle: "A collection of resources from Drupal development shops"
excerpt: "Estimating Drupal projects can be tricky, and there are a number of tools and guides out there to help make your life easier in this topic."
header-img: "img/estimation/back.jpg"
permalink: /article/estimating-drupal-projects/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- projectmanangement
---

## Background

Estimating Drupal projects can be tricky, and there are a number of tools and guides out there to help make your life easier in this topic. I thought it would be a great idea to aggregate this data, and present some of the best information out there. It is up to you to choose the best match for your team.

## Resources

### palantir.net

<img src="{{ site.url }}/img/estimation/palantir.jpg" alt="" class="img-responsive img-thumbnail" />

[Developing Drupal sites: Plan or Perish](https://www.palantir.net/blog/developing-drupal-sites-plan-or-perish) - by Larry Garfield (2013)

Even though this article is nearly 3 years old, it still is completely valid for Drupal. There is an [included spreadsheet](https://docs.google.com/spreadsheets/d/15htLLWLguhwiuTLg_nndQNpgWVdUMy6UaR_d1q-v6iw/edit#gid=0) that you get the tech lead, product owner and another engineer to collaborate on prior to building.

What I like about this:

* Emphasis on involving tech leads early to perform scoping and breaking up functionality into tangible Drupal elements. This allows you to have less experienced developers do the actual build, as largely everything has been speced out.
* View modes are used extensively which is a great for re-usability of content and maintaining flexibility
* Questions, or opportunities for simplification can come up *before* anything has been built


### lullabot.com

<img src="{{ site.url }}/img/estimation/lullabot.jpg" alt="" class="img-responsive img-thumbnail" />

There are 3 articles on lullabot.com that are worth reading, they all follow on from one another, so it would pay to start at the beginning and work your way to the end.

* [The Art of Estimation](https://www.lullabot.com/articles/the-art-of-estimation ) by Seth Brown (2011)
* [An Update on the Art of Estimation](https://www.lullabot.com/articles/an-update-on-the-art-of-estimation) by Jerad Bitner (2012)
* [Handling Uncertainty When Estimating Software Projects](https://www.lullabot.com/articles/handling-uncertainty-when-estimating-software-projects) by Darren Petersen (2015)

In here they introduce a [spreadsheet](https://docs.google.com/spreadsheets/d/1y-3AliSRiHxnAkNhHa9JvQjX3EHpkiulxjlec4B7isA) that attempts to combine 2 developers estimates into a single number with variance.

What I like about this:

* It exposes the fact that all website builds have range to which it can be completed in
* It helps to explain the 'Wideband Delphi' method of estimation
* Excellent explanation on how to use the spreadsheet is provided


### wunderkraut.com

<img src="{{ site.url }}/img/estimation/wunderkraut.jpg" alt="" class="img-responsive img-thumbnail" />

[Resources for my session on early estimating](http://www.wunderkraut.com/blog/resources-for-my-session-on-early-estimating/2010-08-24) by Jakob Persson (2010)

Included in the article here is the [Drupal early estimation sheet v3](https://docs.google.com/spreadsheets/d/13MGHIxFOtbJ2Qxygc_GxKzxqghLiK1-7YgNiq95ypWE/edit?hl=en#gid=0).

What I like about this:

* Walks you through an actual example on how an email was turned into a concrete estimate, and how that was analysed
* Introduces often overlooked things such as:
  * migration of data
  * producing help or documentation
  * deployments
  * third party system integration
  * working with a third party (e.g. external design vendor)


### drupalize.me

<img src="{{ site.url }}/img/estimation/drupalize.png" alt="" class="img-responsive img-thumbnail" />

There are several training videos on drupalize.me that would be worth checking out if you have some time:

* [Introduction to Project Management](https://drupalize.me/videos/introduction-project-management?p=2203)
* [Estimation in Drupal Projects](https://drupalize.me/videos/estimation-drupal-projects?p=2203)

If you have an existing Acquia subscription you might already have access to Drupalize.me, so this might be worth looking into.


## Personal thoughts

Having been involved in doing a lot of this in my previous role, and one additional point I would like to make is to never start from a fresh Drupal install, it often makes sense to standardise on a Drupal technology suite, and installation profiles make this easy.

For instance, Acquia typically use an installation profile called [lightning](https://www.drupal.org/project/lightning) which provides built in ways to do lots of common tasks, e.g. layout, workflow, media management. This saves you having to re-invent the wheel on every project, and should help you provide more solid estimates when it comes to the base features of the site.

Another common theme across the different methods is to involve 1 or 2 tech leads early on to help break the requirements down into Drupal functionality. Having these early conversations with the product owner early on can often lead to a better solution not only in time to build, but feature set too.

Also remember, the above articles and spreadsheets may not work perfectly for you and your organsiation, so feel free to adapt them to suit your needs.

## Comments

If you know of some other method to help here, please let me know in the comments. Especially keen to know of any other training content or spreadsheets which other companies use to help estimate Drupal projects.
