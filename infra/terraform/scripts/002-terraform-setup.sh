#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

# initialize terraform
cd infra/terraform/clusters
npm terraform init
npm terraform plan
npm terraform apply