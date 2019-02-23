#!/bin/bash
# based on https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/

# set current working directory to the root folder
cd "${0%/*}/../../.." || exit

# load environment configuration
echo "run eval \`./infra/k8s/scripts/configure-kubeconfig-path.sh\` to manipulate the server"

# setup the user
SERVICE_ACCOUNT_NAME=admin-user
kubectl create -f ./infra/k8s/users/admin-user.yaml
kubectl create -f ./infra/k8s/users/admin-user-role-binding.yaml

# find the secret
SECRET_NAME=$(kubectl -n kube-system get secrets -o name | grep $SERVICE_ACCOUNT_NAME | awk '{print $1}')
TOKEN_LINE=$(kubectl -n kube-system describe secret $SERVICE_ACCOUNT_NAME | grep token: | sed "s/token: //")

# open the browser and dump the secret
echo ""
echo "Use this token to log in:"
echo $TOKEN_LINE
echo $TOKEN_LINE | clip
echo ""
echo "It has been copied to the clipboard"

start http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/

# launch the proxy
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml >/dev/null &>/dev/null
kubectl proxy