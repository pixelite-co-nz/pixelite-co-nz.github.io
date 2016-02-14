---
layout: post
title: "Connecting to a private LAN host over the internet via SSH."
header-img: "img/post-bg-03.jpg"
permalink: /article/connecting-private-lan-host-over-internet-ssh/
permalink-disqus: /article/connecting-private-lan-host-over-internet-ssh
author: "Craig Pearson"
categories:
- tutorial
tags:
- linux
- ssh
---

If you've ever worked within Unix or Linux based networks you no doubt would have come across a need to access a server on a LAN or Private network via an intermediate host connected to the internet. Copying files is especially arduous.

<img alt="" class="img-responsive img-thumbnail" src="/img/ssh/ssh_diagram_2.png">

There are a few different ways of achieveing this. I want to share a couple that I reguarly use.

<h3>Method 1: Direct SSH</h3>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">source.host~$ ssh -A www.example.com
www.example.com~$ ssh target.lan
</pre>
<p>This is a simple two command connection, the first command connects you to the server at <strong>www.example.com</strong> then the second command (run on the server listening at <strong>www.example.com</strong>) will connect you to the <strong>target.lan </strong>host. The <strong>-A</strong> flag specifys Agent forwarding which if you are using Public/Private key pairs you won't be prompted for server passwords.</p><p><strong>Pros:</strong></p><ul><li>No additional config</li></ul><p><strong>Cons:</strong></p><ul><li>Two commands</li><li>Can't SCP files directly</li></ul><h3>Method 2: Chained SSH</h3>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">source.host~$ ssh -At www.example.com ssh target.lan
</pre>
<p>This will log you into the <strong>target.lan</strong> server. Again, the <strong>-A</strong> flag is used to specify Agent Forwarding. The <strong>-t</strong> flag forces pseudo-tty allocation. Essentially this means that the connection doesn't close right away after running the second ssh command.</p><p><strong>Pros:</strong></p><ul><li>No additional config</li><li>Single command</li></ul><p><strong>Cons:</strong></p><ul><li>Can't SCP files directly</li></ul><h3>Method 3: ProxyCommand</h3><p>This is by far my preferred method, however it has a few minor prerequisites. First up ensure that <strong>netcat</strong> (nc) is installed on the intermediate host (<strong>www.example.com</strong>). If it's running a recent distro you'll more than likely have it already installed, if not check your repos. Secondly we need to create a <strong>~/.ssh/config</strong> entry. Lets do that now. Open <strong>~/.ssh/config</strong> in your editor of choice, you'll need to add a record like so:</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">Host target.lan
	User thepearson
	HostName target.lan
	ProxyCommand  ssh -l thepearson www.example.com nc %h %p 2&gt; /dev/null
</pre>
<p>Save that file (replacing the example hosts and usernames with your own). The magical part here is the ProxyCommand line. With ssh_config we can use ProxyCommand to specify a command to connect to the server, all occurances of <strong>%h</strong> will be replaced with the target hostname host name and <strong>%p&nbsp;</strong>with target port. When used in conjuction with <strong>netcat</strong> the ProxyCommand config parameter can be very powerful.</p><p>You should now be able to execute the following.</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">source.host~$ ssh target.lan
</pre>
<p>This should give you direct ssh access to the internal server. What's great about this method is that you can use other tools that utilize OpenSSH for connections, for example.</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">source.host~$ scp -r ./local_dir target.lan:~
</pre>
<p>Will recursively copy the local_dir folder to the remote lan host. Cool huh?</p><p><strong>Pros:</strong></p><ul><li>Single command</li><li>Directly SCP files</li></ul><p><strong>Cons:</strong></p><ul><li>Additional config</li><li>Requires netcat on intermediate server</li></ul><p><strong>Note:</strong> I put netcat down as a con, but realistically most (if not all) GNU based boxes will have this installed.</p><p>So there you have it, some simple SSH commands that may make your life easier. Don't forget to check out the man pages for <strong>ssh_config</strong> and <strong>nc&nbsp;</strong>for more details.</p>
