#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

# demand an environment be selected
if [[ -z $1 ]]; then
    echo need folder name
    echo
    echo options are:
    ls -1d ./infra/secrets/*/ | xargs -L1 basename | xargs -L1 echo "- $1"
    exit
fi

secret_name=$1
folder_path=./infra/secrets/$secret_name

echo using secrets for: $secret_name
echo

# build command
from_files_accum=""
for file in $folder_path/*; do
    key=$(basename $file)
    secret=$(<$file)
    if [[ $key == "source.env" ]]; then
        continue
    fi

    echo found key - length ${#secret} - $key
    from_files_accum+=" --from-file=$file"
done

echo
echo "Secret '$secret_name' will be deleted, if it exists."
read -p "Continue? (Enter) - (^C to abort)"
echo
echo "> kubectl delete secret $secret_name"
kubectl delete secret $secret_name

echo
cmd="kubectl create secret generic $secret_name $from_files_accum"
echo > $cmd
$cmd