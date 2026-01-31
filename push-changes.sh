#!/bin/bash
cd /Users/petr/sels

echo "=== Checking git status ==="
git status

echo ""
echo "=== Adding all changes ==="
git add -A

echo ""
echo "=== Committing changes ==="
git commit -m "feat: Add user location creation with map picker

- Add isPublic and userId fields to Location model
- Add POST /api/locations endpoint with auth check
- Add location creation modal in /profile with map
- Add form fields: name, description, type, address, cost, isPublic toggle
- Update GET /api/locations to filter by isPublic
- Update /map to show only public locations
- Add migration for location isPublic and userId fields"

echo ""
echo "=== Pushing to GitHub ==="
git push origin main

echo ""
echo "=== Done ==="
