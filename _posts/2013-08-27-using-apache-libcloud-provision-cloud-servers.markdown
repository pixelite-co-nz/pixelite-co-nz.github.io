---
layout: post
title: Using apache-libcloud to provision cloud servers
header-img: "img/libcloud/libcloud2.png"
permalink: /article/using-apache-libcloud-provision-cloud-servers/
permalink-disqus: /article/using-apache-libcloud-provision-cloud-servers
author: "Craig Pearson"
categories:
- tutorial
tags:
- python
- aws
- cloud
- servers
- sysadmin
---


[Apache's libcloud](http://libcloud.apache.org/) is a Python library that allows you to write code that interacts with numerous cloud service providers. From the big players like [Amazon AWS](http://aws.amazon.com), [Google](https://cloud.google.com/products/compute-engine) and [Rackspace](http://www.rackspace.com/) to even smaller local providers like the New Zealand based [RimuHosting](http://rimuhosting.com/). A full list of supported providers  can be found [here](https://ci.apache.org/projects/libcloud/docs/supported_providers.html#provider-matrix)

The library is not limited to provisioning servers and supports a bunch of things like load balancing, storage and even DNS but here we'll just focus on cloud server provisioning.

### Installation

I am assuming you are running Ubuntu or another Debian variant. if not check official installation instructions [here](https://ci.apache.org/projects/libcloud/docs/getting_started.html). Normally installation is as easy as:

{% highlight bash %}
sudo apt-get install python-pip
sudo pip install apache-libcloud
{% endhighlight %}


### Getting started

The library is designed to provide a common interface to the different cloud providers, the general process is.

1.  Choose a provider
2.  Request a Driver for that provider
3.  Set credentials
4.  Run operations
5.  Continue or complete

As an example, if I wanted to see the EC2 instance sizes that were available in Sydney I could do the following.

Include the required libraries:

{% highlight python %}
from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver
{% endhighlight %}

Request the AWS EC2 Sydney provider: (remember full list [here](https://ci.apache.org/projects/libcloud/docs/supported_providers.html#compute))

{% highlight python %}
cls = get_driver(Provider.EC2_AP_SOUTHEAST2)
{% endhighlight %}

Set my credentials
{% highlight python %}
driver = cls(AWS_EC2_ACCESS_ID, AWS_EC2_SECRET_KEY)
{% endhighlight %}

Now I can request a list of node sizes

{% highlight python %}
sizes = driver.list_sizes()
for size in sizes:
print size
{% endhighlight %}

**NOTE:** Remember to set the variables **AWS_EC2_ACCESS_ID** and **AWS_EC2_SECRET_KEY** to your API credentials.

The variable **sizes** now contains a list of all the available instance sizes in Sydney. Running that script would output something like so:

{% highlight xml %}
    <NodeSize: id=t1.micro, name=Micro Instance, ram=613 disk=15 bandwidth=None price=0.02 driver=Amazon EC2 (ap-southeast-2) ...>
        <NodeSize: id=m1.small, name=Small Instance, ram=1740 disk=160 bandwidth=None price=0.085 driver=Amazon EC2 (ap-southeast-2) ...>
            <NodeSize: id=m1.medium, name=Medium Instance, ram=3700 disk=410 bandwidth=None price=0.17 driver=Amazon EC2 (ap-southeast-2) ...>
                <NodeSize: id=m1.large, name=Large Instance, ram=7680 disk=850 bandwidth=None price=0.34 driver=Amazon EC2 (ap-southeast-2) ...>
                    <NodeSize: id=m1.xlarge, name=Extra Large Instance, ram=15360 disk=1690 bandwidth=None price=0.68 driver=Amazon EC2 (ap-southeast-2) ...>
                        <NodeSize: id=m2.xlarge, name=High-Memory Extra Large Instance, ram=17510 disk=420 bandwidth=None price=0.506 driver=Amazon EC2 (ap-southeast-2) ...>
                            <NodeSize: id=m2.2xlarge, name=High-Memory Double Extra Large Instance, ram=35021 disk=850 bandwidth=None price=1.012 driver=Amazon EC2 (ap-southeast-2) ...>
                                <NodeSize: id=m2.4xlarge, name=High-Memory Quadruple Extra Large Instance, ram=70042 disk=1690 bandwidth=None price=2.024 driver=Amazon EC2 (ap-southeast-2) ...>
                                    <NodeSize: id=m3.xlarge, name=Extra Large Instance, ram=15360 disk=None bandwidth=None price=0.7 driver=Amazon EC2 (ap-southeast-2) ...>
                                        <NodeSize: id=m3.2xlarge, name=Double Extra Large Instance, ram=30720 disk=None bandwidth=None price=1.4 driver=Amazon EC2 (ap-southeast-2) ...>
                                            <NodeSize: id=c1.medium, name=High-CPU Medium Instance, ram=1740 disk=350 bandwidth=None price=0.186 driver=Amazon EC2 (ap-southeast-2) ...>
                                                <NodeSize: id=c1.xlarge, name=High-CPU Extra Large Instance, ram=7680 disk=1690 bandwidth=None price=0.744 driver=Amazon EC2 (ap-southeast-2) ...>
{% endhighlight %}

Another helpful method is **list_images()** which returns a list of all the OS images that are available for our current driver (in this case just EC2 AMI's in Sydney). Simply adding the following to the bottom of our script and running it again

{% highlight python %}
images = driver.list_images()
for image in images:
print image
{% endhighlight %}

Will output a the size list then a big list of the available node images like following (trimmed)

{% highlight xml %}
    [...]
    <NodeImage: id=ami-ff69fec5, name=979382823631/bitnami-lappstack-5.4.10-0-linux-ubuntu-12.04.1-x86_64-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
        <NodeImage: id=ami-ff70e3c5, name=979382823631/bitnami-redmine-2.3.1-2-linux-ubuntu-12.04.2-x86_64-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
            <NodeImage: id=ami-ff79eac5, name=bitnami-cloud-ap-sydney/plone/bitnami-plone-4.3.1-0-linux-ubuntu-12.04.2-x86_64-s3.manifest.xml, driver=Amazon EC2 (ap-southeast-2)  ...>
                <NodeImage: id=ami-ff7be9c5, name=979382823631/bitnami-reviewboard-1.7.12-1-linux-ubuntu-12.04.2-i386-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
                    <NodeImage: id=ami-ff8314c5, name=979382823631/bitnami-thinkup-1.1.1-0-linux-ubuntu-12.04.1-x86_64-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
                        <NodeImage: id=ami-ff8413c5, name=979382823631/bitnami-enanocms-1.1.8-1-linux-ubuntu-12.04.1-i386-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
                            <NodeImage: id=ami-ff8d1ac5, name=919814621061/percona64-ubuntu1004-ap-southeast-2-1115-20121115131011, driver=Amazon EC2 (ap-southeast-2)  ...>
                                <NodeImage: id=ami-ff9301c5, name=979382823631/bitnami-jenkins-1.524-0-linux-ubuntu-12.04.2-i386-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
                                    <NodeImage: id=ami-ff9407c5, name=979382823631/bitnami-discourse-0.9.2.5-0-linux-ubuntu-12.04.2-i386-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
                                        <NodeImage: id=ami-ffa434c5, name=979382823631/bitnami-redmine-2.3.0-1-linux-ubuntu-12.04.2-x86_64-ebs, driver=Amazon EC2 (ap-southeast-2)  ...>
                                            [...]
{% endhighlight %}

One thing to note, is that these images and sizes are objects we need to pass through to the create methods, so if you know the size of Node you want unfortunately to make the library portable you cant just parse in the ID, you still need to get the **NodeSize** object you are after from the list, for example if you knew you wanted to create a 'm1.small' instance you'd have to do something like this:

{% highlight python %}
MY_SIZE = 'm1.small'
sizes = driver.list_sizes()
size = [s for s in sizes if s.id == MY_SIZE][0]
{% endhighlight %}

Sets the **size** variable to

```
    <NodeSize: id=m1.small, name=Small Instance, ram=1740 disk=160 bandwidth=None price=0.085 driver=Amazon EC2 (ap-southeast-2) ...>
```

The same is true for your host's **NodeImage** so lets update our script from before to specify a **NodeSize** and a **NodeImage**.

For this example I am going to use an AMI for an official Ubuntu Instance image in Sydney. This is for m1.small instances and is available in the Sydney pool of AMI's. **ami-934ddea9**. You can see all the official Ubuntu ones [here](https://help.ubuntu.com/community/EC2StartersGuide#Official_Ubuntu_Cloud_Guest_Amazon_Machine_Images_.28AMIs.29).

{% highlight python %}
from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver

cls = get_driver(Provider.EC2_AP_SOUTHEAST2)
driver = cls(AWS_EC2_ACCESS_ID, AWS_EC2_SECRET_KEY)

MY_SIZE = 'm1.small'
MY_IMAGE = 'ami-934ddea9'

sizes = driver.list_sizes()
images = driver.list_images()

size = [s for s in sizes if s.id == MY_SIZE][0]
image = [i for i in images if i.id == MY_IMAGE][0]

print size
print image

# Outputs
# <NodeSize: id=m1.small, name=Small Instance, ram=1740 disk=160 bandwidth=None price=0.085 driver=Amazon EC2 (ap-southeast-2) ...>
# <NodeImage: id=ami-934ddea9, name=ubuntu-ap-southeast-2/images/ubuntu-precise-12.04-amd64-server-20130624.manifest.xml, driver=Amazon EC2 (ap-southeast-2)  ...>
{% endhighlight %}

Perfect, let's continue.

### Creating an instance

The libcloud library provides a **create_node** method that allows us to provide, a name, NodeSize and NodeImage parameters to fully provision a node. A call to this method could look like so

{% highlight python %}
node = driver.create_node(name="My Instance", image=image, size=size)
{% endhighlight %}

This will create an EC2 instance called **"My Instance"**

Simply adding that line to the bottom of our script will create an Amazon EC2 Instance. See:

<img src="/img/libcloud/aws1.png" width="755" height="120" alt=""  />

But that's not much help, we really want to be able to set up some access (Key Pairs) and ensure that we have at least the SSH port open (Security Groups)

So in the AWS console set up a **Key Pair** and name it **'provision'** and then create a **Security group** called **'ssh_access'** and allow inbound SSH access. We can now update our script like so.

{% highlight python %}
from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver

cls = get_driver(Provider.EC2_AP_SOUTHEAST2)
driver = cls(AWS_EC2_ACCESS_ID, AWS_EC2_SECRET_KEY)

ACCESS_KEY_NAME = 'provision'

SECURITY_GROUP_NAMES = []
SECURITY_GROUP_NAMES.append('ssh_access')

MY_SIZE = 'm1.small'
MY_IMAGE = 'ami-934ddea9'

sizes = driver.list_sizes()
images = driver.list_images()

size = [s for s in sizes if s.id == MY_SIZE][0]
image = [i for i in images if i.id == MY_IMAGE][0]

node = driver.create_node(name="My Instance", image=image, size=size,
ex_keyname=ACCESS_KEY_NAME, ex_securitygroup=SECURITY_GROUP_NAMES)

print node
# outputs
# <Node: uuid=a1acbb69c58dd3936fc34ca070d6d72c029e2354, name=My Instance, state=3, public_ips=[], provider=Amazon EC2 (ap-southeast-2) ...>
{% endhighlight %}

This script will create a EC2 small instance, in Sydney, add the Public key to the authorized_keys file for root, and make sure that port 22 is open for connection.

You can now SSH into your server, check the AWS EC2 console for the publicly assigned DNS name to connect to.

{% highlight bash %}
ssh -l root ec2-54-252-210-134.ap-southeast-2.compute.amazonaws.com
{% endhighlight %}

**NOTE:** since we are running Ubuntu, you can't SSH into the new box as **root** you need to use the user account **ubuntu**. If you do login with **root** you will be instructed about this.

So there we have it. Apache libcloud makes it really easy to provision servers.

There is a whole bunch of additional functionality we haven't covered here. Executing commands on the server during provisioning for installation of software, adding public keys via the library and running other arbitrary shell commands. If you're interested in knowing more feel free to leave a comment.
