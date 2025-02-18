#!/usr/bin/env bash

set -euo pipefail

mkdir -p dist/

# clean up old build if exist
rm -rf dist/*

# TS Build
npx tsc

# Html template
cp -r src/popup/*.html dist/

# Combine all CSS files from src/components and src/ directories into one style.css file
# Sort files numerically first (if they start with numbers), then alphabetically
cat $(find src/popup/ -name "*.css" | sort -t '/' -k2,2n -k2,2) > dist/styles.css

# ... and include templates for components
content=$(cat $(find src/popup/components -name "*.html" | sort -t '/' -k2,2n -k2,2) | tr -d '\n')
sed -i "s/<!-- __TEMPLATES__ -->/$(echo "$content" | sed 's/[&/\]/\\&/g')/" dist/launchpad-popup.html

# Clean folder for extension
mkdir -p dist_ext/
cp -r dist manifest.json icons dist_ext/
