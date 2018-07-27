# setting up kubectl
# based on https://coreos.com/tectonic/docs/latest/tutorials/kubernetes/configure-kubectl.html
curl -O https://storage.googleapis.com/kubernetes-release/release/v1.8.4/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl