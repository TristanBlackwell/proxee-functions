# Proxee functions

Twilio functions repository containing the necessary functions for handling call-forwarding and text message masking (both inbound and outbound).

## Background

This repository is based on a Twilio functions TypeScript template which allows functions to be written in TS and transpiled at runtime to JS for execution. GitHub Actions back the repository for CI/CD, allowing deployments to be completed on pushes to the `develop` and `main` branches, development and production environments respectively.

---

## GitHub Actions

### Development deploy

[Workflow](./.github/workflows/dev-deploy-serverless.yaml)

**Trigger**

Push to `develop` branch OR _workflow_dispatch_.

**Secrets**

| Name               | Description                                         | Required |
| ------------------ | --------------------------------------------------- | -------- |
| TWILIO_ACCOUNT_SID | Account SID of the Twilio account to deploy to.     | Y        |
| TWILIO_API_KEY     | API Key name used as authentication for deployment. | Y        |
| TWILIO_API_SECRET  | Secret associated to the above Twilio API Key.      | Y        |

This action will take the source code of the repository and attempt a deploymentment to a functions service with a name matching that found in the `package.json`. If an existing service is found then it **will be overwritten** by this deployment. The functions service environment name will be `dev`.

### Production deploy

[Workflow](./.github/workflows/prod-deploy-serverless.yaml)

**Trigger**

Push to `main` branch OR _workflow_dispatch_.

**Secrets**

| Name                         | Description                                                                                                            | Required |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| TWILIO_ACCOUNT_SID           | Account SID of the Twilio account to deploy to.                                                                        | Y        |
| TWILIO_API_KEY               | API Key name used as authentication for deployment.                                                                    | Y        |
| TWILIO_API_SECRET            | Secret associated to the above Twilio API Key.                                                                         | Y        |
| TWILIO_FUNCTIONS_SERVICE_SID | SID of the functions service that should be promoted from dev to prod. Most likely this will be a prior dev deployment | Y        |

This action will attempt to promote an existing functions service, matching the `TWILIO_FUNCTIONS_SERVICE_SID` environment variable. Moving it from a `dev` environment deployed in the dev action to a production environment instead.
