#!/bin/bash

cd dist && aws s3 cp . s3://staging-my.centify.com/ --exclude "*" --include "*.js" --include "*.html" --include "*.css" --include "*.svg" --recursive

