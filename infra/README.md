# infra = infrastructure
These are all the scripts, configs, snippets, and notes on making Rollem go.

# Secret Setup
## One-time setup (repeat when updating secrets)
1. Copy `infra/secrets/sample-source/` to `infra/secrets/<your-environment-here>/`
2. Replace the secrets in all the files. Ignore `source.env`.
3. Run `infra/scripts/build-environment-source-files.sh` to update all source files.

## When switching environments
1. (Optional) Run `infra/scripts/add-secrets-to-templates.sh <your-environment-here>`.