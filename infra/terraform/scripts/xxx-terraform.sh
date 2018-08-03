#! /bin/bash

cd "${0%/*}/../../.." || exit

# Why. Just why. Utter nonsense.
# https://github.com/docker/toolbox/issues/673
export MSYS_NO_PATHCONV=1

infra/terraform/scripts/xxx-bash-docker-windows-proxy.sh \
    run -it \
    -v `pwd`/infra/terraform/clusters:/app/ \
    -w /app/ \
    hashicorp/terraform:light $@