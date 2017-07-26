#!/usr/bin/env bash

# Set environment variables if available
if [[ -f set-env-vars.sh ]]; then
    source set-env-vars.sh
fi

echo "Deploying to S3..."
aws --profile blog-publisher --delete s3 sync public/ s3://www.nathanharkenrider.com

echo "Invalidating Cloudfront distribution..."
aws --profile blog-publisher cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths /\*
