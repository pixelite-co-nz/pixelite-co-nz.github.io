---
layout: post
title: Validate and clean user submitted address data with pygeocoder
header-img: "img/casperjs.jpg"
permalink: /article/validate-and-clean-user-submitted-address-data-pygeocoder
author: "Craig Pearson"
categories:
- tutorial
tags:
- python
- data validation
- geocoding
---

Submitted by thepearson on Tue, 08/20/2013 - 13:49

**Update:** *The method described here uses Google Maps' Geocoding API. The free version of this only allows 2500 lookups per day, I easily ran into this limit during development. The Google Maps for Business API allows 100k requests per day.*

A job I have been doing recently has me regularly importing user submitted postal addresses from a 3rd party website into my clients accounting system. The quality of some of this data is really average. This is mostly due to poor (read zero) validation from the 3rd party website.

If you ever have a requirement to sanitise user data before entering into a system geocoding systems like Google maps can make this process really easy and it's cheap (in most cases it's free) to boot. The Python pygeocoder module is a nice wrapper around such systems to enable easy address validation, here I'll show you how.

First up install **pygeocoder**

    sudo pip install pygeocoder

Now I can validate addresses with a few simple commands, open an interactive console or create a python script and try the following, for the sake of this tutorial I am using the Governor General's house, since it's public and actually has a street address.


    >>> from pygeocoder import Geocoder
    >>>
    >>> address = Geocoder.geocode("1 Rugby Street, Newtown, Wellington 6021, New Zealand")
    >>> print address.valid_address
    True
    >>> print address.country
    New Zealand
    >>> print address.coordinates
    (-41.3068463, 174.7812157)


The library is even tolerant of some spelling errors and omitted data. For example, the following will return the same results.


    >>> from pygeocoder import Geocoder
    >>>
    >>> address = Geocoder.geocode("1 Rugby, Wellingotn")
    >>> print address.valid_address
    True
    >>> print address.formatted_address
    1 Rugby Street, Newtown, Wellington 6021, New Zealand
    >>> print address.coordinates
    (-41.3068463, 174.7812157)


So there you have it, simple, easy address validation and cleansing. Here is a little script you can use to see most of the data returned from the library.


    import sys

    from pygeocoder import Geocoder
    from pygeolib import GeocoderError

    try:
      address = Geocoder.geocode(' '.join(sys.argv[1:]))
    except GeocoderError:
      print "The address entered could not be geocoded"
      sys.exit(1)

    if not address.valid_address:
      print "The address entered is not valid, but we did get some info"

    print "address.valid_address: ", address.valid_address
    print "address.street_number: ", address.street_number
    print "address.route: ", address.route
    print "address.sublocality: ", address.sublocality
    print "address.locality: ", address.locality
    print "address.administrative_area_level_1: ", address.administrative_area_level_1
    print "address.country: ", address.country
    print "address.postal_code: ", address.postal_code
    print "address.coordinates: ", address.coordinates
    print "address.formatted_address: ", address.formatted_address

If you save this script as **geocode.py** you can run it by typing the following:


    python geocode.py "ADDRESS"


On a side note, this doesn't really work for postal addresses like PO Boxes, but if you have a suggestion to get around that then let me know in the comments.


