# infra = infrastructure
These are all the scripts, configs, snippets, and notes on making Rollem go.

# Secret Setup
1. Replace secrets in `infra/secrets/sample-source.env` (only)
2. Run `infra/add-secrets-to-templates.sh` in a bash shell.
  * This will copy all `*.template.*` files, replacing all instances of `${ENV_VARIABLE}` with the correct value.