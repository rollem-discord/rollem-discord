#!/bin/bash

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

chmod 400 ~/.ssh/id_rsa

# this public cert must be added int Digital Ocean settings->security
cat ~/.ssh/id_rsa.pub > .config/digital-ocean/id_rsa.pub

# this thumbprint must be updated in ~/.infra/terraform/clusters/digital-ocean-nemo.tf
ssh-keygen -E md5 -lf ~/.ssh/id_rsa.pub | awk '{print $2}'
ssh-keygen -E md5 -lf ~/.ssh/id_rsa.pub | awk '{print $2}' | sed s/md5://i > ~/.config/digital-ocean/id_rsa.pub.fingerprint

# add our ssh key to the ssh agent https://stackoverflow.com/questions/17846529/could-not-open-a-connection-to-your-authentication-agent?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
# TODO: This can probably be automated
eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa
ssh-add -L