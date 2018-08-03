#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

# initialize terraform
npm run terraform -- init infra/terraform/clusters
exit
npm run terraform -- plan
npm run terraform -- apply