#!/usr/bin/env bash

echo "Deploying to S3..."
aws --profile blog-publisher --recursive sync public/ s3://www.nathanharkenrider.com --delete