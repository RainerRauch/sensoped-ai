# Worker Deployment über GitHub Actions (Entwicklungszweig)

Workflow-Datei: `.github/workflows/deploy-worker-dev.yml`

## Einmalig im Repository einrichten
GitHub Repository → Settings → Secrets and variables → Actions:

**Repository Secrets**
- `CLOUDFLARE_API_TOKEN`: API token mit minimal erforderlichen Workers Deploy-Berechtigungen für den Account
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

**Repository Variable**
- `SENSOPED_AI_PREVIEW_ORIGIN`: exakte Origin des Vercel-Preview-Hosts (nur `https://...`, ohne Pfad)

## API-Key für OpenAI
Nach Deployment im Cloudflare Dashboard beim Worker `sensoped-ai-analysis` als Secret `OPENAI_API_KEY` eintragen. Nicht in GitHub-Code, Workflow-Logs oder App eingeben.

## Deployment starten
GitHub → Actions → **Deploy SENSOPED AI Worker (development)** → Run workflow. Der Workflow ist manuell und deployed nur den Entwicklungszweig.

## Danach testen
- `/health` am Worker-Host öffnen.
- Worker-URL mit `/interpret` in der App eintragen.
- Verbindungstest in der App ausführen.
- Anschließend ausschließlich künstliche Befunddaten testen.

Der Workflow allein garantiert keine klinische Sicherheit. CORS/Origin ist keine Authentifizierung; vor echten Patientendaten sind Authentifizierung, Datenschutz, Security Review und klinische Validierung erforderlich.
