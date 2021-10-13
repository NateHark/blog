---
title: "Smartsheet Webhook Callbacks With API Gateway"
date: 2021-10-11T22:48:00-07:00
tags:
- AWS
- Smartsheet
- API
---

I recently had a need to auto-populate the values of drop-down list columns in [Smartsheet](https://www.smartsheet.com) based on a list of values in a "lookup" sheet (this is similar to using named ranges to provide drop-down values in Excel). While there isn't a way to do this with native Smartsheet features, it's rather simple to implement via [Smartsheet's API](https://smartsheet.redoc.ly/) and webhooks. Webhooks require a publicly-accessible callback URL, which can be a bit of a pain if you don't happen to have a server available to host the callback. Since I didn't have a server handy, and wasn't interested in maintaining an EC2 instance for this little project, I thought this would be a good opportunity to explore a serverless approach in AWS.

I ended up using [AWS API Gateway](https://aws.amazon.com/api-gateway/) to host the webhook callback, with a Lambda function providing the webhook business logic. Overall, the implementation was rather straightforward, with much of the complexity coming from the configuration of the required AWS infrastructure. As much as possible, I attempted to follow the recommended practices for security for both the AWS infrastructure in and the interaction with Smartsheet's API, and simplified my code down to a generic example, [smartsheet-webhook](https://github.com/NateHark/smartsheet-webhook) available on GitHub. 

The [README.md](https://github.com/NateHark/smartsheet-webhook/blob/main/README.md) walks through the setup details. The Terraform code in [main.tf](https://github.com/NateHark/smartsheet-webhook/blob/main/main.tf) contains the definition of all AWS resources, and [webhook_callback.py](https://github.com/NateHark/smartsheet-webhook/blob/main/webhook_callback.py) is the Lambda handler for the webhook callback.

Hope this is helpful!