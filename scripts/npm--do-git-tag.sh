#!/bin/bash

# TODO: Flags. https://medium.com/@wujido20/handling-flags-in-bash-scripts-4b06b4d0ed04

trap 'echo "Command exited with non-zero status"' ERR
set -e

# find relevant packages
PACKAGE_JSON_LOCATIONS=$(yarn workspaces list --no-private --json | jq --raw-output0 '.location'| xargs -0I {} echo {})

# print versions table
VERSION_NAME_TABLE=$(echo "$PACKAGE_JSON_LOCATIONS" | xargs -I {} bash -c "jq --raw-output0 '.version' ./{}/package.json | xargs -0I $0 echo $0 -- {}" | sort --version-sort --reverse)

# extract versions alone
VERSIONS=$(yarn workspaces list --no-private --json | jq --raw-output0 '.location' | xargs -0I {} bash -c "jq --raw-output0 '.version' ./{}/package.json | xargs -0I $0 echo $0")
UNIQ_VERSIONS=$(echo "$VERSIONS" | uniq)
UNIQ_VERSIONS_COUNT=$(echo "$UNIQ_VERSIONS" | wc -l)

echo
echo VERSIONS
echo "$VERSION_NAME_TABLE"
echo
echo UNIQUE VERSIONS
echo "$UNIQ_VERSIONS"
echo "$UNIQ_VERSIONS_COUNT total"
if [[ $UNIQ_VERSIONS_COUNT -ne 1 ]] ; then
  echo "TOO MANY VERSIONS"
  exit 1
fi

echo
echo "APPLYING GIT TAG"
GIT_TAG="v$UNIQ_VERSIONS"
echo "$GIT_TAG"
echo

trap 'echo "Pending git changes dected. They must be committed or stashed "' ERR
git update-index --refresh &>/dev/null
git diff-index --quiet HEAD --

trap 'echo "Command exited with non-zero status"' ERR
echo "git tag -a \"$GIT_TAG\" -m \"Tagging release $GIT_TAG\""
git tag -a "$GIT_TAG" -m "Tagging release $GIT_TAG"

echo
echo "PUSHING TAGS TO REPO"
echo "git push --follow-tags"
git push --follow-tags

echo
echo "FIN"