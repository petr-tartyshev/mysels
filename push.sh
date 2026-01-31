#!/bin/bash
set -e
cd /Users/petr/sels
git add -A
git commit -m "feat: Add user location creation with map picker" || echo "Nothing to commit"
git push origin main
