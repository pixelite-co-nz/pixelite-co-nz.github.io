---
layout: post
title: "Using Behat for Behavioral Driven Development (BDD) in Drupal"
subtitle: "How to get this done in Drupal"
excerpt: "BDD allows you to write human readable stories that describe the behavior of your website."
header-img: "img/plane.jpg"
permalink: /article/using-behat-for-behavioral-driven-development-bdd-in-drupal
author: "Sean Hamlin"
categories:
- tutorial
tags:
- bdd
- drupal
- testing
- behat
---

## What is BDD

<abbr title="Behavior Driven Development">BDD</abbr> allows you to write human readable stories that describe the behavior of your website. These stories are written from an end user's perspective, and can then be tested against your application to see if they pass or fail. This allow you to define functionality easily and up front, and often make sense in an agile environment, or where you are making constant changes to your application and you want some sort of re-assurance it is working as intended (i.e. regression tests).

## Behat and Gherkin 

Behat is a tool that make BDD possible. The language that behat stories are written in is called Gherkin. Gherkin is a line-oriented language that uses indentation to define structure. The start of each line is usually a special keyword, these all mean something in Gherkin.

<pre>
<strong>Feature:</strong> Some terse yet descriptive text of what is desired
  In order to realize a named business value
  As an explicit system actor
  I want to gain some beneficial outcome which furthers the goal

  <strong>Scenario:</strong> Some determinable business situation
    <strong>Given</strong> some precondition
      <strong>And</strong> some other precondition
     <strong>When</strong> some action by the actor
      <strong>And</strong> some other action
      <strong>And</strong> yet another action
     <strong>Then</strong> some testable outcome is achieved
      <strong>And</strong> something else we can check happens too

  <strong>Scenario:</strong> A different situation
  ...
</pre>

A more concrete example, is the UNIX ls command. A stakeholder may say to you:

<pre>
<strong>Feature:</strong> ls
  In order to see the directory structure
  As a UNIX user
  I need to be able to list the current directory's contents

  <strong>Scenario:</strong> List 2 files in a directory
    <strong>Given</strong> I am in a directory "test"
      <strong>And</strong> I have a file named "foo"
      <strong>And</strong> I have a file named "bar"
     <strong>When</strong> I run "ls"
     <strong>Then</strong> I should get:
       """
       bar
       foo
       """
</pre>

The [Gherkin documentation](http://behat.readthedocs.org/en/v2.5/guides/1.gherkin.html) can be found online.

### PHPUnit and behat

Because of their very different approaches to testing, PHPUnit and Behat actually complement each other very well. A growing number of enterprise-level PHP projects are using a combination of both to achieve the best-possible test coverage.

## Key things to keep in mind when writing tests

To help write good behat tests, here are some good guidelines to keep in mind.

### Focus on business value

When defining features (or stories) ensure that you are focusing on delivering an item of value. If you only have a few tests for your application, ensure the features that give the most business value are created first.
 
### Focus on the user

A critical component of Gherkin style dictates that you speak with language that the target user can reasonably be expected to understand. This user-centric focus means that everyone will be drawn back from their domains of expertise to think about what the target user of the feature needs. There’s a wide variety of users, too. Features intended for a site visitor may differ from those intended for site administrators, editors, or moderators. As the user varies, it's possible the language used in a scenario will vary as well.

## Integration with Drupal

So you have some BDD features written, and now you want to implement them. There is a Drupal module that will help with the creation of nodes, users, vocabularies and taxonomy terms.

There are 3 drivers available in the [drupal behat extension](https://www.drupal.org/project/drupalextension), all with different pros and cons:

<figure>
  <img src="{{ site.url }}/img/behat/api.png" alt="There are 3 different Drupal drivers within the drupalextension module" class="img-responsive img-thumbnail" />
  <figcaption><small>Table of driver comparisons taken from the <a href="https://behat-drupal-extension.readthedocs.org/en/3.0/drivers.html">documentation</a>.</small></figcaption>
</figure>

The most fully featured driver is the Drupal API driver, it has the limitation that it must be run on the same server that the website is run on.

## Continuous integration

So now you have your Behat tests set up and running on your development environment, the next step is to automate the Behat tests so that they execute automatically on a dedicated testing server after a new commit is pushed. There are a number of ways to do this:

* Github and TravisCI
* Jenkins and use git post-receive hooks (or [Acquia cloud hooks](https://github.com/acquia/cloud-hooks))

## Drupal 8 and behat

There is an issue open at the moment that aims to get Drupal 8 core tested with behat https://www.drupal.org/node/2232271 - this aims to introduce a new module called 'behat' and build in JavaScript automated testing for Drupal (at the moment this is all manual).

## Resources

There is a lot of information out in the Drupal community around Behat that I would encourage you to read and watch:

* Konstantin (from Inviqa) at [DrupalCon Amsterdam 2014](https://amsterdam2014.drupal.org/session/doing-behaviour-driven-development-behat)
* Drupal.org did a Drupal 6 to Drupal 7 upgrade, and for that they invested a lot of time into creating a [full test suite (called doobie)](https://www.drupal.org/project/doobie), and now the test suite is used to help spot regressions in the site
* Large Scale Drupal (LSD) created a [whitepaper on BDD with Behat and Drupal](http://drupalwatchdog.com/system/files/Behavior-Driven%20Development%20LSD%20Guide.pdf) which is well worth the read 
* [High Quality PHP by Benjamin Eberlei](https://www.acquia.com/blog/high-quality-php-benjamin-eberlei)
* [Drupalize me have a podcast on BDD and Drupal](https://www.lullabot.com/blog/podcasts/drupalizeme-podcast/21-bdd-behat-and-drupal)
* [Behat documentation](http://behat.readthedocs.org/en/v2.5/quick_intro.html)

## Comments

If you have any further information that can be added, feel free to let me know in the comments.
