#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

# demand an environment be selected
if [[ -z $1 ]]; then
    echo need folder name
    echo
    echo options are:
    ls -1d ./infra/k8s/secrets/*/ | xargs -L1 basename | xargs -L1 echo "- $1"
    exit
fi

folder_name=$1
folder_target=$2

# where to configure environment variables from
ENV_SOURCE=infra/k8s/secrets/$folder_name/source.env

# load the environment variables
source $ENV_SOURCE

# find all `.template.` files`
ALL_INFRA_TEMPLATES=`find $2 | grep '\.template'`

for file in $ALL_INFRA_TEMPLATES; do
    # generate the copy target file by dropping the `.template.`
    target_file=$(sed 's/\.template//' <<< $file)

    # skip files that are themselves - otherwise we end up with empty files and sadness
    if [[ $file == $target_file ]]; then
        echo skipping $file
        continue;
    fi

    # the actual substitution
    echo $file + ENV = $target_file
    cat $file | envsubst > $target_file
done