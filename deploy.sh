#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

echo 'block-timer.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:squallql/block-timer.git main:gh-pages

cd -