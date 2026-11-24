# SENSOPED AI – Fuß & Bewegungsanalyse

Prototype branch: `sensoped-ai-neuentwicklung`

## Status
- Guided examination workflow and report draft.
- Worker routes: transcription, text interpretation and image-based footprint support.
- AI outputs are assistance drafts only and must be reviewed by a qualified practitioner.
- **Do not enter real patient data in this prototype.** Storage and privacy safeguards are not production-ready.

## Worker deployment
Worker deployment is currently not configured via the removed GitHub workflow. `worker.js` is present, but deployment and live testing remain pending.

Required repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

In Cloudflare Worker settings, configure the secret:
- `OPENAI_API_KEY`

Optional Worker variable:
- `ALLOWED_ORIGIN`: the exact deployed website origin (e.g. your GitHub Pages origin). If unset, the Worker currently allows any origin; setting this is recommended.

After a successful deployment, enter the Worker URL in the AI endpoint field in the app, ending in `/interpret`. Use the new **Worker-Verbindung testen** button (the app checks the `/health` route) before requesting an interpretation. This health check only verifies reachability, not API-key validity.

## Deployment and validation
- Worker deployment has not yet been live-tested.
- The `verify-dev.yml` workflow builds the React/Vite app on branch pushes and uploads a preview artifact. A Pages deployment from this development branch is not yet confirmed.
- Review the Actions tab for successful build/deployment runs before testing.

## Safety / limitations
- Not a diagnostic device.
- AI findings, recommendations and generated reports require professional review.
- Prototype does not yet provide compliant medical-data storage, access control, audit logging, consent management, or comprehensive security protections.
