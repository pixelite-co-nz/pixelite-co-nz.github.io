---
layout: post
title: Using Snap.svg for rich interactivity
subtitle: "A quick intro into using Snap.svg"
header-img: "img/snap/background.jpg"
permalink: /article/using-snap-svg-for-rich-interactivity
author: "Craig Pearson"
twitter: "@thepearson"
categories:
- tutorial
tags:
- svg
- graphics
---

## What is Snap.svg?

Snap.svg (Snap) is a modern javascript library that allows developers to interact with Scalable vector graphics (or [svg]). According to the [website]. Snap is...

> ... a brand new JavaScript library for working with SVG. Snap provides web developers with a clean, streamlined, intuitive, and powerful API for animating and manipulating both existing SVG content, and SVG content generated with Snap.

Snap is designed to be a modern replacement for the likes of [Raphael]. Instead of focusing on compatibility with the older browsers like Internet Explorer 6, Snap instead drops support for older browsers in favor of a more complete SVG feature set.



## A nondescript mustachioed figure

I'll show how I made this basic interactive. (If you want to know how I made the [source SVG] file, let me know, I'll do up a tutorial for that if there's interest)

<hr>
<div class="inline">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.2.0/snap.svg-min.js"></script>

    <script type="application/javascript">
        $(function() {
            var s1 = Snap("#svg");

            Snap.load("/img/mario.svg", function(f) {
                var layer0 = f.select("#mario");
                var original_size = 40;
                var hover_size = 24;
                var animation_time = 250;

                $.each(layer0.selectAll("rect").items, function() {

                    this.attr({
                       origX:  this.attr('x'),
                       origY:  this.attr('y'),
                       modX:  parseInt(this.attr('x')) + ((original_size-hover_size)/2),
                       modY:  parseInt(this.attr('y')) + ((original_size-hover_size)/2)
                    });

                    this.mouseover(function() {
                        this.animate({
                            x: parseInt(this.attr('modX')),
                            y: parseInt(this.attr('modY')),
                            width: hover_size,
                            height: hover_size
                        }, animation_time, mina.bounce);
                    }).mouseout(function() {
                        this.stop();
                        this.animate({
                            x: parseInt(this.attr('origX')),
                            y: parseInt(this.attr('origY')),
                            width: original_size,
                            height: original_size
                        }, animation_time*5, mina.bounce);
                    }).click(function() {
                        alert('The RECT with the ID: "' + this.attr('id') + '", has the style attributes "' + this.attr('style') + '"');
                    });
                });
                s1.append(layer0);
            });

        });
    </script>
    <svg id="svg" viewBox="0 0 640 640" preserveAspectRatio="xMinYMin meet"></svg>
</div>

<hr>

While this interactive doesn't have a whole lot of real-world practicality, it does have the core functionality you'd need when making your own interactive website elements.

* Loading an external SVG file
* Element selection
* Setting element attributes
* Binding user events
* Basic animation


## The setup

{% highlight html %}

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.2.0/snap.svg-min.js"></script>

<script type="application/javascript">

// This is the Snap.svg object, It's an existing node in our DOM.
var s1 = Snap("#svg");

// this is where the main body of our code will go, for the rest of
// the tutorial I'll just display the code that goes here.

</script>
<svg id="svg"></svg>
{% endhighlight %}

Here we just load the required Snap library and create a new Snap object. I am also loading jQuery, however this isn't required, I am just lazy and am using it for brevity.


## Loading...

{% highlight javascript %}

var s1 = Snap("#svg");
Snap.load("/img/mario.svg", function(f) {
    // #mario is a layer group node within the SVG file
    // this contains all of the svg elements we want to load.
    var layer0 = f.select("#mario");

    s1.append(layer0);
});
{% endhighlight %}

The function `Snap.load(FILENAME, CALLBACK)` loads the `FILENAME` and passes it to the `CALLBACK` function as a Snap object. We then use the Snap selector `select(SELECTOR)` to grab the group with the `ID` **mario**. `s1.append(layer0);` adds the mario group to the `<SVG>` tag in the DOM. We get the following.

<hr>
<div class="inline">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.2.0/snap.svg-min.js"></script>

    <script type="application/javascript">
        $(function() {
            var s1 = Snap("#svg1");

            Snap.load("/img/mario.svg", function(f) {
                var layer0 = f.select("#mario");

                s1.append(layer0);
            });

        });
    </script>
    <svg id="svg1" viewBox="0 0 640 640" preserveAspectRatio="xMinYMin meet"></svg>
</div>
<hr>



## Please select player

{% highlight javascript %}
var layer0 = f.select("#mario");

$.each(layer0.selectAll("rect").items, function() {
    this.attr({
        origX:  this.attr('x'),
        origY:  this.attr('y'),
    });

});

{% endhighlight %}

We use the `selectAll()` function on our loaded layer to find all the `RECT` objects (all the "pixels" in the [source SVG] are `RECT` nodes.) We can set some attributes on these nodes using the `attr()` function.

Here we are also setting some attributes (`origX/Y`) that we'll use when we apply animation.



## It's dangerous to go alone

