#!/usr/bin/env bash

set -e

for file in `find ./public/assets/images -type f -name '*.jpg' -o -name '*.jpeg' -o -name '*.png'`; do
  cwebp -q "100" $file -o "$file.webp"
done

echo "Done - images converted"
