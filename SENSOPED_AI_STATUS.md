# SENSOPED AI – Kontrollübersicht
Stand: 24. November 2026

## Aktueller Arbeitsstand
- Repository: https://github.com/RainerRauch/sensoped-ai
- Arbeitsbranch: sensoped-ai-neuentwicklung
- App: https://rainerrauch.github.io/sensoped-ai/
- Wiederherstellungsbranch: backup/sensoped-ai-2026-11-24
- Backup-Workflow: .github/workflows/daily-backup.yml

## Bestätigt
- GitHub Actions Build für Commit 9002f1b7cbb2f70fb269d28ada4aa80a978f9c4b erfolgreich (24.11.2026).
- Installieren, Build und Preview-Artefakt hochladen erfolgreich.
- Backup-Workflow im Branch aufgenommen.
- Drei alte Deployment-Workflows entfernt: deploy-preview-pages.yml, deploy-worker.yml und deploy.yml.
- Wiederherstellungsbranch erstellt.

## Noch zu prüfen
- Der tägliche Tag-Backup-Workflow hat noch keinen bestätigten Lauf; Tag-Erstellung und Wiederherstellung müssen getestet werden.
- App vom Nutzer geöffnet, aber nicht vollständig funktional getestet.
- Worker (Transkription, Interpretation, Bildanalyse) nicht live verifiziert.
- Vercel-Verbindung derzeit nicht bestätigt.
- GitHub Pages Deployment-Konfiguration/Branch-Zuordnung genauer prüfen.
- Erste Inventur im Hauptzweig (main): mehrere datierte HTML-Sicherungen und mindestens vier ZIP-Dateien vorhanden; vollständige Inventur noch offen. Nichts löschen.

## Technische Hinweise
- Demo-Daten werden im Browser-/Sitzungsspeicher gehalten. Keine echten Patientendaten verwenden.
- AI-Ausgaben sind Entwürfe und müssen fachlich überprüft werden.
- Datenschutz, Zugriffskontrollen, Auditierung, Einwilligung und Sicherheitsmaßnahmen sind nicht produktionsreif.
- README enthält veraltete Verweise auf den entfernten deploy-worker Workflow.

## Prüfungsfortschritt (24.11.2026)
- Workflow-Dateien erneut geprüft: Daily Backup erzeugt täglich einen Git-Tag auf dem Arbeitsbranch und hat auch manuellen Start (workflow_dispatch).
- Der Backup-Workflow ist technisch plausibel, aber ein erfolgreicher Lauf und ein Restore-Test sind noch nicht bestätigt.
- GitHub Pages Workflow in diesem Branch ist auf main beschränkt; der aktuelle React/Vite-Arbeitsbranch wird damit nicht automatisch veröffentlicht. Die tatsächliche Pages-Zuordnung muss geprüft werden.
- Im main-Zweig sichtbar: mehrere HTML-Sicherungen und ZIP-Dateien; keine Löschung.

## Nächste Schritte
1. Backup-Lauf und Restore-Test.
2. GitHub Pages/Deployment verifizieren.
3. Backups und alte Dateien inventarisieren.
4. App-Funktionen einzeln testen.
5. Worker-Verbindung und API-Funktionen testen.
6. Sicherheits-/Datenschutzprüfung vor klinischer Nutzung.


## Weitere Sicherheitsverbesserung (24.11.2026)
- `worker.js` wurde angepasst: unbekannte POST-Routen werden jetzt ausdrücklich mit 404 abgewiesen statt versehentlich auf die Bildanalyse zu fallen.
- Änderung Commit `7121343936bcb6026130c20c69b841e3290fbb2c`; Build-Workflow nach dieser Änderung noch ausstehend.
- Weitere offene Sicherheitsprüfung: CORS-Origin, Eingabegrößen/Validierung, Datenschutz und Worker/API-Live-Tests.


## GitHub Pages Veröffentlichungsweg angepasst (24.11.2026)
- Workflow `.github/workflows/deploy-pages.yml` auf den Entwicklungsbranch `sensoped-ai-neuentwicklung` umgestellt.
- Workflow baut nun Vite mit `GITHUB_PAGES=true` und veröffentlicht den Inhalt von `dist` statt versehentlich das Repository-Verzeichnis.
- Commit: `3fb59e7ca44422e9f47c39bb51d34f912b6702b9`.
- Die Änderung ist gespeichert; tatsächliche Pages-Bereitstellung und Pages-Konfiguration müssen noch durch einen erfolgreichen Lauf bestätigt werden.


## Audit Fortsetzung – Workflowprüfung (24.11.2026)
- GitHub Actions Lauf `45490029220` für Commit `55f0f3235d23299fd3ae89ed021f7d8ac6677153` ist erfolgreich abgeschlossen. Alle Schritte einschließlich Vite-Build und Upload des Test-Artefakts `sensoped-ai-development-preview` erfolgreich. Das Artefakt ist befristet bis 8.12.2026 verfügbar.
- Das bestätigt den Build des Entwicklungsbranches, nicht automatisch die Live-Veröffentlichung via GitHub Pages oder Vercel.
- Inventar `main`: fünf ältere HTML-Sicherungen und sechs ZIP-Dateien; unverändert, nichts gelöscht.
- Daily-backup Workflow geprüft: täglich 02:00 UTC sowie manuell, erstellt datierte Git-Tags. Tag-Erstellung und Restore sind weiterhin nicht praktisch bestätigt.


## GitHub Pages Fehlersuche (24.11.2026)
- Vite-Build/Preview-Artefakt im Verify-Workflow ist erfolgreich.
- Pages-Deploy-Workflow wurde bei mehreren Commits unmittelbar als `failure` beendet (zuletzt Run `45490188248`, Job `138786115151`). Die Details/Logs waren über die verfügbaren GitHub-Schnittstellen nicht abrufbar.
- Ursache ist daher noch nicht bestätigt. Zu prüfen sind Repository Pages-Konfiguration/Permissions/Environment `github-pages`; nicht als Code-Buildfehler werten.


## Pages-Workflow neu strukturiert (24.11.2026)
- Workflow Commit `84c7fc3f0ae7d177804d6ff3f6c57cecbe4f6f0e`: Build und Deploy nun getrennte Jobs mit explizitem `needs: build`, Upload Pages Artifact v4, Prüfung auf `dist/index.html` und Deploy-Job mit `pages: write`/`id-token: write`.
- Ziel: Deployment-Schritt sauber abgrenzen und Fehler diagnostizierbarer machen. Pages-Einstellung `Settings > Pages > Source = GitHub Actions` muss ggf. vom Repo-Owner geprüft werden; nicht per Repository-API verfügbar über die Verbindung.
