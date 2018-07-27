# check out https://typhoon.psdn.io/cl/digital-ocean/#verify
# ./...-terraform-setup must be run first to generate the .secrets directory
# run the following in a Vagrantfile-local shell
vagrant ssh
export KUBECONFIG=/home/vagrant/.secrets/clusters/omen/auth/kubeconfig
kubectl get nodes