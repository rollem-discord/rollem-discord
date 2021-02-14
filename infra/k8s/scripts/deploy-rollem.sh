#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

eval `./infra/terraform/scripts/kubeconfig-path.sh`;

# demand an environment be selected
if [[ -z $1 ]]; then
    echo need folder name
    echo
    echo options are:
    ls -1 ./infra/k8s/rollem/* | xargs -L1 basename | xargs -L1 echo "- $1"
    exit
fi

FILE_NAME=$1

# where to configure environment variables from
ENV_SOURCE=infra/k8s/rollem/$FILE_NAME

# load the environment variables
kubectl create -f $ENV_SOURCE