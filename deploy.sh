#!/usr/bin/env bash

# Set environment variables if available
if [[ -f set-env-vars.sh ]]; then
    source set-env-vars.sh
fi

echo "Deploying HTML assets to S3..."
aws --profile blog s3 sync --delete --exclude "css/*" --exclude "img/*" public/ s3://nathanharkenrider.com
echo "Deploying CSS to S3..."
aws --profile blog s3 sync --delete --cache-control "max-age=2592000" public/img/ s3://nathanharkenrider.com/img
echo "Deploying images to S3..."
aws --profile blog s3 sync --delete --cache-control "max-age=2592000" public/css/ s3://nathanharkenrider.com/css

echo "Invalidating Cloudfront distribution..."
aws --profile blog cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths /\*
