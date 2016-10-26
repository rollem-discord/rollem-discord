# -*- mode: ruby -*-
# vi: set ft=ruby :

# Setup required:
################################################################################
# vagrant plugin install vagrant-reload
################################################################################

# Verify environment
################################################################################
# *cobwebs*
################################################################################

# Configure vagrant
################################################################################
Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/trusty64'

  # config.vm.network :forwarded_port, guest: 80, host: 8080
  config.vm.network 'private_network', ip: '11.11.11.11'

  config.vm.provider 'virtualbox' do |vb|
    vb.memory = '1024'
  end

  config.vm.provision 'docker', run: 'always' do |d|
    # d.build_image '/vagrant/gdevspam', args: '-t gdevspam'
    # d.run 'gdevspam', args: '--name gdevspam'
    # d.run 'rabbitmq'
    # d.run 'app'
  end

  # vagrant plugin install vagrant-reload
  config.vm.provision :reload
end