{% highlight javascript %}
$.each(layer0.selectAll("rect").items, function() {

    this.attr({
       origX:  this.attr('x'),
       origY:  this.attr('y'),
    });

    this.click(function() {
        alert('The RECT with the ID: "' + this.attr('id') + '", has the style attributes "' + this.attr('style') + '"');
    });
});

{% endhighlight %}

What we've done here is bind a click event to each of the pixels which will pop up a javascript alert and display the ID and `style=""` attributes for that node. Try clicking on the pixels below.


<hr>
<div class="inline">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.2.0/snap.svg-min.js"></script>

    <script type="application/javascript">
        $(function() {
            var s1 = Snap("#svg2");
            Snap.load("/img/mario.svg", function(f) {
                var layer0 = f.select("#mario");
                var original_size = 40;
                var hover_size = 24;
                var animation_time = 250;

                $.each(layer0.selectAll("rect").items, function() {

                    this.attr({
                       origX:  this.attr('x'),
                       origY:  this.attr('y'),
                    });

                    this.click(function() {
                        alert('The RECT with the ID: "' + this.attr('id') + '", has the style attributes "' + this.attr('style') + '"');
                    });
                });

                s1.append(layer0);
            });

        });
    </script>
    <svg id="svg2" viewBox="0 0 640 640" preserveAspectRatio="xMinYMin meet"></svg>
</div>
<hr>


## Da da daa da daa DA! (huh?!?)

{% highlight javascript %}

var s1 = Snap("#svg");
Snap.load("/img/mario.svg", function(f) {
var layer0 = f.select("#mario");
var original_size = 40;
var hover_size = 24;
var animation_time = 250;

$.each(layer0.selectAll("rect").items, function() {

    this.attr({
       origX:  this.attr('x'),
       origY:  this.attr('y'),
       modX:  parseInt(this.attr('x')) + ((original_size-hover_size)/2),
       modY:  parseInt(this.attr('y')) + ((original_size-hover_size)/2)
    });

    this.mouseover(function() {
        this.animate({
            x: parseInt(this.attr('modX')),
            y: parseInt(this.attr('modY')),
            width: hover_size,
            height: hover_size
        }, animation_time, mina.bounce);
    }).mouseout(function() {
        this.stop();
        this.animate({
            x: parseInt(this.attr('origX')),
            y: parseInt(this.attr('origY')),
            width: original_size,
            height: original_size
        }, animation_time*5, mina.bounce);
    }).click(function() {
        alert('The RECT with the ID: "' + this.attr('id') + '", has the style attributes "' + this.attr('style') + '"');
    });
});
s1.append(layer0);
{% endhighlight %}


Here we've set some variables, `hover_size`, `original_size`  and `animation_time`. We also set some attributes `modX/Y` which are the X and Y co-ords of where we want each pixel to animate to on `mouseover`. `origX/Y` are the original X and Y co-ords. We store this so that we have the values to animate backwards after `mouseout`.

The function `animate()` takes an object of attributes we want to animate, the length of the animation and finally the easing method. Snap uses [mina], and there are half a dozen or so easing methods. They all have their time and place.

Once we run all this we get our original Mario interactive.

<hr>
<div class="inline">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.2.0/snap.svg-min.js"></script>

    <script type="application/javascript">
        $(function() {
            var s1 = Snap("#svg3");
            Snap.load("/img/mario.svg", function(f) {
                var layer0 = f.select("#mario");
                var original_size = 40;
                var hover_size = 24;
                var animation_time = 250;

                $.each(layer0.selectAll("rect").items, function() {
                    this.attr({
                       origX:  this.attr('x'),
                       origY:  this.attr('y'),
                       modX:  parseInt(this.attr('x')) + ((original_size-hover_size)/2),
                       modY:  parseInt(this.attr('y')) + ((original_size-hover_size)/2)
                    });

                    this.mouseover(function() {
                        this.animate({
                            x: parseInt(this.attr('modX')),
                            y: parseInt(this.attr('modY')),
                            width: hover_size,
                            height: hover_size
                        }, animation_time, mina.bounce);
                    }).mouseout(function() {
                        this.stop();
                        this.animate({
                            x: parseInt(this.attr('origX')),
                            y: parseInt(this.attr('origY')),
                            width: original_size,
                            height: original_size
                        }, animation_time*5, mina.bounce);
                    }).click(function() {
                        alert('The RECT with the ID: "' + this.attr('id') + '", has the style attributes "' + this.attr('style') + '"');
                    });
                });

                s1.append(layer0);
            });

        });
    </script>
    <svg id="svg3" viewBox="0 0 640 640" preserveAspectRatio="xMinYMin meet"></svg>
</div>
<hr>


## Our princess is in another castle

As stated earlier, this interactive doesn't really have a lot of practicality, but hopefully from the info I've provided you will be able to imagine useful and unique interactive elements to embed into your websites. The examples provided should illustrate to you the basics of what you can do with Snap.svg.

If you have any questions, or want me to cover any particular section in depth. Leave a comment below and I'll do my best.

You can download the sourcecode for the interactive here [example.tar.gz]






[website]: http://snapsvg.io/
[source SVG]: /img/mario.svg
[svg]: https://en.wikipedia.org/wiki/Scalable_Vector_Graphics
[Raphael]: http://raphaeljs.com/
[mina]: http://snapsvg.io/docs/#mina
[example.tar.gz]: /img/example.tar.gz