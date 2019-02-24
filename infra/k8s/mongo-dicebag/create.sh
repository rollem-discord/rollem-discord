#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

# load environment configuration
echo "run eval `./infra/terraform/scripts/kubeconfig-path.sh` to manipulate the server"

helm init
helm install stable/mongodb -n rollem-dicebag --namespace rollem -f ./infra/k8s/mongo-dicebag/production-values.yaml