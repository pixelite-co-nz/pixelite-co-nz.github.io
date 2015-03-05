---
layout: post
title: Analyse Apache traffic with asql log interface
subtitle: "Get meaningful stats/data from your apache log files easily"
header-img: "img/analyse-apache-traffic/traffic.jpeg"
permalink: /article/analyse-apache-traffic-with-asql-log-interface
author: "Craig Pearson"
twitter: "@thepearson"
categories:
- tutorial
tags:
- apache
- sql
- analytics
- log
---

## tl;dr

The asql command allows you to load up your apache logs into a temporary SQLite database and query the log files as you would any normal SQL database. It provides a both interactive prompt and the ability to be used as a script interface.


## Installation

If you're running Ubuntu you can install asql with the following command:

{% highlight bash %}
sudo apt-get install asql
{% endhighlight %}



## Getting started with ASQL

You can start up asql interactive mode by simply typing `asql`

{% highlight bash %}
asql v1.6 - type 'help' for help.
asql>
{% endhighlight %}

From the prompt type `help` for more info

{% highlight bash %}
asql> help
asql v1.6
The following commands are available within this shell:

     alias - Define, or view, persistent aliases.
     alter - Run an ALTER query against the database.
    create - Run a CREATE query against the database.
    delete - Run a DELETE query against the database.
      drop - Run a DROP query against the database.
      exit - Exit the shell.
      help - Show general, or command-specific, help information.
    insert - Run an INSERT query against the database.
      load - Load an Apache logfile.
      quit - Exit this shell.
   restore - Load a previously save'd temporary database.
      save - Save the temporary database.
    select - Run a SELECT query against the database.
      show - Show the structure of the database.
    update - Run an UPDATE query against the database.

For command-specific help run "help command".
{% endhighlight %}

First up we want to load a log file. To do this we can run `load /path/to/my.log` Lets try this now.

{% highlight bash %}
asql> load /var/log/apache2/access.log
Loading: /var/log/apache2/access.log
{% endhighlight %}

You can also use wildcards like `/var/log/apache2/access.log*` asql will also automatically load any files compressed with `*.gz` and `bzip2`.

It will load all the log files into a table called `logs`

Now lets try our first query

{% highlight sql %}
asql> SELECT COUNT(*) FROM logs;
22456
{% endhighlight %}


You can see the fields available to you by running `show`

{% highlight sql %}
show

   The table 'logs' table has the following columns:

  id      - ID of the request
  source  - IP, or hostname, which made the request.
  request - The HTTP request
  status  - The HTTP status-code returned
  size    - The size of the response served, in bytes.
  method  - The HTTP method invoked (GET, PUT, POST etc).
  referer - The HTTP referer (sic).
  agent   - The User-Agent which made the request.
  version - The HTTP version used by this client.
  date    - The date and time at which the request was made.
  label   - Any label applied when the logfile was read.
  user    - The remote (authenticated) user, if any.

{% endhighlight %}


Lets look at some more practical queries.


## Useful queries


This request is in the docs, it shows all the clients connecting to your webserver and the size of files/requests that they have downloaded in total.

{% highlight sql %}
SELECT source, SUM(size) AS number FROM logs GROUP BY source ORDER BY number DESC, source
{% endhighlight %}


Find the top 10 client addresses by hits

{% highlight sql %}
SELECT source, COUNT(id) hits FROM logs GROUP BY source ORDER BY hits DESC LIMIT 10;
{% endhighlight %}


Find the largest 20 HTML files requested

{% highlight sql %}
SELECT DISTINCT(request), size FROM logs WHERE SUBSTR(request, LENGTH(request)-3) = "html" ORDER BY size DESC LIMIT 20;
{% endhighlight %}


Show average hits per hour

{% highlight sql %}
SELECT hour, ROUND(AVG(number), 0) FROM (SELECT STRFTIME("%Y-%m-%d %H", date) date_hour, STRFTIME("%H", date) hour, COUNT(id) number FROM logs GROUP BY date_hour) GROUP BY hour;
{% endhighlight %}


You get the idea.

Feel free to experiment, and don't forget to look at `man asql` as there are some useful examples in the docs. Post any queries you think would be useful in the comments.
