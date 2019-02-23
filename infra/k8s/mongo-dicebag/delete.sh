#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

eval `./infra/terraform/scripts/kubeconfig-path.sh`;

helm del rollem-dicebag --purge