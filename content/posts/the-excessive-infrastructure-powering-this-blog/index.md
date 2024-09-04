---
title: "The Excessive Infrastructure Powering This Blog"
description: "This blog is a static website generated with the Hugo static site generator. Simple right? Hosting this blog is another story and involves a surprising amount of infrastructure behind the scenes. Why?"
date: 2022-02-21T09:46:32-08:00
hidden: false
comments: true
tags:
- AWS
- Cloud
- Hugo
---

This blog is a set of static HTML pages powered by the [Hugo](https://gohugo.io) static website generator. Sounds pretty simple right? Well it is, but hosting this blog is another story involving the use of quite a few [AWS](https://aws.amazon.com) services in order to meet my needs.

Some of the complexity is due to my specific requirements for this website, but I think these are reasonable for anyone hosting a static website for personal or business use.
First of all, it is important to me that the site supports HTTPS. With services like [Let's Encrypt](https://letsencrypt.org), it's never been easier or cheaper (you can't beat free) to obtain a certificate. Since Let's Encrypt certificates have a 90 day expiration, the certificate renewal should be automatic. I don't want to have to remember to manually renew the certificates every 90 days.
Second, since I'm going to the trouble to support HTTPS, this should be the only option. Any HTTP request must be automatically redirected to HTTPS. In addition, I want to host the page at the root of my domain [nathanharkenrider.com](https://nathanharkenrider.com) and redirect requests to [www.nathanharkenrider.com](https://www.nathanharkenrider.com) to the root domain. 
Last, I want to have a "dev" environment [dev.nathanharkenrider.com](https://dev.nathanharkenrider.com) where I can test out new themes, hugo upgrades, and infrastructure changes without the risk of breaking the main site. The "dev" site should build off the `dev` branch while the main site builds off of the `master` branch. The entire build and deploy process should be automatic, requiring only that I commit new content to the appropriate branch in Git.

So how is this implemented? To ensure the infrastructure is repeatable, remember the "dev" environment requirement above, all infrastructure is defined using [Terraform](https://www.terraform.io) and [Terragrunt](https://terragrunt.gruntwork.io/). The infrastructure code isn't published publicly but follows the patterns established in my [terragrunt-multi-account-example](https://github.com/NateHark/terragrunt-multi-account-example) repository closely. The "dev" and "prod" instances are defined in completely separate AWS accounts, creating a clean separation of resources and reducing the chance of mistakenly impacting "prod" while doing work in "dev".

The content for the blog is hosted in an [S3](https://aws.amazon.com/s3/) bucket `nathanharkenrider.com`. A second bucket `www.nathanharkenrider.com` is required to handle the www redirect. This bucket is empty but is configured to redirect all requests to the root domain bucket. These buckets are associated with a pair of [CloudFront](https://aws.amazon.com/cloudfront/) distributions. Do I need a content-delivery network for this blog? No, but it is required in order to host the site with a custom domain and TLS certificate.

That brings us to the next challenge. How do I obtain a certificate, where do I store it, and how do I renew it automatically? Storage is the easiest problem to solve as AWS provides a service for this with [Certificate Manager](https://aws.amazon.com/certificate-manager/). Obtaining the certificate to begin with is a bit more challenging. To  accomplish this, I wrote a [Lambda](https://aws.amazon.com/lambda/) function in Python which uses the [Certbot](https://pypi.org/project/certbot/) library, which is a Python interface to Let's Encrypt. Since DNS for `nathanharkenrider.com` is managed in [Route53](https://aws.amazon.com/route53/), the Lambda uses the DNS challenge mechanism provided by Certbot to prove domain ownership and obtain a certificate, which is then saved to Certificate Manager. To ensure the certificate is renewed before expiration, the Lambda is scheduled to be executed every 30 days via [EventBridge](https://aws.amazon.com/eventbridge/).

Now on to the build process. This involves retrieving the blog's source code from Github, converting the Markdown to HTML via Hugo, pushing the output to an S3 bucket, and invalidating the CloudFront distribution which forces it to fetch new content from the bucket. All of this is accomplished with AWS [CodePipeline](https://aws.amazon.com/codepipeline/) which uses CodeStar Connections to fetch the source from Github, and CodeBuild to execute the build process as specified in [`buildspec.yml`](https://github.com/NateHark/blog/blob/master/buildspec.yml).

Is all of this necessary? Absolutely not, but it was an interesting diversion and provided the opportunity to learn a few new things. Fortunately, it looks like DigitalOcean has largely [automated](https://www.digitalocean.com/community/tutorials/how-to-build-and-deploy-a-hugo-site-to-digitalocean-app-platform) most of the process I describe above. Check it out if you're looking for a low-friction alternative for hosting a Hugo static site.

  