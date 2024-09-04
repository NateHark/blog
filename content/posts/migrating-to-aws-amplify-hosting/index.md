+++
title = "Migrating to AWS Amplify Hosting"
date = 2023-06-12T21:34:13-07:00
description = "How I simplified the hosting of this website using AWS Amplify."
tags = ["AWS"]
+++

It has been well over a year since I wrote about the [excessive infrastructure powering this blog]({{< relref "posts/the-excessive-infrastructure-powering-this-blog/index.md" >}}), 
and recent changes have prompted an update.

While this blog remains a static website built with [Hugo](https://gohugo.io), and the underlying infrastructure is largely the same, the overall configuration has become much more streamlined 
thanks to [AWS Amplify hosting](https://aws.amazon.com/amplify/). Previously, I had to use a combination of CloudFront, S3, ACM, Lambda, CodePipeline, and Route53 to host both the "dev" and 
production versions of this site with automated deployment and TLS. With Amplify, I can now fulfill all these requirements conveniently. It allows me to host this site with different versions 
on unique subdomains that are mapped to distinct branches in the source repository. Furthermore, each deployment supports TLS using ACM, eliminating the need to worry about Let's Encrypt 
certificate renewals. Deployments are fully automated, requiring only a push of new code to this site's source repository on Github. Within a minute or two, the changes are deployed.

As someone who generally appreciates a high degree of control, relying so heavily on Amplify's "magic" is a bit uncomfortable. However, it certainly outweighs the complexity of maintaining 
all the necessary components on my own. I will provide an update if I encounter any unexpected difficulties, but so far, everything has been running smoothly.
