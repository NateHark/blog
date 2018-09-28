#!/usr/bin/env bash

THEME_DIR=./theme/coder
UPDATE_THEME=false

if [[ $1 == "-h" ]]; then
    echo "Usage: build.sh [--update-theme]"
    exit 0;
fi

# Update the theme if requested
if [[ $1 == "--update-theme" ]]; then
    echo "Updating theme to the latest version..."
    pushd ${THEME_DIR}
    git pull
    popd
fi

# Build the site
hugo -t coder

echo "Done!"






