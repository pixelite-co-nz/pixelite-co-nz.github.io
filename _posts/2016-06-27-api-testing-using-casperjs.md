---
layout: post
title: "API testing using CasperJS"
subtitle: "Having tests across your API endpoints is essential in order to avoid regression issues down the track"
excerpt: "Having tests across your API endpoints is essential in order to avoid regression issues down the track"
header-img: "img/casperjs.jpg"
permalink: /article/api-testing-using-casperjs/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- casperjs
- testing
- api
---

## Introduction

When it comes to de-coupled applications, or applications with third party integration (e.g. a mobile app), having tests across these API endpoints is essential in order to avoid regression issues down the track.

## Why CasperJS

[CasperJS](http://casperjs.org/) is a testing framework written around [PhantomJS](http://phantomjs.org/), I have written about this [much](http://www.pixelite.co.nz/article/starter-regression-test-suite-powered-by-casperjs/) in [the](http://www.pixelite.co.nz/article/how-exclude-casperjs-your-google-analytics-statistics/) [past](http://www.pixelite.co.nz/article/why-i-use-casperjs-regression-testing-web-applications/).

Benefits of using CasperJS for these types of tests:

* tests are written in JavaScript, this means parsing JSON etc is simple
* helpful testing methods to verify API responses contain the correct information
* each API endpoint's tests can be captured in a folder or a file to keep the test files small and easy to find
* entire web pages can rendered making regression tests possible


## 1) Testing JSON responses (unit testing)

This is a very low level test, as basically you are verifying that given the API a certain URL and parameters, you can expect certain responses. In essence this is unit testing for APIs.

**Pros**

* provides acceptance tests for all API endpoints
* can validate the JSON is well formed, and certain expected attributes are there
* can verify types in the API response (e.g. array, object)
* can test for known errors (e.g. validation errors with incorrect parameters)
* can test caching headers are correct
* able to use all HTTP methods (e.g. GET and POST) to verify endpoints are working as expected
* authenticated APIs can be tested if you simulate logging in first

### Example CasperJS code

{% highlight js %}
/**
 * First XKCD comic JSON test.
 *
 * @see http://casperjs.readthedocs.org/en/latest/modules/tester.html
 */
casper.test.begin('First comic', 7, function suite(test) {

  casper.start(site + '/1/info.0.json?' + timestamp, function() {
    this.test.assertHttpStatus(200);
    this.test.assertEquals(casp.currentResponse.headers.get('Content-Type'), 'application/json; charset=utf-8');

    // Ensure the JSON is valid.
    $json = JSON.parse(this.getPageContent());
    this.test.pass('JSON is valid');

    // Ensure the JSON contains the right attributes.
    this.test.assertEquals($json.num, 1, 'ID is correct');
    this.test.assertEquals($json.safe_title, "Barrel - Part 1", 'Title is correct');
    img = $json.img;

    // Verify the image asset is valid.
    casper.thenOpen(img + '?' + timestamp, function() {
      this.test.assertHttpStatus(200);
      this.test.assertMatch(casp.currentResponse.headers.get('Content-Type'), /image\/.+/);
    });
  });

  casper.run(function() {
    test.done();
  });

});
{% endhighlight %}

Lets step through this one bit at a time

{% highlight js %}
this.test.assertHttpStatus(200);
this.test.assertEquals(casp.currentResponse.headers.get('Content-Type'), 'application/json; charset=utf-8');
{% endhighlight %}

This ensures the reponse is a known good response, if you were looking to test a known invalid set of parameters, then you could expect a 400 (bad request) or 403 (access denied).

{% highlight js %}
$json = JSON.parse(this.getPageContent());
this.test.pass('JSON is valid');
{% endhighlight %}

This is where we parse the JSON from the API response. If the parsing fails (e.g. invalid syntax) then an exception is thrown.

{% highlight js %}
// Ensure the JSON contains the right attributes.
this.test.assertEquals($json.num, 1, 'ID is correct');
this.test.assertEquals($json.safe_title, "Barrel - Part 1", 'Title is correct');
{% endhighlight %}

Here you see some basic tests to verify the JSON content contains the required information.

{% highlight js %}
// Verify the image asset is valid.
casper.thenOpen(img + '?' + timestamp, function() {
  this.test.assertHttpStatus(200);
  this.test.assertMatch(casp.currentResponse.headers.get('Content-Type'), /image\/.+/);
});
{% endhighlight %}

You can even add additional steps to check additional resources linked from within the JSON. In this case we are validating that the image in the JSON is a valid image.

**Example output from the above**

<img src="/img/casperjs/unit.png" alt="Example output of CasperJS when unit testing an API" class="img-responsive img-thumbnail" />


## 2) Testing the de-coupled page

If you have a partially or fully de-coupled web page (that uses your API), you can get CasperJS to render this completely. This will obviously be a more complete test for the application, rather than just testing a single API response alone (a single HTML page might be comprised of many API requests). In essence this is your regression testing for the APIs.

**Pros**

* able to test the interaction with all the API requests on the page
* will tell you if there is a JavaScript error anywhere on the page (e.g. in client side JavaScript code, potentially unrelated to your APIs)
* able to capture a screenshot of the page if a test fails
* rendering the page (all CSS and images) lends itself to a complete regression test and more closely follows what a user will see and do
* eliminates (or greatly reduces) any manual regression testing

### Example CasperJS code

Example code can be grabbed from my [other example CasperJS test suite](http://www.pixelite.co.nz/article/starter-regression-test-suite-powered-by-casperjs/). This test code can be merged with the unit test code to create a single test codebase.

## Why test both (unit and regression)

In my opinion it is important to have tests for both the API responses, and how these are used in the resulting application. Potentially this does mean that a single error in an API response will cause more than one error in your tests, however this can be a good thing, as the unit tests will point out the broken endpoint, and the regression tests will tell you the impact on the site from this breakage.


## Example repository to get you started

I have made public an [example git repo showing a simple framework to get you started with API unit and regression testing](https://github.com/seanhamlin/xkcd-api-test) using CasperJS, please feel free to clone and make it your own. Pull requests welcome if you can make this starter framework better.

## Comments

Let me know if you have used API testing in your application, and what tools you used to accomplish this. Especially keen to know if you have used CasperJS and your tests are more complete than mine.
