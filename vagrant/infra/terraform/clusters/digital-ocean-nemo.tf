module "digital-ocean-nemo" {
  source = "git::https://github.com/poseidon/typhoon//digital-ocean/container-linux/kubernetes?ref=v1.10.3"

  providers = {
    digitalocean = "digitalocean.default"
    local = "local.default"
    null = "null.default"
    template = "template.default"
    tls = "tls.default"
  }

  # Digital Ocean
  cluster_name = "nemo"
  region       = "sfo1"
  dns_zone     = "digital-ocean.lemtzas.com"

  # configuration
  ssh_fingerprints = ["0b:d9:01:9d:42:78:66:3f:d8:d0:6d:51:e3:0a:2e:41"] # This was generated upon provisioning. Must be replaced.
  asset_dir        = "/home/user/.secrets/clusters/nemo"

  # optional
  worker_count = 1
  worker_type  = "s-1vcpu-1gb"
}