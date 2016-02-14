---
layout: post
title: "Profiling Drupal 7 performance with XHProf and Devel"
permalink: /article/profiling-drupal-7-performance-xhprof-and-devel/
permalink-disqus: /article/profiling-drupal-7-performance-xhprof-and-devel
author: "Craig Pearson"
categories:
- tutorial
tags:
- drupalplanet
- performance
- xhprof
- apache
- drupal
---


There often comes a time when you wonder why your page is occasionally experiencing a PHP Out Of Memory error with Drupal. Without profiling tools, you have no idea why Drupal is consuming the memory it is. Luckily the team at Facebook have created the tool <a href="https://github.com/facebook/xhprof">XHProf</a>.

## How to install XHProf with apache ##

This can be done entirely with PECL:
{% highlight bash %}
pear channel-update pear.php.net
sudo apt-get install php5-common graphviz
sudo pecl config-set preferred_state beta
sudo pecl install xhprof
{% endhighlight %}

Create the directory for the data to live in, I choose to use /tmp but you can choose another location for more permanent storage

{% highlight bash %}
mkdir /tmp/xhprof
chmod 777 /tmp/xhprof
{% endhighlight %}

If you use apache, then setting this up is trivial. First create the settings file (included automatically)

{% highlight bash %}
sudo vim /etc/php5/conf.d/xhprof.ini
{% endhighlight %}

Insert:

{% highlight bash %}
[xhprof]
extension=xhprof.so
xhprof.output_dir="/tmp/xhprof"
{% endhighlight %}

Then let apache know that all URLs beginning with "xhprof_html" are indeed XHProf URLs.

{% highlight bash %}
sudo vim /etc/apache2/conf.d/xhprof.conf
{% endhighlight %}

Insert:

{% highlight bash %}
alias /xhprof_html "/usr/share/php/xhprof_html/"
{% endhighlight %}

Restart Apache

{% highlight bash %}
sudo service apache2 restart
{% endhighlight %}

## Drupal 7 integration with Devel ##

The [devel](http://drupal.org/project/devel "Visit the module on Drupal.org") module makes the integration with XHProf as simple as enabling the module and setting some variables.

{% highlight bash %}
drush dl devel
drush en devel
drush vset devel_xhprof_enabled 1
drush vset devel_xhprof_directory "/usr/share/php"
drush vset devel_xhprof_url "/xhprof_html"
{% endhighlight %}


And there you have it, now all your pages will be profiled as they are generated, and Devel will embed a link at the bottom of the page in order to view the metrics, and callgraph trace.

## Screenshots ##

Here are some images snapped from a recent project on a complex page generation:

<img src="/img/xhprof/1.png" width="547" height="144" alt="XHProf summary"  />

The metrics page lists all functions, and can be sorted numerous ways:

<img src="/img/xhprof/2.png" width="611" height="162" alt="XHProf sorting"  />

The callgraph is useful to find the critical path in terms of page load:

<img src="/img/xhprof/3.png" width="810" height="559" alt="XHProf callgraph"  />
