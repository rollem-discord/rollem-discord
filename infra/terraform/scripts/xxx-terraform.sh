#! /bin/bash

cd "${0%/*}/../../.." || exit

infra/terraform/scripts/xxx-bash-docker-windows-proxy.sh run -it -v `pwd`/infra/terraform/clusters:/app/ -w /app/ hashicorp/terraform:light $@