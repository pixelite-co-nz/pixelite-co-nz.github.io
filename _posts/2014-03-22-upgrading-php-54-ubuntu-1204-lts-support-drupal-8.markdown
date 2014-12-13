---
layout: post
title: "Upgrading PHP to 5.4 on Ubuntu 12.04 LTS to support Drupal 8"
excerpt: "As of the 28 February 2014, Drupal 8 now requires a minimum PHP version of 5.4.2."
header-img: "img/upgradingphp/php_minimum_web.png"
permalink: /article/upgrading-php-54-ubuntu-1204-lts-support-drupal-8
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- ubuntu
- php
---


As of the 28 February 2014, Drupal 8 now requires a minimum PHP version of 5.4.2. For background information read [the drupal.org issue](https://drupal.org/node/1498574).

This places everyone running Ubuntu 12.04 LTS in an awkward situation as the PHP version bundled with this release is [PHP 5.3.10](https://launchpad.net/ubuntu/precise/+source/php5).

Luckily there are options to solve this:

## Perform a dist-upgrade to 14.04 LTS ##

This may not be the easiest option, but I mention it for completeness, as this newer version of Ubuntu (Trusty Tahr) [contains PHP 5.5.9](https://launchpad.net/ubuntu/trusty/+source/php5) out of the box.

## Add a PPA and install newer a newer version of PHP ##

For most people this will be the easiest option. For PHP 5.4.x run the command:

{% highlight bash %}
sudo add-apt-repository ppa:ondrej/php5-oldstable
{% endhighlight %}

or for PHP 5.5.x run:

{% highlight bash %}
sudo add-apt-repository ppa:ondrej/php5
{% endhighlight %}

And then update your packages:

{% highlight bash %}
sudo apt-get update
sudo apt-get upgrade
{% endhighlight %}

The PPA maintainer has more information on the launchpad site https://launchpad.net/~ondrej/+archive/php5

### Common issues ###

I was getting the message "The following packages have been kept back" when running the upgrade command earlier

{% highlight bash %}
seanh /var/www/D8 git:8.x » sudo apt-get upgrade
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following packages have been kept back:
  libapache2-mod-php5 linux-generic linux-headers-generic linux-image-generic php-pear php5-cli php5-common php5-curl php5-dev php5-gd php5-mcrypt php5-mysql php5-pgsql php5-xdebug
{% endhighlight %}

This was solved by manually installing the packages:

{% highlight bash %}
sudo apt-get install php-pear php5-cli php5-common php5-curl php5-dev php5-gd php5-mcrypt php5-mysql php5-pgsql php5-xdebug
{% endhighlight %}

## Comments ##

Let me know if this worked for you in the comments, or if you have another way to easily update PHP on your stack.
