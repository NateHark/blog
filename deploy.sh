#!/usr/bin/env bash

echo "Deploying to S3..."
aws --profile blog-publisher --delete s3 sync public/ s3://www.nathanharkenrider.com
