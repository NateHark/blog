#!/usr/bin/env bash

print_usage() {
    echo "usage: $0 COMMAND"
    echo "  Valid commands:"
    echo "  - build: builds the static website (excludes drafts)"
    echo "  - deploy: builds and deploys the static website"
    echo "  - server: runs the local hugo webserver (includes drafts)"
    exit 1
}

build() {
    print_message "Building website..."
    hugo --baseURL $BASE_URL
    print_message "Website build complete"
}

deploy() {
    build
    
    print_message "Syncing content to S3..."
    sync_files
    print_message "Content sync complete"

    print_message "Invalidating CloudFront distribution..."
    invalidate_cloudfront_distribution
    print_message "CloudFront distribution invalidated"
}

invalidate_cloudfront_distribution() {
    if [ -z  $CLOUDFRONT_DISTRIBUTION_ID ]; then
        echo "CLOUDFRONT_DISTRIBUTION_ID not set" >&2
        exit 1
    fi

	aws	cloudfront create-invalidation --no-cli-pager --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths /\* 
}

print_message() {
    printf '_%.0s' {1..80}
    echo ""
    echo "$1..."
    printf '_%.0s' {1..80}
    echo ""
}

server() {
    print_message "Starting Hugo server..."
    hugo --buildDrafts server
}

sync_files() {
    aws s3 sync --delete public s3://${S3_BUCKET_NAME}
}

COMMAND=$1
S3_BUCKET_NAME=nathanharkenrider.com
BASE_URL=https://nathanharkenrider.com

if [ -z $COMMAND ]; then
    print_usage
fi

case "$COMMAND" in  
    "build")  build ;;
    "deploy") deploy ;;
    "server") server ;;
    *) print_usage ;;
esac



