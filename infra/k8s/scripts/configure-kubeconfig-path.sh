#!/bin/bash

KUBECONFIG_PATH=`realpath ~/.kube/rollem-sfo2-kubeconfig.yaml`;
echo ": correct usage:"";"
echo ": eval "\`$0\`";"
echo "export KUBECONFIG="$KUBECONFIG_PATH";"
echo "echo export KUBECONFIG=\"$KUBECONFIG_PATH\""

# kubectl $@