#!/usr/bin/env bash

# Set environment variables if available
if [[ -f set-env-vars.sh ]]; then
    source set-env-vars.sh
fi

echo "Deploying to S3..."
aws --profile blog-publisher s3 sync --delete --cache-control "max-age=2592000" public/ s3://www.nathanharkenrider.com

echo "Invalidating Cloudfront distribution..."
aws --profile blog-publisher cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths /\*
