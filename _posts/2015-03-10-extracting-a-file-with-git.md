---
layout: post
title: "Extracting a file or a folder from a git repository with full git history"
subtitle: "Simple git commands to save you"
excerpt: "Rather that performing a simple file copy and losing all git history, it is actually quite simple to extract the file or folder with full commit history."
header-img: "img/post-bg-05.jpg"
permalink: /article/extracting-file-folder-from-git-repository-with-full-git-history
author: "Sean Hamlin"
twitter: "@wiifm"
categories:
- tutorial
tags:
- git
- sed
- bash
---

This problem I find comes up several times in your development career. Rather that performing a simple file copy and losing all git history, it is actually quite simple to extract the file or folder with full commit history.

## Create the patch file

This step creates a single file with all the commits that touch the file or folder. The commits are ordered correctly so they will apply perfectly.

    cd ~/repository/path
    git log --pretty=email --patch-with-stat --reverse --full-index --binary -- path/to/file_or_folder > /tmp/patch

## Perform any path replacements as needed

Sometimes you want to alter the path in which your previous repository worked, before importing into your new repository, this can be done with sed (or vim, or any other editor). Note that with sed your must escape the forward slashes.

    sed -i -e 's/deep\/path\/that\/you\/want\/shorter/short\/path/g' /tmp/patch

## Apply the commits to the new repository

For this step you will need to be in the root of another git repository, and from there you can apply the commits. This will apply fine as long as you do not have any files in the current repository with the same name.

    cd ~/another_repository/path
    git am < /tmp/patch

## Comments

Let me know if this helped you, or you have any other git tricks that you have found along the way here.
