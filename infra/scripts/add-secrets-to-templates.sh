#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../.."

ENV_SOURCE=infra/secrets/source.env

source $ENV_SOURCE

ALL_INFRA_TEMPLATES=`find infra | grep \.template\.`

for file in $ALL_INFRA_TEMPLATES; do
    target_file=$(sed s/\.template\././ <<< $file)
    echo $file to $target_file
    cat $file | envsubst > $target_file
done