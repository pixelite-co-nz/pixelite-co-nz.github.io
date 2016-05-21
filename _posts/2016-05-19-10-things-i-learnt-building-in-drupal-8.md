---
layout: post
title: "10 things I learnt building in Drupal 8"
subtitle: "Some of the neat things I have found with Drupal 8 and some of my lessons learned"
excerpt: "I thought I would describe some of the neat things I have found during this time and some of my lessons learned."
header-img: "img/d8/d8.png"
permalink: /article/10-things-i-learnt-building-in-drupal-8/
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- twig
- drupalconsole
---

## Introduction

I have had the chance to be involved with 2 fresh builds with Drupal 8 now, I thought I would describe some of the neat things I have found during this time and some of my lessons learned. My hope is that blog post will help you in your journey with Drupal 8.

## 1. Drupal Console is awesome

Every time you need to generate a custom module, or a new block in a custom module, you can quickly and easily use [Drupal Console](https://drupalconsole.com/) to produce the code scaffolding for you. This quite easily makes the job of a developer a lot less stressful, and allows you to focus on actually writing code that delivers functionality.

I plucked these example commands that I use frequently from my bash history:

{% highlight bash %}
drupal site:mode dev
drupal generate:module
drupal generate:plugin:block
drupal generate:routesubscriber
drupal generate:form:config
{% endhighlight %}

Documentation is [online](http://docs.drupalconsole.com/en/index.html) but for the most part, the commands are self documenting, if you use the `--help` option, then you get a great summary on the command, and the other options you can pass in.

The other nice thing is that this is a [Symfony Console](http://symfony.com/doc/current/components/console/introduction.html) application, so it should feel very familiar to you if you used another tool written in the same framework.


## 2. Custom block types are amazing

In Drupal 7 land there was [bean](https://www.drupal.org/project/bean) which was an attempt to stop making 'meta' nodes to fill in content editable parts of complex landing pages. Now, fast forward to Drupal 8, and custom block types are now in Drupal Core.

This basically means as a site builder you now have another really powerful tool at your disposal in order to model content effectively in Drupal 8.

Each custom block type can have it's own fields, it's own display settings, and form displays. 

Here are the final custom block types on a recent Drupal 8 build:

<img src="/img/d8/blocktypes.png" alt="Custom block types in Drupal 8" class="img-responsive img-thumbnail" />

One downside is that there is no access control per custom block type (just a global permission "administer blocks"), no doubt contrib will step in to fill this hole in the future (does anyone know a module that can help here?). In the mean time there is [drupal.org issue](https://www.drupal.org/node/1975064) on the subject.

I also found it weird that the custom blocks administration section was not directly under the 'structure' section of the site, there is another [drupal.org issue](https://www.drupal.org/node/2501691) about normalising this as well. Setting up some default shortcuts really helped me save some time.

<img src="/img/d8/shortcuts.png" alt="Shortcuts are handy in Drupal 8 to remember where the custom block section is" class="img-responsive img-thumbnail" />


## 3. View modes on all the things

To create custom view modes in Drupal 7 required either a custom module or Dave Reid's [entity_view_mode](https://www.drupal.org/project/entity_view_mode) contrib module. Now this is baked into Drupal 8 core.

View modes on your custom block types takes things to yet another level still as well. This is one more feather in the Drupal site builder's cap.

## 4. Twig is the best

In Drupal 7 I always found it weird that you could not unleash a front end developer upon your site and expect to have a pleasant result. In order to be successful the themer would need to know PHP, preprocess hooks, template naming standards, the mystical specific order in which the templates apply and so on. This often meant that a backend and front end developer would need to work together in order to create a good outcome.

With the introduction of Twig, I now feel that theming is back in the hands of the front end developer, and knowledge of PHP is no longer needed in order to override just about any markup that Drupal 8 produces.

**Pro tip** - use the Drupal Console command <code>drupal site:mode dev</code> to enable Twig development options, and disable Drupal caching. Another positive side effect is that Twig will then render the entire list of templates that you could be using, and which one you actually are using (and where that template is located).

<img src="/img/d8/twigdevel.png" alt="Twig developer comments in HTML are the best" class="img-responsive img-thumbnail" />

**Pro tip:** - If you want to use a template per custom block type (to which I did), then you can use this PHP snippet in your theme's <code>.theme</code> file (taken from [drupal.org](https://www.drupal.org/node/2460893#comment-10766412)):

{% highlight php %}
<?php
/**
 * Implements hook_theme_suggestions_HOOK_alter() for form templates.
 *
 * @param array $suggestions
 * @param array $variables
 */
function THEMENAME_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  if (isset($variables['elements']['content']['#block_content'])) {
    array_splice($suggestions, 1, 0, 'block__bundle__' . $variables['elements']['content']['#block_content']->bundle());
  }
}
{% endhighlight %}


## 5. Panelizer + panels IPE is a formidable site building tool

When looking for a layout manager to help build the more complex landing pages, I came across [panelizer](https://www.drupal.org/project/panelizer) + [panels IPE](https://www.drupal.org/project/panels). Using panelizer you are able to:

* create per node layout variants
* apply a single layout to all nodes of a particular bundle (e.g. all your news articles have the same layout)

The other neat thing is that the layouts themselves are now standardised between all the various layout managers using a contrib module called [layout_plugin](https://www.drupal.org/project/layout_plugin). Also they are just YAML and Twig. Simple. There is even an effort to get this [merged into Drupal 8.2](https://www.drupal.org/node/2296423) which I think would be a great idea.


**Downside** - all JS is still rendered on the page even though the user (e.g. anonymous users) have no access to panelizer. There is a patch on [drupal.org](https://www.drupal.org/node/2688951) to help fix this.

Since starting this build there has also been a stable release of [display suite](https://www.drupal.org/project/ds) come out for Drupal 8 as well giving you even more options.

## 6. You can build a rather complex site with very little contributed modules

For this most recent site I build I got away with using only 10 contributed modules (one of which - [devel](https://www.drupal.org/project/devel) was purely for debugging purposes).

* ctools
* google_analytics
* metatag
* panels
* token
* contact_block
* devel
* layout_plugin
* panelizer
* pathauto

This means you are inherently building a more stable and supportable site, as most of the functionality now comes out of Drupal core.


## 7. The contact module now is supercharged

In Drupal 7, the contact module was one of those modules to which I never turned on, as it was rather inflexible. You could not change the fields in a UI, nor add email recipients, or have more than 1 form. Now in Drupal 8 you can have as many "contact" forms as you want, each one is fieldable, and can send emails to as many people as needed.

You can also enhance the core module with:

* [contact_block](https://www.drupal.org/project/contact_block) - allows you to place the contact form in a block
* [contact_storage](https://www.drupal.org/project/contact_storage) - allows you to store the submissions in the database, rather than firing an email and forgetting about it

There is still a place for webform, namely:

* large complex form with lots of fields
* multi-step forms
* forms you want to 'save draft'

You can read more about this in the [OS training blog post](https://www.ostraining.com/blog/drupal/drupal-8-contact-forms/#comment-2333911795) on the contact module.

**Downside** - I wanted to have a plain page use the path <code>/contact</code> but the contact module registers this path, so pathauto gave my contact page a path of <code>/contact-0</code>. Luckily creating a [route subscriber](https://www.drupal.org/node/2187643) with Drupal Console was painless, so altering the contact module route was very simple to do. I can paste the code here if needed, but most of it is the code that Drupal Console generates for you.

## 8. PHPunit is bundled into core

Now that Drupal 8 is largely Object Oriented (OO), you are able to test classes using PHPunit. I have [wrote about phpunit](/article/writing-phpunit-tests-for-your-custom-modules-in-drupal-8/) in the past if you want to know more.

## 9. Views is in core

This was the main reason why adoption of Drupal 7 was so slow after it's initial 7.0 release, as everyone needed views to be stable before jumping ship. Now with views bundled into core, views plugins are also being ported at a great rate of knots too.

## 10. CKEditor is in core

I often found that this was one library that never (or hardly ever) got updated on sites that had been around for a while. More worryingly, CKEditor (the library) would from time to time fix security related issues. Now that this comes with Drupal 8 core, it is just one less thing to worry about.

Also I would love to shout out to [Wim Leers](https://www.drupal.org/u/wim-leers) (and other contributors) for [revamping the image dialog](https://www.drupal.org/node/2027181) with alignment and caption options. I cannot tell you how much pain and suffering this caused me in Drupal 7.

<img src="/img/d8/image.png" alt="The image dialog bundled with Drupal 8 in CKeditor is amazing" class="img-responsive img-thumbnail" />


## Comments

If you have built a site recently in Drupal 8 and have found anything interesting or exciting, please let me know in the comments. Also keen to see what sites people have built, so post a link to it if it is public.
