# the script relies on the host machies id_rsa key
ssh-keygen -f ~/.ssh/id_rsa -t rsa -N ''

# the public key must be authorized with github
cat ~/.ssh/id_rsa.pub > ~/.config/digital-ocean/id_rsa.pub