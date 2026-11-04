#!/usr/bin/env bash
# Vercel "Ignored Build Step": exit 0 skips the build, exit 1 builds.
# Build only when the site, the skills it lists, or the plugin manifest changed.
# Runs from the project Root Directory (site/).
if ! git rev-parse --verify --quiet HEAD^ >/dev/null; then
  exit 1
fi
git diff --quiet HEAD^ HEAD -- . ../skills ../.claude-plugin
