#!/bin/bash
# Creates a remote corresponding to the passed-in remix name, pulls from it to a
# new local branch, and pushes that branch up to the origin repo

if [ "$1" == "-h" ]; then
  echo "Usage: ensure you're in the Community Git Repo" 
  echo "Then run: `basename $0` REMIX-NAME"
  echo "e.g. `basename $0` splendid-carol"
  exit 0
fi

git remote add $1 https://api.glitch.com/git/$1
git fetch $1 master:$1
git checkout $1
git push origin $1
