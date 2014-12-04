---
layout: post
title: SQL injection and Drupal 7 - top 1 of 10 OWASP security risks
header-img: "img/sql-inject/query.png"
permalink: /article/sql-injection-and-drupal-7-top-1-10-owasp-security-risks
author: "Sean Hamlin"
categories:
- tutorial
tags:
- drupal
- drupalplanet
- owasp
- security
---

As part of the [series of blog posts on the top 10 OWASP web application security risks](http://www.pixelite.co.nz/tag/owasp) and how to defend against them in Drupal 7, here is the first post in the series. This post deals with the top security hole - classified as "injection".

From the [OWASP top 10 security risks](https://www.owasp.org/index.php/Top_10_2013-A1-Injection):

> Injection flaws, such as SQL, OS, and LDAP injection occur when untrusted data is sent to an interpreter as part of a command or query.

For this post I will cover what SQL injection is and how Drupal 7's built in tools can help you avoid this.

## What is SQL injection ##

### Incorrectly filtered escape characters ###

This form of SQL injection occurs when the user supplied input does not have the escape characters filtered from the query. This is easily demonstrated with this SQL query example (which you should never write), imagine the query:

{% highlight php %}
'SELECT nid FROM node WHERE nid = ' . $_GET['nid']
{% endhighlight %}

What happens when the query parameter 'nid' is:

{% highlight php %}
' or '1'='1
{% endhighlight %}

Or even worse, imagine this is the query parameter 'nid':

{% highlight php %}
1'; DROP TABLE NODE; --
{% endhighlight %}

### Incorrect type handling ###

This occurs when user supplied input is not strongly typed. For instance you may be expecting an integer but as a developer make no effort to enforce this. The above example shows this in action as well.

### Blind SQL injection ###

This is used when an application is vulnerable to SQL but the results are not visible to the attacker. A crafted query parameter 'nid' (for the above SQL query) might something like:

{% highlight php %}
5 AND substring(@@version,1,1) = 4
{% endhighlight %}

If you received a non-error page it would indicate that the server was running MySQL 4.

For more information see the [wikipedia page on SQL injection](http://en.wikipedia.org/wiki/SQL_injection).

## Database abstraction layer ##

The easiest way is to use the database abstraction layer effectively. By writing your database queries in this manner not only are you defending against injection from unclean inputs, but you are also ensuring your query will execute on *all* supported databases (MySQL, PostgreSQL, SQLite and other contributed types e.g. [Oracle](https://drupal.org/project/oracle)). So this method is great for portability and security.

Example insert query showing the abstraction layer:

{% highlight php %}
$nid = db_insert('node')
->fields(array('title', 'uid', 'created'))
->values(array(
  'title' => 'Example',
  'uid' => 1,
  'created' => REQUEST_TIME,
))
->execute();
{% endhighlight %}

See the [documentation for more information on the database abstraction layer](https://drupal.org/developing/api/database).

Dynamic select queries are possible by adding to the query object:

{% highlight php %}
// Create an object of type SelectQuery.
$query = db_select('users', 'u');
// Add extra detail to this query object: a condition, fields and a range.
$query->condition('u.uid', 0, '<>');
$query->fields('u', array('uid', 'name', 'status', 'created', 'access'));
$query->range(0, 50);
$result = $query->execute();
{% endhighlight %}

Adding tags to your queries allows you (or another module) to alter the query before executed. The best example of this is the node_access tag.

{% highlight php %}
$query->addTag('node_access');
{% endhighlight %}

By adding that simple tag onto any SELECT query, it ensures that all returned node IDs node access restrictions placed on it. All queries that retrieve a list of nodes (or node IDs) for display to users should have this tag (this touches on a few other OWASP security risks).

## Static or custom queries with db_query() ##

If you do need to write static and fast (no placeholders) or extremely custom (multiple complex joins, sub-queries, temporary tables) SQL you can elect for the less standardised method db_query().

**N.B. this should never be the first choice for dynamic (with placeholders) database queries - db_select() should be used where possible**.

Example static query that is perfect for db_query():

{% highlight php %}
$result = db_query("SELECT nid, title FROM {node}");
{% endhighlight %}

With db_query() and dynamic queries you need to perform any sanitisation of the query yourself, luckily there are built in methods you can take advantage of here.

Example select query showing the raw SQL:

{% highlight php %}
$result = db_query('SELECT n.nid, n.title, n.created FROM {node} n WHERE n.uid = :uid', array(':uid' => $uid))->fetchAll();
{% endhighlight %}

With the above example you can see the uid parameter is escaped as it is passed in as an argument. In general if you are creating raw SQL with any form of string concatenation you are most likely doing it wrong.

See the [documentation for more information on db_query()](https://api.drupal.org/api/drupal/includes%21database%21database.inc/function/db_query/7).

## Update 13 November ##

* I have added a section on what SQL injection is, and the common attacks
* I have made clearer that db_select() is the preferred method of querying the database over db_query()
* Removed the section on db_escape_table() as it was seen as being not helpful.

## Further reading ##

Want to read more about this topic, here are a few resources that can help you:

* [Drupal security whitepaper](http://drupalsecurityreport.org/sites/drupalsecurityreport.org/files/drupal-security-white-paper-1-1.pdf) (a little old 2010, but still worth a read)
* [Static queries using db_query() in Drupal](https://drupal.org/node/310072)
* [Dynamic queries using db_select() in Drupal](https://drupal.org/node/310075)

## Comments ##

If I have missed any techniques, or you know of any modules or automated tools that may help, let me know in the comments. I am also after better 'further reading' material, so if there are other blog posts that deal with SQL injection let me know.