#!/usr/bin/env bash
# git-activity.sh — per-path git activity profile for /onex:pick-up-abandoned.
#
# Usage:
#   git-activity.sh [-q QUIET_DAYS] [-b BURST_DAYS] [-s SWEEP_DIRS] PATH [PATH...]
#
#   -q  days without a meaningful commit before a path counts as quiet   (default 60)
#   -b  window after the first commit that counts as the "build burst"    (default 14)
#   -s  a commit touching more than this many directories is a sweep     (default 15)
#
# Prints one TSV row per PATH:
#   path  files  lines  first  last_meaningful  days_quiet  commits  meaningful
#   claude  burst_pct  authors  signal
#
#   meaningful  commits that are not chores (chore/style/ci/build/deps/format/lint,
#               version bumps, merges) and not repo-wide sweeps (a rename, a lint
#               --fix, a dependency upgrade that touched > SWEEP_DIRS directories).
#               A module that only ever receives sweeps is not being worked on.
#   claude      commits whose message carries a Claude Code trailer
#               (Co-Authored-By: Claude, Claude-Session, "Generated with Claude Code").
#   burst_pct   share of all lines ever added to PATH that landed within BURST_DAYS
#               of its first commit. High = built in one sitting.
#   signal      new | active | quiet | burst-then-quiet
#
# Read-only: runs git log / git ls-files only. Portable to macOS bash 3.2 and BSD awk.

set -eu

quiet=60
burst=14
sweep=15

while getopts "q:b:s:h" opt; do
  case "$opt" in
    q) quiet="$OPTARG" ;;
    b) burst="$OPTARG" ;;
    s) sweep="$OPTARG" ;;
    h) sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "usage: $0 [-q days] [-b days] [-s dirs] PATH..." >&2; exit 2 ;;
  esac
done
shift $((OPTIND - 1))

if [ "$#" -eq 0 ]; then
  echo "usage: $0 [-q days] [-b days] [-s dirs] PATH..." >&2
  exit 2
fi

git rev-parse --git-dir >/dev/null 2>&1 || { echo "not a git repository" >&2; exit 2; }
if [ "$(git rev-parse --is-shallow-repository 2>/dev/null || echo false)" = "true" ]; then
  echo "warning: shallow clone — first-commit dates and burst_pct are unreliable. Run: git fetch --unshallow" >&2
fi

now=$(date +%s)
tmp=$(mktemp -d 2>/dev/null || mktemp -d -t gitact)
trap 'rm -rf "$tmp"' EXIT

printf 'path\tfiles\tlines\tfirst\tlast_meaningful\tdays_quiet\tcommits\tmeaningful\tclaude\tburst_pct\tauthors\tsignal\n'

for p in "$@"; do
  files=$(git ls-files -- "$p" | wc -l | tr -d ' ')
  if [ "$files" -eq 0 ]; then
    printf '%s\t0\t0\t-\t-\t-\t0\t0\t0\t-\t0\tuntracked\n' "$p"
    continue
  fi
  lines=$(git ls-files -z -- "$p" | xargs -0 cat 2>/dev/null | wc -l | tr -d ' ')

  # 1. One line per commit: hash, unix time, short date, author, subject.
  git log --format='%H%x09%at%x09%ad%x09%an%x09%s' --date=short -- "$p" > "$tmp/commits"

  # 2. Hashes carrying a Claude Code trailer.
  git log --format='%H' -i -E \
    --grep='Co-Authored-By: Claude' --grep='Claude-Session:' --grep='Generated with \[?Claude Code' \
    -- "$p" > "$tmp/claude"

  # 3. Hashes that are sweeps: the full commit touched more than $sweep directories.
  git log --full-diff --format='@%H' --name-only -- "$p" | awk -v max="$sweep" '
    function flush() { if (h != "" && n > max) print h }
    /^@/ { flush(); h = substr($0, 2); n = 0; delete seen; next }
    NF {
      k = split($0, parts, "/")
      d = (k > 2) ? parts[1] "/" parts[2] : (k == 2 ? parts[1] : ".")
      if (!(d in seen)) { seen[d] = 1; n++ }
    }
    END { flush() }
  ' > "$tmp/sweeps"

  # 4. Lines added per commit time, for the burst share.
  git log --format='@%at' --numstat -- "$p" | awk '
    /^@/ { t = substr($0, 2); next }
    NF >= 3 && $1 ~ /^[0-9]+$/ { print t "\t" $1 }
  ' > "$tmp/added"

  awk -F '\t' \
    -v path="$p" -v files="$files" -v lines="$lines" -v now="$now" \
    -v quiet="$quiet" -v burst="$burst" \
    -v claudef="$tmp/claude" -v sweepf="$tmp/sweeps" -v addedf="$tmp/added" '
    BEGIN {
      while ((getline h < claudef) > 0) claude[h] = 1
      while ((getline h < sweepf) > 0) sweep[h] = 1
      first_t = 0; last_t = 0
    }
    {
      hash = $1; t = $2 + 0; d = $3; who = $4; subj = tolower($5)
      commits++
      if (!(who in authors)) { authors[who] = 1; nauth++ }
      if (hash in claude) nclaude++
      if (first_t == 0 || t < first_t) { first_t = t; first_d = d }
      chore = (subj ~ /^(chore|style|ci|build|deps|format|lint|revert)(\(|:|!)/ \
               || subj ~ /^merge / || subj ~ /bump|prettier|eslint --fix|format(ting)? /)
      if (!chore && !(hash in sweep)) {
        meaningful++
        if (t > last_t) { last_t = t; last_d = d }
      }
    }
    END {
      while ((getline row < addedf) > 0) {
        split(row, f, "\t")
        total += f[2]
        if (f[1] - first_t <= burst * 86400) early += f[2]
      }
      bp = (total > 0) ? int(100 * early / total + 0.5) : 0
      if (meaningful == 0) { last_d = "-"; dq = int((now - first_t) / 86400) }
      else dq = int((now - last_t) / 86400)
      age = int((now - first_t) / 86400)
      if (age < burst) sig = "new"
      else if (dq < quiet) sig = "active"
      else if (bp >= 70) sig = "burst-then-quiet"
      else sig = "quiet"
      printf "%s\t%s\t%s\t%s\t%s\t%d\t%d\t%d\t%d\t%d\t%d\t%s\n", \
        path, files, lines, first_d, last_d, dq, commits, meaningful, nclaude, bp, nauth, sig
    }
  ' "$tmp/commits"
done
