---
layout: post
title: "Configuring Aptana for Drupal development"
header-img: "img/post-bg-hero.png"
subtitle: "Eclipse on steroids"
permalink: /article/configuring-aptana-drupal-development
author: "Sean Hamlin"
categories:
- tutorial
tags:
- ubuntu
- aptana
- ide
- drupalplanet
- drupal
---

<p>For a long time, it has been the holy grail of web development IDE's to have <em>perfect</em> integration into the system you are working on at the time. For me, this means doing Drupal development and having features of:</p><ul><li>Correct syntax highlighting <em>(Aptana default)</em></li><li>Syntax validation inline whilst typing <em>(Aptana default)</em></li><li>Drupal hook autocomplete suggestions</li><li>API documentation for both PHP and Drupal <em>(Aptana does PHP by default, not Drupal)</em></li><li>jQuery syntax highlighting <em>(Aptana default)</em></li><li>CSS syntax highlighting<em> (Aptana default)</em></li><li>Git Version control aware</li><li>Easy to read font</li><li>Easy to read colour scheme and contrast</li></ul><p>As you can see, Aptana fulfills most of the base requirements, we just need to add some extra pieces to taylor it to suit our needs.</p><h2>Drupal hook autocomplete suggestions</h2><p>Having the ability to autocomplete hook functions is key to creating modules and themes rapidly, and without time-wasting typos. Fortunately there exists a ruble for Drupal hooks under Drupal 7.</p>

<h3>Installation</h3>

<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">mkdir -p ~/Documents/Aptana\ Rubles/
git clone https://github.com/HollyIT/Drupal-Bundle-for-Aptana.git ~/Documents/Aptana\ Rubles/Drupal-Bundle-for-Aptana/</pre>
<p>This should take effect immediately, allowing you to now autocomplete Drupal hooks. For example, in a module file, type</p><p>'hook_form' - you should see an autocomplete dropdown appear allowing you to choose the Drupal API hook to implement.</p>

<img alt="" class="img-responsive img-thumbnail" height="199" width="695" src="/img/aptana/ad-hooks.png">

<p>Selecting the hook will prepopulate the neccassary code into the module, including the comment at the top.</p>
{% highlight php linenos %}
<?php
/**
* Implements hook_form_BASE_FORM_ID_alter().
*/
function pixelite_theme_form_BASE_FORM_ID_alter(&$form, &$form_state, $form_id) {

}
?>
{% endhighlight %}
<h2>Drupal API documentation</h2><p>The above ruble also builds an internal link to the drupal.org API documentation. This enables you to inspect any core Drupal API function and open the API documentation page for it. Simply:</p><ol><li>Highlight the whole function</li><li>Right click -&gt; Commands -&gt; Drupal -&gt; Documentation for selection</li></ol><p>Or alternatively use '<em>Ctrl + H</em>'</p><h2>Git Version control aware</h2><p>Having git integration is also a must have, as often something as simple as knowing what branch you are working on right inside your IDE can make a big difference. You can also make and push commits from within Aptana, I choose to still do this on a seperate terminal, but it can also be accomplished completely from either the GUI, or built-in terminal in Aptana as well.</p><h3>Installation</h3><p>As with all Eclipse plugins, navigate to</p><ol><li>Help -&gt; Install new software</li></ol><p>Enable the Eclipse update site</p><ol><li>Click 'Available software sites'</li><li>Check 'Eclipse Indigo Update Site'</li><li>Click OK</li><li>Click Work with 'All Available Sites'</li></ol><p>Now if you search for <em>git</em>, you should see the 'Egit' plugin be available, check this, and finish installing the plugin through the wizard interface.</p>

<img alt="" class="img-responsive img-thumbnail" height="369" width="418" src="/img/aptana/ad-git.png">

<p>Once the plugin has finished installation, Aptana will prompt you to restart, do this. When Aptana is back you will have a new perspective available - 'Git Repository Exploring'.</p>

<img alt="" class="img-responsive img-thumbnail" height="161" width="264" src="/img/aptana/ad-git2.png">

<h2>Easy to read font</h2><p>My personal favourite mono-spaced font on Ubuntu is Inconsolata and can easily be installed by</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">sudo apt-get install ttf-inconsolata</pre>
<p>There are a number of other good choices as well, let me know what font you like to use in the comments.</p><p>In order to get Aptana to use the font, you need to</p><ol><li>Navigate to Window -&gt; Preferences</li><li>Expand Aptana Studio -&gt; Themes</li></ol><p>Here you can select the font desired. The screenshot shows my selection:</p>

<img alt="" class="img-responsive img-thumbnail" height="566" width="646" src="/img/aptana/ad-font.png">

<h2>Easy to read colour scheme and contrast</h2><p>Again this is a personal preference item here, Aptana ships with a whole host of themes out of the box you can choose from, and for the most part they are fairly decent. I even quite like the default 'Aptana Studio' theme.</p><p>But the above all changed after I read http://ethanschoonover.com/solarized which goes on to talk about the reasons behind the colours choosen, and why they are better for your eyes. I would recommend the read. In any case, some nice people have thrown together an Aptana theme for us to use which makes use of the above solarized colour scheme.</p><p>Firsly, clone the git repo down</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">mkdir -p ~/projects/Aptana-Solarized/
git clone https://github.com/bueltge/Aptana-Solarized.git ~/projects/Aptana-Solarized/</pre>
<p>Then let Aptana know about the new themes</p><ol><li>Navigate to Window -&gt; Preferences</li><li>Expand Aptana Studio -&gt; Themes</li><li>Import the new themes (there are two)</li></ol><p>I find the light theme works really well during the day, and the dark theme is perfect for the laptop when coding at night</p><h2>Final thoughts</h2><p>Well everyone, that is how I like to code Drupal projects inside Aptana, let me know if you have anymore tips and tricks that may be of some help to me or to others reading this post.</p><p>Thanks</p>
