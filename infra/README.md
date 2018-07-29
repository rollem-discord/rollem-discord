# infra = infrastructure
These are all the scripts, configs, snippets, and notes on making Rollem go.

# Secret Setup
1. Replace secrets in `infra/secrets/sample-source.env` (only)
2. Run `infra/add-secrets/` in a bash shell.
  * This will replace all instance of ${ENV_VARIABLE} in template files with the correct value.