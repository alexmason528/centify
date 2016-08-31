#!/bin/bash

cd dist && aws s3 cp . s3://staging-my.centify.com/ --exclude "*" --include "*.png" --include "*.js" --include "*.html" --include "*.css" --include "*.svg" --recursive --cache-control 3600
aws cloudfront create-invalidation --distribution-id ES821UED2LALD --paths "/*"
