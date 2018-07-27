# This provisions a VM that can manage the kubernetes swarm in Digital Ocean
# To start using on Windows:
# - Install chocolatey https://chocolatey.org/
# - Start an elevated prompt (Bash run as administrator is fine)
# - `choco install vagrant`
# - `choco install virtualbox`
# - close elevated prompt
# - open regular prompt in this directory
# - `vagrant up`
# - `vagrant ssh`
# - some secrets will need to be populated in the ./vagrant/.config directory
# - look in provision-post for some command samples

Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/xenial64'

  config.vm.provider 'virtualbox' do |vb|
    vb.memory = '1024'
  end

  # Install terraform
  config.vm.provision "initialize", type: "shell", privileged: false, path: "vagrant/provision/000-initialize.sh"
  config.vm.provision "setup terraform", type: "shell", privileged: false, path: "vagrant/provision/001-terraform.sh"
  config.vm.provision "setup terraform ct provider", type: "shell", privileged: false, path: "vagrant/provision/002-terraform-provider-ct.sh"
  config.vm.provision "file", source: "~/.ssh/id_rsa", destination: "~/.ssh/id_rsa"
  config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/id_rsa.pub"
  config.vm.provision "set up terraform ssh", type: "shell", privileged: false, path: "vagrant/provision/003-terraform-ssh.sh"
  config.vm.provision "set up kubectl", type: "shell", privileged: false, path: "vagrant/provision/004-kubectl.sh"
  config.vm.provision "sync .terraformrc", type: "file", run: :always, source: "vagrant/.terraformrc", destination: "/home/vagrant/.terraformrc"
  config.vm.synced_folder "vagrant/.config", "/home/vagrant/.config"
  config.vm.synced_folder "vagrant/infra", "/home/vagrant/infra"

  # check out provision-post/...terraform-setup for more instructions
  # check out https://typhoon.psdn.io/cl/digital-ocean/
end
