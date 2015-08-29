---
layout: post
title: Why I use CasperJS for regression testing web applications
header-img: "img/casperjs.jpg"
permalink: /article/why-i-use-casperjs-regression-testing-web-applications
author: "Sean Hamlin"
categories:
- tutorial
tags:
- casperjs
- testing
---


Everyone has their own continuous integration product of choice, some opt for <a href="http://docs.seleniumhq.org/">Selenium</a>, <a href="http://www.getwindmill.com/">Windmill</a>&nbsp;or <a href="http://watir.com/">many</a> <a href="https://code.google.com/p/selenium/?redir=1">others</a>.


I will attempt to cover the main reasons why I have chosen to adopt this as my regression suite of choice at a high level here, and then in future blog posts cover the more extensive subjects in more detail. For now this is a 40 foot view of why I use <a href="http://casperjs.org/index.html">CasperJS</a> for automated regression testing.

## Built on top of Webkit
Well to be correct, it is built on top of <a href="https://github.com/ariya/phantomjs">PhantomJS</a>, which in turn is a headless webkit evironment. What this means is you have a real web browser executing and rendering web pages. This affords other opportunities such as

 * Taking screenshots of the whole page, or part of the page
 * Clicking on buttons that execute AJAX
 * Checking low level HTTP responses such as headers

CasperJS also helps to hide some of the deficiencies of using straight PhantomJS, for example creating a simple navigation series of steps from one page to another page four clicks away is simple and easy to read in CasperJS.

## JavaScript all the things
CasperJS is written in JavaScript, and this cannot be underestimated, almost all web developers know at least basic JavaScript, so there is no new language to learn here. Your team can be productive from day 1.

## Extensiblity
CasperJS comes with a default regression suite runner script called <a href="https://github.com/n1k0/casperjs/blob/master/tests/run.js">run.js</a>. This script can easily be cloned to add new functionality into your own regression suites. For example we have added:

 * The ability to specify the required environment to execute the test suite against, e.g. development, staging or production
 * Pass in additional (optional) parameters such as admin password


## Abstraction
Any common functions that can be abstracted from your individual unit tests can be placed into a common include. This enables you to greatly accelerate the creation of regression tests, whilst at the same time maintaining agility to change global tests quickly and easily.


For example you may have a common function called '<code>globalPageTests()</code>', which could check for:

 * An HTTP 200 is returned
 * There are no errors on the page
 * There are no warnings on the page
 * The page is served from cache
 * Global elements like header and footer are all intact


## Developers can (and want to) write real world unit tests
Regression tests are one of those things that when you are trying to deliver a project on time and on budget can be cut. But if your developers whilst coding a particular feature or page, can write a quick 15 minute regression test, this will save you many times over by the time the project is launched and you have performed dozens of releases to staging and production.


This will also mean that your QA team can spend less time performing boring regression testing, and more time doing the exciting parts.

## Integration with other products
We have also managed to integrate CasperJS deeply into the content management system that we use (Drupal), and now before the regression suite runs, CasperJS:

 * Logs into Drupal as admin,
 * Requests a JSON file that contains dynamic unit test data
 * Logs out

This means, you can run arbitrary regression tests, based on the code and database in the environment you are currently testing against. For instance, you may wish to test that the 'breaking news' functionality is working on your site, but this block only displays if there is a breaking news item of content published. By creating a dynamic regression test, we know what the outcome should be before the test is run.


Of course you can also integrate CasperJS into normal continuous integration suites such as Jenkins (Hudson).


Stay tuned for the next blog post, that will cover the installation of CasperJS


If you have any questions, let me know below.

