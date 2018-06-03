# This provisions a VM that can manage the kubernetes swarm in Digital Ocean
# To start using on Windows:
# - Install chocolatey https://chocolatey.org/
# - Start an elevated prompt (Bash run as administrator is fine)
# - `choco install vagrant`
# - `choco install virtualbox`
# - close elevated prompt
# - open regular prompt in this window
# - `vagrant up`
# - `vagrant ssh`
# - Some secrets will need to be populated in the ./vagrant/.config directory

Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/xenial64'

  config.vm.provider 'virtualbox' do |vb|
    vb.memory = '1024'
  end

  # Install terraform
  config.vm.provision "initialize", type: "shell", privileged: false, path: "vagrant/provision/000-initialize.sh"
  config.vm.provision "setup terraform", type: "shell", privileged: false, path: "vagrant/provision/001-terraform.sh"
  config.vm.provision "setup terraform ct provider", type: "shell", privileged: false, path: "vagrant/provision/002-terraform-provider-ct.sh"
  config.vm.provision "sync .terraformrc", type: "file", run: :always, source: "vagrant/.terraformrc", destination: "/home/vagrant/.terraformrc"
  config.vm.synced_folder "vagrant/.config", "/home/vagrant/.config"
  config.vm.synced_folder "vagrant/infra", "/home/vagrant/infra"
end
