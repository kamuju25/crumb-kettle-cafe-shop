#!/usr/bin/env bash
# Usage: BUCKET=my-cafe-site DISTRIBUTION_ID=E123ABC ./deploy/deploy.sh
set -euo pipefail
: "${BUCKET:?Set BUCKET}"; : "${DISTRIBUTION_ID:?Set DISTRIBUTION_ID}"
cd "$(dirname "$0")/.."

# Long cache for static assets, short cache for HTML so updates appear quickly
aws s3 sync . "s3://$BUCKET" --delete \
  --exclude "deploy/*" --exclude "README.md" --exclude "*.html" \
  --cache-control "public,max-age=31536000"
aws s3 sync . "s3://$BUCKET" --exclude "*" --include "*.html" \
  --cache-control "public,max-age=300" --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
