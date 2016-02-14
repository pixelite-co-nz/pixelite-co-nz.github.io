---
layout: post
title: Backing up content via email to GMail
header-img: "img/post-bg-02.jpg"
subtitle: "Make use of all that storage"
permalink: /article/backing-content-email-gmail/
permalink-disqus: /article/backing-content-email-gmail
author: "Craig Pearson"
categories:
- tutorial
tags:
- mysql
- backup
- gmail
- bash
---

I have recently migrated my hosting backups to Amazon S3, it's cheep, reliable and, well... why not.

In the past I had some little scripts that I used to use to back up some items on my personal hosting server. I thought, that since I was retiring them, that I'd share with you.

<p>They are simple scripts that allow you to back up file systems and database dumps to your GMail account. Great if you want a backup and perhaps don't have the funds or time to use a proper backup solution.</p><p>Now obviously these really only works for small datasets, and you are limited to whatever email sizes GMail allow you to send. Currently (at the time of this writing) I believe you can send 20Mb emails with GMail.</p><p>First up install <a href="http://www.mutt.org/" target="_blank">Mutt</a>, this enables us to attach files from the command line.</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">sudo apt-get install mutt
</pre>
<h3>MySQL Backup Script</h3><p>This simple script will take a MySQL database dump gzip it up and email it to you. Ensure you change the settings at the top. Specifically for Password, and Email.</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">#!/bin/bash

MYUSER='backup'
MYHOST='localhost'
MYPASS='[PASSWORD]'
MYPATH=/tmp
MYFILE=${MYPATH}"/mysqlbackup-"`/bin/date +%Y%m%d`".sql.gz"
MYMAIL=[GOOGLEUSER]+backup at gmail.com
SUBJECT="MySQL backup from "`/bin/hostname`
BODY="Backup file attched"

# create database dump gzip
/usr/bin/mysqldump -u ${MYUSER} -p"${MYPASS}" -h ${MYHOST} --all-databases \
  | /bin/gzip &gt; ${MYFILE}

# mail gzip file to me
/bin/echo ${BODY} | /usr/bin/mutt -s ${SUBJECT} -a ${MYFILE} -- ${MYMAIL}

# delete gzip file
/bin/rm ${MYFILE}
</pre>
<h3>File backup script</h3><p>This script is a little bit different from the MySQL one. It, will tar up a bzip2 archive and compare it with the archive it last run. Only if the two archives differ will it send the email with the backup file. If the archives are the same (ie they haven't changed) then it exits. Remember to change the GOOGLE Account and the path to archive.</p>
<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: true; codetag">#!/bin/bash

#
# this script will tar.bz2 up a directory and then diff this file with
# an archived copy, if the copy differs from the archived one it will
# replace it and email it to the email address, if the archive hasn't
# changed it does nothing.
#

# path to backup
PATHTOARCHIVE=/the/path/i/want/to/backup

# temp directory
TMPPATH=/tmp

# temp file
TMPFILE=${TMPPATH}"/data.tar.bz2"

# path to store archive
MYPATH=/var/cache/backups

# file to become archive
MYFILE=${MYPATH}"/data.tar.bz2"

# email to mail to
MYMAIL=[GOOGLEACCOUNT]+backup at gmail.com

# mail subject
SUBJECT="Backup from "`/bin/hostname`

# mail body
BODY="Backup file attched"
# tmp files
ORIGINAL="0"
NEW="1"

# md5 original file (if exists)
if [ -f ${MYFILE} ]
then
        ORIGINAL=`/usr/bin/md5sum ${MYFILE} | /usr/bin/awk '{ print $1 }'`
fi

# tar up svn
/bin/tar -jcf ${TMPFILE} ${PATHTOARCHIVE} &gt; /dev/null 2&gt;&amp;1

# md5 backup
if [ -f ${TMPFILE} ]
then
        NEW=`/usr/bin/md5sum ${TMPFILE} | /usr/bin/awk '{ print $1 }'`
fi

# diff file with local backup
if [ "$ORIGINAL" = "$NEW" ]
then
# the file hasn't changed

        # remove temp file
        /bin/rm ${TMPFILE}

else
# the file has changed

        # copy to archive dir
        /bin/cp -f ${TMPFILE} ${MYFILE}

        # email file to me
# tmp files
ORIGINAL="0"
NEW="1"

# md5 original file (if exists)
if [ -f ${MYFILE} ]
then
        ORIGINAL=`/usr/bin/md5sum ${MYFILE} | /usr/bin/awk '{ print $1 }'`
fi

# tar up svn
/bin/tar -jcf ${TMPFILE} ${PATHTOARCHIVE} &gt; /dev/null 2&gt;&amp;1

# md5 backup
if [ -f ${TMPFILE} ]
then
        NEW=`/usr/bin/md5sum ${TMPFILE} | /usr/bin/awk '{ print $1 }'`
fi

# diff file with local backup
if [ "$ORIGINAL" = "$NEW" ]
then
# the file hasn't changed

        # remove temp file
        /bin/rm ${TMPFILE}

else
# the file has changed

        # copy to archive dir
        /bin/cp -f ${TMPFILE} ${MYFILE}

        # email file to me
        /bin/echo ${BODY} | \
 /usr/bin/mutt -s ${SUBJECT} -a ${MYFILE} -- ${MYMAIL}

        # remove temp file
        /bin/rm ${TMPFILE}

fi
exit 0
</pre>
<p>I hope these scripts help people out, please note however that these scripts are a quick little hack to make use of your free GMail space and are great if you manage your own site and need some sort of assurance. I provide them to use at your own risk and recommend if you are hosting sites for clients then have a look into some more professional solutions, ie Amazon S3 or other paid services.</p>
