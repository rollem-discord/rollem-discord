# from https://typhoon.psdn.io/cl/digital-ocean/
provider "digitalocean" {
  version = "0.1.3"
  token = "${chomp(file("~/.config/digital-ocean/token"))}"
  alias = "default"
}

provider "local" {
  version = "~> 1.0"
  alias = "default"
}

provider "null" {
  version = "~> 1.0"
  alias = "default"
}

provider "template" {
  version = "~> 1.0"
  alias = "default"
}

provider "tls" {
  version = "~> 1.0"
  alias = "default"
}