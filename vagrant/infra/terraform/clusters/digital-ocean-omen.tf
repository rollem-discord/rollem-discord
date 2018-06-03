resource "digitalocean_domain" "zone-for-clusters" {
  name       = "digital-ocean.lemtzas.com"

  # Digital Ocean oddly requires an IP here. You may have to delete the A record it makes. :(
  ip_address = "8.8.8.8"
}

module "digital-ocean-omen" {
  source = "git::https://github.com/poseidon/typhoon//digital-ocean/container-linux/kubernetes?ref=v1.10.3"

  providers = {
    digitalocean = "digitalocean.default"
    local = "local.default"
    null = "null.default"
    template = "template.default"
    tls = "tls.default"
  }

  # Digital Ocean
  cluster_name = "omen"
  region       = "sfo2"
  dns_zone     = "digital-ocean.lemtzas.com"

  # configuration
  ssh_fingerprints = ["${chomp(file("~/.config/digital-ocean/id_rsa.pub.fingerprint"))}"]
  asset_dir        = "/home/vagrant/.secrets/clusters/omen"

  # optional
  worker_count = 1
  worker_type  = "s-1vcpu-1gb"
}