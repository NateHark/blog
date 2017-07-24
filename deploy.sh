#!/usr/bin/env bash

COMMIT_MSG=""
UPDATE_THEME=false

if [[ $1 == "-h" ]]; then
    echo "Usage: deploy.sh -g [commit message]"
    exit 0;
fi

if [[ $1 == "-g" ]]; then
    COMMIT_MSG=$2
    UPDATE_THEME=true
else
    COMMIT_MSG=$1
fi

if [[ -z $COMMIT_MSG ]]; then
    echo "You must specify a commit message"
    exit 1
fi

# Update the theme if requested
if [[ "$UPDATE_THEME" = true ]]; then
    echo "Updating theme..."
    pushd ./themes/cocoa-hugo-theme
    git pull
    popd
fi

# Build the site
hugo -t cocoa-hugo-theme

# Commit changes
git commit -a -m "$COMMIT_MSG"
git push

# Deploying
aws --profile blog-publisher --recursive cp public/ s3://www.nathanharkenrider.com

echo "Done!"






