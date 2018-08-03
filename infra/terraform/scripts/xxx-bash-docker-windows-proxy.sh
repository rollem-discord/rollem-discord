#!/bin/bash
# Why. Just why. Utter nonsense.
# https://github.com/docker/toolbox/issues/673

(export MSYS_NO_PATHCONV=1; "docker.exe" "$@")