---
layout: post
title: "Writing PHPunit tests for your custom modules in Drupal 8"
subtitle: "Integrating PHPunit into your custom modules is now even easier."
excerpt: "I have been doing a bit of Drupal 8 development as of recent, and am loving the new changes, and entities everywhere. I am passionate about automated testing, and when I saw that integrating PHPunit into your custom modules is now even easier, I set out to get this integrated."
header-img: "img/phpunit/back.jpg"
permalink: /article/writing-phpunit-tests-for-your-custom-modules-in-drupal-8/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- phpunit
- testing
---

## Background

I have been doing a bit of Drupal 8 development as of recent, and am loving the new changes, and entities everywhere. I am passionate about automated testing, and when I saw that integrating PHPunit into your custom modules is now even easier, I set out to see how this all worked.

## Why is PHPunit important

There are are number of reasons why PHPunit is a great idea

* it forces you to write testable code in the first place, this means small classes, with methods that do a single thing
* it runs in only a few seconds, there is also no need to have a working Drupal install
* integrates with PHPStorm, allowing you run your tests from within the IDE

## Step 1, set up your phpunit.xml.dist file

There is a file that comes included with Drupal 8 core, but by default it will not scan any sub-directories under <code>/modules</code> (e.g. like the very common <code>/modules/custom</code>). I stumbled across this question on [stackoverflow](http://drupal.stackexchange.com/questions/162719/phpunit-with-custom-contrib-and-submodules-structure). So you have a couple of options from here:

### Option 1 - Create and use your own phpunit.xml.dist file

You can simply copy (and modify) Drupal 8 core's phpunit.xml.dist file into git repo somewhere (perhaps outside the webroot), and use this file for all your custom module tests.

### Option 2 - Patch Drupal 8 core

Another option (which is the option I took) was to apply a simple patch to Drupal core. There is an [open issue on drupal.org](https://www.drupal.org/node/2499239) to look at scanning all sub-directories for test files. At the time of writing it was uncertain whether this patch would be accepted by the community.

## Step 2, write your tests

There are some general conventions you should use when writing your PHPunit tests:

* the suffix of the filename should be <code>Test.php</code>, e.g. <code>MonthRangeTest.php</code>
* the files should all reside in either the directory <code>/MY_MODULE/tests/src/Unit/</code> or a sub directory of that

More information on the requirements can be found on the [drupal.org documentation](https://www.drupal.org/node/2116043).


### Dataproviders

Data providers are pretty much the best thing to happen to automated testing. Instead of testing a single scenario, you can instead test a whole range of permutations in order to find those bugs. You start by declaring an annotation <code>@dataProvider</code> for your test method:

{% highlight php %}
<?php
  /**
   * @covers ::getMonthRange
   * @dataProvider monthRangeDataProvider
   */
  public function testGetMonthRange($expected_start, $expected_end, $month_offset, $now) {
    // ... more code
  }
{% endhighlight %}

You then declare a method <code>monthRangeDataProvider</code> that returns an array of test cases (which are also arrays). The items in the data provider method are passed one at a time to the testing method, in the same order they are declared (so you can map them to friendly names).

{% highlight php %}
<?php
  /**
   * Data provider for testGetMonthRange().
   *
   * @return array
   *   Nested arrays of values to check:
   *   - $expected_start
   *   - $expected_end
   *   - $month_offset
   *   - $now
   */
  public function monthRangeDataProvider() {
    return [
      // Feb 29 @ noon.
      [1454284800, 1456790399, 0, 1456747200],
      // ... more tests follow
    ];
  }
{% endhighlight %}

More information can be found in the [phpunit documentation for data providers](https://phpunit.de/manual/3.7/en/writing-tests-for-phpunit.html#writing-tests-for-phpunit.data-providers).


### Testing for expected exceptions

Just as important as testing valid inputs, you should also test invalid inputs as well. This is easily achieved with <code>@expectedException</code> annotations above your test method:

{% highlight php %}
<?php
  /**
   * Tests that an end date that is before the start date produces an exception.
   *
   * @expectedException        Exception
   * @expectedExceptionMessage Start date must be before end date
   */
  public function testGetWorkingDaysInRangeException() {
    // ... more code in here
  }
{% endhighlight %}


## Step 3, enhance your test class with PHPunit metadata

You can annotate both the test class and the methods to provide additional information and metadata about your tests:

**@covers**

This is mainly used for PHPunit's automated code coverage report, but I find it also very helpful for developers to up front state what method that are testing.

**@coversDefaultClass**

This is used at a class level, and saves you having to write rather lengthy @covers statement for all your testing methods, if they all test the same class.

**@depends**

If a certain test makes no sense to run unless a previous test passed, then you can add in a 'depends' annotation above the test method in question. You can depend on multiple other tests too. Note, that this does not change the execution order of the tests, they are still executed top to bottom.

**@group** or **@author**

You can think of adding a 'group' to a PHPunit class the same as tagging in. It is free tagging in that sense, and you can tag a single class with many tags. This should allow you to categorise your tests. @author is an alias of group, the idea being you can run all tests written by a particular developer.

More information can be found in the [PHPunit documentation on annotations](https://phpunit.de/manual/3.7/en/appendixes.annotations.html).


## Step 4, run your test suite

This section assumes you have opted to use Drupal core's phpunit.xml.dist file (modify the paths as appropriate if you are using a file in another location).

List groups (or tags)

{% highlight bash %}
cd core/
../vendor/bin/phpunit --list-groups
{% endhighlight %}

Run all tests that are tags with a particular group (or tag)

{% highlight bash %}
cd core/
../vendor/bin/phpunit --group tamdash
{% endhighlight %}

Example CLI output

{% highlight bash %}
$ ../vendor/bin/phpunit --group tamdash
PHPUnit 4.8.11 by Sebastian Bergmann and contributors.
...........
Time: 5.01 seconds, Memory: 144.25Mb
OK (11 tests, 18 assertions)
{% endhighlight %}

If you are using PHPStorm, spend a few minutes and [set this up too](https://www.drupal.org/node/2288559).

<img src="/img/phpunit/phpstorm.png" alt="Set up PHPStorm to run PHPunit tests" class="img-responsive img-thumbnail" />

Example output

<img src="/img/phpunit/phpstorm-run.png" alt="Running PHPunit tests in PHPStorm" class="img-responsive img-thumbnail" />

So now there is no need to flip back to your terminal if you just want to quickly run a group of tests.

## Conclusion

PHPunit is a great way to be able to run quick tests on isolated parts of your code. Tests often take less than 10 seconds to run, so developer feedback is near instant. It also forces your developers to write better more testible code from the get go. This can only be a good thing. Personally I am very excited to see PHPunit join Drupal 8, and cannot wait to see what people do with it.

## Comments

There seems to be quite healthy debate on whether contrib or custom modules should ship with their own phpunit.xml.dist file or whether Drupal core's file should cover both. I am keen to hear anyone's thoughts on this. Also let me know if you have any contrib modules in the wild shipping their own phpunit.xml.dist files, and how you found that process.
