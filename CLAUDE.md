# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Hugo, a static site generator written in Go. The blog uses the "hugo-theme-water" theme and focuses on technology leadership and engineering topics.

## Common Commands

### Development
- `./build.sh server` - Start Hugo development server with draft posts included
- `hugo server --buildDrafts` - Alternative development server command

### Building
- `./build.sh build` - Build the static website for production (excludes drafts)
- `hugo --baseURL https://nathanharkenrider.com` - Direct Hugo build command

### Deployment
- `./build.sh deploy` - Build and deploy the website to AWS S3 with CloudFront invalidation

## Project Structure

### Content Management
- `content/posts/` - Blog posts in Markdown format, organized in subdirectories
- Each post is in its own directory with an `index.md` file
- Posts use Hugo front matter with fields: title, description, date, hidden, comments, tags

### Theme and Layout
- `themes/hugo-theme-water/` - Custom Hugo theme
- `layouts/` - Theme templates using Go template syntax
- `static/` - Static assets (CSS, images, etc.)
- `config.toml` - Hugo configuration with site metadata, menu structure, and theme settings

### Infrastructure
- `build.sh` - Main build script with commands for local development and AWS deployment
- `buildspec.yml` - AWS CodeBuild specification for CI/CD
- Uses S3 for hosting and CloudFront for CDN
- Supports both production and dev environments

## Architecture Notes

### Hugo Configuration
- Site uses TOML configuration format in `config.toml`
- Theme configuration includes custom menu structure and social links
- Author information and site description are centrally configured

### Deployment Pipeline
- Production site builds from `master` branch
- Dev environment builds from `dev` branch  
- Automated deployment to S3 with CloudFront cache invalidation
- Infrastructure managed with Terraform/Terragrunt (code not in this repo)

### Content Structure
- Posts support tags for categorization
- Each post directory can contain additional assets
- Hugo processes Markdown with front matter to generate static HTML

## Environment Variables for Deployment
- `S3_BUCKET_NAME` - Target S3 bucket (defaults to nathanharkenrider.com)
- `BASE_URL` - Site base URL (defaults to https://nathanharkenrider.com)
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution for cache invalidation
- `HUGO_VERSION` - Hugo version for AWS CodeBuild