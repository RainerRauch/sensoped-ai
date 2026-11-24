# SENSOPED AI – Fuß & Bewegungsanalyse

Prototype branch: `sensoped-ai-neuentwicklung`

## Status
- Guided examination workflow and report draft.
- Worker routes: transcription, text interpretation and image-based footprint support.
- AI outputs are assistance drafts only and must be reviewed by a qualified practitioner.
- **Do not enter real patient data in this prototype.** Storage and privacy safeguards are not production-ready.

## Worker deployment
The GitHub Actions workflow `.github/workflows/deploy-worker.yml` deploys `worker.js` when changes are pushed to this branch.

Required repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

In Cloudflare Worker settings, configure the secret:
- `OPENAI_API_KEY`

Optional Worker variable:
- `ALLOWED_ORIGIN`: the exact deployed website origin (e.g. your GitHub Pages origin). If unset, the Worker currently allows any origin; setting this is recommended.

After a successful deployment, copy the Worker URL into the AI endpoint field in the app, with `/interpret` appended for interpretation requests.

## Deployment and validation
- Worker deployment has not yet been live-tested.
- The GitHub Pages preview workflow is manual (`workflow_dispatch`) and builds this branch's React/Vite app.
- Review the Actions tab for successful build/deployment runs before testing.

## Safety / limitations
- Not a diagnostic device.
- AI findings, recommendations and generated reports require professional review.
- Prototype does not yet provide compliant medical-data storage, access control, audit logging, consent management, or comprehensive security protections.
