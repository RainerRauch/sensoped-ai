# Worker – Deployment und Verbindungstest

## Voraussetzungen
- Cloudflare-Account mit Workers-Zugriff
- OpenAI API-Key (nur als Cloudflare Secret, nicht in GitHub/App)
- Preview-Origin aus Vercel

## Deployment
Im Repository/Branch `sensoped-ai-neuentwicklung`:

```bash
npm install
npx wrangler deploy
```

Wenn Wrangler eine Anmeldung benötigt, lokal über `npx wrangler login` anmelden. Der Workername und die Datei werden durch `wrangler.toml` definiert.

## Worker Secrets / Variablen
Im Cloudflare Dashboard beim Worker `sensoped-ai-analysis`:
- Secret: `OPENAI_API_KEY`
- Variable: `ALLOWED_ORIGIN` = exakte Origin der aktuell verwendeten App (nur Schema, Host und ggf. Port; kein Pfad)

Die Origin muss exakt zum verwendeten Preview-Host passen. Bei einem neuen Preview-Host kann die Origin-Einstellung angepasst werden. CORS ist keine Authentifizierung.

## Tests
1. `https://<worker-host>/health` öffnen. Erwartet: JSON mit `status: ok`.
2. Worker-URL mit Endung `/interpret` in der App eintragen.
3. In der App `Worker-Verbindung testen` drücken. Das prüft nur /health, nicht den API-Key.
4. Mit künstlichen Befunddaten eine Interpretation testen.
5. Bild-/Audiofunktionen nur mit Testdaten prüfen.
6. Keine echten Patientendaten verwenden.

## Vor produktivem Einsatz
Der Worker ist derzeit nicht durch Nutzer-Authentifizierung, Rollen, Quoten oder eine umfassende Missbrauchsschutz-Schicht abgesichert. Origin-Check allein schützt nicht vor direkten Requests. Diese Sicherheitsmaßnahmen sowie Datenschutz-/klinische Prüfung müssen vor einem realen Einsatz ergänzt werden.
