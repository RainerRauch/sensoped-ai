# SENSOPED AI – Fuß & Bewegungsanalyse

Prototype branch: `sensoped-ai-neuentwicklung`

## Status
- Guided examination workflow and report draft.
- Worker routes: transcription, text interpretation and image-based footprint support.
- Worker hardening: exact route matching, findings-object validation, basic payload-size check and separation of system instructions from user-provided finding data.
- AI outputs are assistance drafts only and must be reviewed by a qualified practitioner.
- **Do not enter real patient data in this prototype.** Storage and privacy safeguards are not production-ready.

## Worker deployment
Worker deployment is currently not configured via the removed GitHub workflow. `worker.js` is present, but deployment and live testing remain pending.

Required repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

In Cloudflare Worker settings, configure the secret:
- `OPENAI_API_KEY`

Required Worker variable:
- `ALLOWED_ORIGIN`: the exact deployed website origin (e.g. your GitHub Pages origin), without a path. Browser requests with a different Origin are rejected; browser requests are rejected if this variable is unset.

After a successful deployment, enter the Worker URL in the AI endpoint field in the app, ending in `/interpret`. Use the new **Worker-Verbindung testen** button (the app checks the `/health` route) before requesting an interpretation. This health check only verifies reachability, not API-key validity.

## Deployment and validation
- Worker deployment has not yet been live-tested.
- The `verify-dev.yml` workflow builds the React/Vite app on branch pushes and uploads a preview artifact. A Pages deployment from this development branch is not yet confirmed.
- Review the Actions tab for successful build/deployment runs before testing.

## Safety / limitations
- Not a diagnostic device.
- AI findings, recommendations and generated reports require professional review.
- Prototype does not yet provide compliant medical-data storage, access control, audit logging, consent management, or comprehensive security protections.


## Konkrete Einrichtung (Worker)

1. Cloudflare Dashboard öffnen und einen Worker mit dem Namen `sensoped-ai-analysis` anlegen oder den vorhandenen Worker auswählen.
2. `worker.js` aus diesem Branch als Worker-Code verwenden.
3. Unter Settings / Variables and Secrets das Secret `OPENAI_API_KEY` hinterlegen (niemals in GitHub oder in die App eintragen).
4. Variable `ALLOWED_ORIGIN` auf die exakte Website-Origin setzen, von der die App läuft (ohne Pfad, z. B. `https://example.pages.dev`).
5. Worker veröffentlichen und die URL mit `/health` im Browser prüfen. Erwartet wird eine JSON-Antwort mit `status: ok`.
6. Worker-URL in der App eintragen und Verbindung testen. Anschließend Bildanalyse und Befundinterpretation nur mit Testdaten prüfen.

**Sicherheit:** Browserzugriffe sind nun auf die exakt konfigurierte `ALLOWED_ORIGIN` begrenzt. Fehlt die Variable, werden browser-originierte Requests abgewiesen. Das ist keine Authentifizierung: Vor einem realen Patienteneinsatz muss die gesamte App sicherheits-/datenschutzrechtlich geprüft werden. Der Prototyp ist nicht für echte Patientendaten freigegeben.
