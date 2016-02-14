---
layout: post
title: "Drupal 7 & Backbone JS: Part 1 - Setting up/Installation"
header-img: "img/post-bg-01.jpg"
permalink: /article/drupal-7-backbone-js-part-1-setting-upinstallation/
permalink-disqus: /article/drupal-7-backbone-js-part-1-setting-upinstallation
author: "Adam Bramley"
categories:
- tutorial
tags:
- drupalplanet
- drupal
- backbone
- js
- development
---

## Introduction (who the hell is Adam?)

* [Drupal](http://drupal.org/user/1036766)
* [Twitter](http://twitter.com/theacbramley)
* Senior Drupal Developer for [Catalyst IT Ltd](http://catalyst.net.nz/).

I was recently tasked with a small 4 week project for an internal client web application that was required to be built on Drupal 7. The app itself is an incredibly glorified carousel of content with a few other nifty bits and pieces. During analysis I thought this would be a great opportunity to utilise [Backbone.js](http://backbonejs.org/) as it's something I'd always wanted to have a crack at but never gotten around to learning. Furthermore, there seemed to be very little information about building content rich web apps using Drupal and Backbone, giving me an even deeper desire to see what could be done.

_Note: Unfortunately I can not show screenshots of this application as it is a private client app not accessible to the public. However, I'm currently attempting to [contribute a more complex example](https://drupal.org/node/2045387) to the backbone module which is a cut down version of the app I developed._

## Setting up (from a standard installation)
This first post is going to be a quick introduction to the [Backbone](http://drupal.org/project/backbone) module and how to get it set up. I also assume that you have [drush](https://drupal.org/project/drush) set up and know how to use it through the command line :)

**Download and enable the Backbone module**

*Currently, there are two modules which provide RESTful access to JSON objects in Drupal: [Services](http://drupal.org/project/services) and [Restful Web Services](http://drupal.org/project/restws). This tutorial will entirely use the Services module, a good explaination of the differences can be found in the [README](http://drupalcode.org/project/backbone.git/blob/refs/heads/7.x-1.x:/README.txt) of the Backbone module.*

From the command line you want to download the Backbone module. When you go to enable it, simply enable the backbone\_example module and all dependencies (except libraries) that we need for backbone to work will be downloaded and enabled automatically. Ignore the warning about the rest\_server module.

<a href="/img/backbone/enablebackbone.png">
  <img src="/img/backbone/enablebackbone.png" alt="Download and enable backbone" class="img-responsive img-thumbnail" />
</a>

*Libraries*

The Backbone module requires a few libraries to work:

* [Backbone.js](http://backbonejs.org/) (pretty obvious)
* [Underscore.js](http://documentcloud.github.com/underscore/) - this is what the example modules use for templating and it's what I'll be using throughout my tutorials. The Backbone module also supports [Twig.js](https://github.com/justjohn/twig.js) for templating, but I haven't tried it out (yet).
* One thing the [Backbone module doesn't specify](https://drupal.org/node/1939012) is the version of jQuery required for the module to even function. You need to visit the jquery update admin page on your Drupal site (should be /admin/config/development/jquery_update) and bump it up to 1.8.

For the backbone and underscore download and install them as specified (taken from the README):

* Download the latest version of [Underscore.js](http://documentcloud.github.com/underscore/)  into the
 appropriate libraries/underscore directory (usually sites/all/libraries/underscore).
* Enable Clean URLs for your site.
* Download the latest version of [Backbone.js](http://backbonejs.org/) into sites/all/libraries/backbone.
* Clear your caches! (drush cc all)

**Configure your site**

If you now visit the /backbone_example page you will notice it still doesn't work. Never fear, there are just a few things that you now have to configure before Backbone will function properly (maybe this should be added to the README too).

_Configure Services REST endpoint_
**Path:** /admin/structure/services

There is a default backbone_rest endpoint which you can use, but I advise you to clone the default one and make your own as this means you can export it to your own features etc. If you use the default one provided by the backbone module, any changes will not be able to be exported without altering contrib code (and no one wants to do that).

Click the dropdown in the operations column and hit clone.

<a href="/img/backbone/configureservices.png">
  <img src="/img/backbone/configureservices.png" alt="Configure Services" class="img-responsive img-thumbnail" />
</a>

_Enable Node and Views resources_
**Path:** /admin/structure/services/list/my_rest/resources

After saving the endpoint, you need to configure the resources available at the endpoint. For this tutorial we will only be using the Node Resource (and later Views), so tick both of those. You can also configure other things in Services like Authentication, and what formats and parsing are available from the endpoint (under the Server tab).

<a href="/img/backbone/configureresources.png">
  <img src="/img/backbone/configureresources.png" alt="Configure Resources" class="img-responsive img-thumbnail" />
</a>

_Configure Backbone module settings_
**Path:** /admin/config/development/backbone

The Backbone module also has a settings page where you need to specify the REST Backend, the path to the endpoint, which backbone variant to use, and which pages to include backbone on. For the purposes of the tutorial we'll set pages to "*" so all pages get the backbone library included. However, in a real project this should be configured to your backbone app's path(s).

<a href="/img/backbone/configurebackbone.png">
  <img src="/img/backbone/configurebackbone.png" alt="Configure Backbone" class="img-responsive img-thumbnail" />
</a>

**Test it works!**
**Path:** /backbone_example

Going to this page you should see a form. Create a piece of content, then enter it's nid into this form and hit load. If you see your content appear you've got working Backbone and Drupalness!

<a href="/img/backbone/testbackbone.png">
  <img src="/img/backbone/testbackbone.png" alt="Test Backbone" class="img-responsive img-thumbnail" />
</a>

## Conclusion

I hope that this guide has proven of use to helping you set up Backbone on your site, essentially I made it to cover all the gotchas that I ran into while setting it up. Next in this small series of tutorials I'll be going over the [backbone\_example\_complex submodule](https://drupal.org/node/2045387) that I wrote and am currently trying to get commited to the module. This utilises external libraries, views, and much more complex backbone js. I had a great time learning Backbone and using it with Drupal, I'm definitely not the greatest backbone coder (let alone javascript) but it was a nice break from PHP :).

### Feedback!

Please give me feedback! This is my first "blog" post so I'd love to know what you thought! If it inspired you to make a Drupal-bone app (yup I just thought of that), or if you know of any awesome apps that use these wonderful technologies let me know in the comments!
