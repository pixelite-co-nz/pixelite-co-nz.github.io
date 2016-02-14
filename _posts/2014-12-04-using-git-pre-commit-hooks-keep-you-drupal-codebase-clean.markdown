---
layout: post
title: "Using git pre-commit hooks to keep your Drupal codebase clean"
header-img: "img/pre-commit.png"
permalink: /article/using-git-pre-commit-hooks-keep-you-drupal-codebase-clean/
permalink-disqus: /article/using-git-pre-commit-hooks-keep-you-drupal-codebase-clean
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- git
---

All too often when peer reviewing code done by other Drupalers, I spot debug code left in the commit, waiting for the chance to be deployed to staging and break everything.

I started to read up on [git hooks](http://git-scm.com/docs/githooks), paying particular attention to pre-commit:

<blockquote>
<p>This hook is invoked by <em>git commit</em>, and can be bypassed with <code>--no-verify</code> option.  It takes no parameter, and is invoked before obtaining the proposed commit log message and making a commit.  Exiting with non-zero status from this script causes the <em>git commit</em> to abort.</p>
</blockquote>

You can write you pre-commit hook in any language, bash seems the most sane due to the power of text analysis tools at your disposal.

## Where is the code ##

Here is a link to the github repository with the pre-commit hook:

    git clone https://github.com/wiifm69/drupal-pre-commit.git

## Features ##

* Executes PHP lint across the PHP files that were changed
* Checks PHP for a blacklist of function names (e.g. <code>dsm()</code>, <code>kpr()</code>)
* Checks JavaScript/CoffeeScript for a blacklist of function names (e.g. <code>console.log()</code>, <code>alert()</code>)
* Ignores deleted files from git and will not check them
* Tells you all of the fails at the end (and stores a log)
* Only lets the commit go ahead when there are no fails

## Installation ##

{% highlight bash %}
cd /tmp
git clone https://github.com/wiifm69/drupal-pre-commit.git
cd drupal-pre-commit
cp scripts/pre-commit.sh [PATH_TO_YOUR_DRUPAL_PROJECT]/scripts
cd [PATH_TO_YOUR_DRUPAL_PROJECT]
ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit
{% endhighlight %}

## Feedback ##

I am keen to hear from anyone else on how they do this, and if you have any enhancements to the code then I am happy to accept pull requests on github. Happy coding.
