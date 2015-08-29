---
layout: post
title: "Guzzle for HTTP POST authentication and form submission with Symfony 2.0"
permalink: /article/guzzle-http-post-authentication-and-form-submission-symfony-20
author: "Adam Bramley"
categories:
- tutorial
tags:
- guzzle
- symfony2
- php
- tutorial
- curl
---

I've been helping out a co-worker with a small PHP library he's working on which will eventually automate Drupal Security Advisory emails through to a central drupal "management" site, which knows about all sites that we work on, and automatically create "work requests" and allocate them to people so that we can easily track security vulnerabilities that need fixing! The work request API was missing a vital component - creating a new work request. So that was my job.

## Curl is awesome(ly verbose), but Guzzle is awesomer

I initially implemented this using PHP's curl functions:

*   curl_init()
*   curl_setopt()
*   curl_exec()

Which works nicely, but requires quite a lot of code:

{% highlight php %}
$post_data = array(
  'username' => 'user',
  'password' => 'password',
  'submit' => 'Login',
);
// Initiate a connection with the domain.
$curl_connection = curl_init();
curl_setopt($curl_connection, CURLOPT_URL, 'www.example.com');

// Set curl options.
curl_setopt($curl_connection, CURLOPT_CONNECTTIMEOUT, 3);
curl_setopt($curl_connection, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36");
curl_setopt($curl_connection, CURLOPT_HEADER, 1);
// This is important, it means we get the response as the return var.
curl_setopt($curl_connection, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($curl_connection, CURLOPT_POST, count($post_data));
curl_setopt($curl_connection, CURLOPT_POSTFIELDS, $post_data);

// Execute the curl command
$response = curl_exec($curl_connection);
$info = curl_getinfo($curl_connection);
if (!$response || $info['http_code'] != 200) {
  throw new \Exception("Problem encountered during authentication (HTTP Code" . $info['http_code'] . ") - " . curl_error($curl_connection));
}

// Get the headers and the response.
$response_parts = explode("\r\n\r\n", $response);
$body = array_pop($response_parts);
$headers = array_pop($response_parts);

// Check for Set Cookie headers and save them for later use.
foreach (explode("\n", $headers) as $i => $h) {
  if (substr($h, 0, 10) === "Set-Cookie"){
    preg_match('/^Set\-Cookie: ([A-Za-z]+)=([0-9A-Za-z%]*);/', $h, $matches);

    // Save the cookies somewhere for later use....
  }
}
curl_close($curl_connection);
{% endhighlight %}

Notice after I execute the post I need to then parse the response, get the "Set-Cookie" headers and store those cookies to use in my next post request so I can successfully submit a form.

Now we can use the cookies in the new curl connection and post some data to a form.

{% highlight php %}
$post_data = array(
  'title' => 'My work',
  'description' => 'This is a request created using curl',
  'submit' => 'submit',
);
// Initialise the curl connection
$curl_connection = curl_init();
// Set curl options
curl_setopt($curl_connection, CURLOPT_URL, 'https://www.example.com/create.php');
curl_setopt($curl_connection, CURLOPT_CONNECTTIMEOUT, 30);
// Use the cookie we got from authentication here.
curl_setopt($curl_connection, CURLOPT_HTTPHEADER, array(
  'Cookie: sid=' . $my_cookie,
));
curl_setopt($curl_connection, CURLOPT_USERAGENT,
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36");
curl_setopt($curl_connection, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($curl_connection, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($curl_connection, CURLOPT_POST, count($post_data));
curl_setopt($curl_connection, CURLOPT_POSTFIELDS, $post_data);

// Send the post data.
$result = curl_exec($curl_connection);
curl_close($curl_connection);
{% endhighlight %}

Well...this works but is less than ideal. It's long, boring, and it hurts my eyes.

## Enter Guzzle:

> "Guzzle gives PHP developers complete control over HTTP requests while utilizing HTTP/1.1 best practices. Guzzle's HTTP functionality is a robust framework built on top of the PHP libcurl bindings."

Using the Guzzle HTTP Client and Cookie plugins, I was able to simplify this a lot.

First we set up the Guzzle client and add an empty CookiePlugin object as a "subscriber" on the HTTP Client. For more info on this see the [Guzzle HTTP Client documentation](http://guzzlephp.org/http-client/client.html)


{% highlight php %}
// Add this to allow your app to use Guzzle and the Cookie Plugin.
use Guzzle\Http\Client as GuzzleClient;
use Guzzle\Plugin\Cookie\Cookie;
use Guzzle\Plugin\Cookie\CookiePlugin;
use Guzzle\Plugin\Cookie\CookieJar\ArrayCookieJar;


$httpClient = new GuzzleClient('https://example.com/');
$httpClient->setSslVerification(FALSE);

$cookieJar = new ArrayCookieJar();
// Create a new cookie plugin
$cookiePlugin = new CookiePlugin($cookieJar);
// Add the cookie plugin to the client
$httpClient->addSubscriber($cookiePlugin);
{% endhighlight %}

Now we login.



{% highlight php %}
$post_data = array(
  'username' => $username,
  'password' => $password,
  'submit' => 'Login',
);

// Send a post to the base url
$response = $httpClient->post('', array(), $post_data)->send();
{% endhighlight %}


Notice that the URL provided to the client's post() method is relative. Relative URLs will always merge into the base URL of the client. Guzzle's HTTP Client docs [explain this more](http://guzzlephp.org/http-client/client.html#base-urls)

Guzzle automagically gets the Cookies set from the response and adds them to our client. We literally do nothing else and we can now post data using the same cookies as we got from our login attempt.


{% highlight php %}
$post_data = array(
  'title' => 'My work',
  'description' => 'This is a request created using curl',
  'submit' => 'submit',
);
$response = $http_client->post('/create.php', array(), $post_data)->send();
{% endhighlight %}

How easy was that? Now that I know how to use this library I can see the amazing opportunities with it. Drupal 8 core is utilising this as a replacement to the archaic drupal_http_request, the issue can be seen [here](https://drupal.org/node/1447736), I can't wait to see what other awesome features D8 gets from Symfony!

### References:
* [Guzzle HTTP Client documentation](http://guzzlephp.org/http-client/client.html)
* [Guzzle HTTP Client API](http://guzzlephp.org/api/class-Guzzle.Http.Client.html)
