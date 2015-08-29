---
layout: post
title: "Starter regression test suite powered by CasperJS"
subtitle: "Kick start your automated testing"
excerpt: "CasperJS is very useful for automating what is normally done by real people"
header-img: "img/casperjs.jpg"
permalink: /article/starter-regression-test-suite-powered-by-casperjs/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- casperjs
- testing
---

I have written about [CasperJS](/article/why-i-use-casperjs-regression-testing-web-applications) in the past, and find it very useful for automating what is normally done by real people. This frees up people to do other things, like making your website more awesome.

A common question I get asked is **how do I get started with CasperJS?** - this blog post hopes to help everyone get over that initial hurdle, and start writing tests in less than 15 minutes.

## Starter framework

So I decided to write a generic framework for websites (CMS agnostic), that anyone can fork and make their own. The code is hosted at [https://github.com/seanhamlin/education-smoke-test](https://github.com/seanhamlin/education-smoke-test).

## Features

Current feature set includes:

* **Environment aware** testing, you can easily switch between your test and production site (this is easily extended as well)
* **Logs to XML** (junit compatible) so you can use this with Jenkins for instance
* **Cache busting** query parameter to all page requests, to ensure you bypass your reverse proxy (Akamai, Varnish etc)
* Optional **debug flag** for more look into CasperJS's internals
* **jQuery 2.1.4** for simple remote DOM testing - if you can write jQuery to return a boolean, string or integer you can write a CasperJS test for it
* **Ignores Google Analytics**, so CasperJS does not show up in your statistics (can be extended for other analytics providers as well)
* **Takes a screenshot on fail** so you can better debug the fail
* **Fails on JavaScript errors** in the remote DOM
* Abstracts common page tests into <code>globalPageTests()</code>, this enables easy recycling of common tests (e.g. header, footer, HTTP headers etc)
* **Tests are structured** in a folder, so new tests can be added simply (e.g. for other landing pages)

The github [README](https://github.com/seanhamlin/education-smoke-test/blob/master/README.md) goes into more detail on how to install and use the above features.

## See it in action

Here is the output from the test suite as it presently stands:

<img src="https://raw.githubusercontent.com/seanhamlin/education-smoke-test/master/images/example-run.png" alt="Output from the test suite showing green success passes" class="img-responsive img-thumbnail" />

## Comments

I am keen to see what other people think about this, and what other features/improvements I could add to it. Please leave my a comment down below, or send me a pull request on github.
