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


## Diagnose Pages-Workflow (24.11.2026)
- Pages-Job scheiterte in `actions/setup-node@v4`, vor Installation und Build; die Schritte danach wurden übersprungen. Die Workflow-Konfiguration verwendete `cache: npm`, obwohl kein npm lockfile im Branch vorhanden ist. Cache-Konfiguration entfernt (Commit `56fae26a165f38027d573fb93af0af273bdb248b`). Erneuter Lauf wird durch Commit ausgelöst; noch nicht bestätigt.


## Erneuter Pages-Test nach Cache-Korrektur (24.11.2026)
- Cache-Konfiguration aus `setup-node` entfernt (Commit `56fae26a...`).
- Pages-Build Run `45490476357`: Build-Job erfolgreich, inklusive Installieren, Vite-Build, `dist/index.html`-Prüfung und Upload des Pages-Artefakts.
- Deploy-Job danach weiterhin fehlgeschlagen. Jobdetails abrufbar, vollständige Logs jedoch nicht. Pages-Source-Einstellung `GitHub Actions` bleibt vom Repository-Owner in Settings > Pages zu kontrollieren.
- Verify-Workflow auf Commit `6fa10cb3` hat Build und Upload des Preview-Artefakts erfolgreich abgeschlossen.
- Inventur: zwei Backup-Branches vorhanden (`backup/sensoped-ai-2026-11-24` und `backup-2026-11-24-sensoped-ai`); auf Backup-Branch fünf HTML-Sicherungen und sechs ZIP-Dateien, darunter eine ZIP mit ca. 20,8 MB. Keine Dateien gelöscht oder verändert.


## Backup-Integritätsprüfung ergänzt (24.11.2026)
- Neue Workflow-Datei `.github/workflows/verify-backup.yml` hinzugefügt (Commit `4efca82d`).
- Prüft Sicherungszweige, wichtige App-Dateien und führt einen erneuten npm-Build aus; listet vorhandene Backup-Tags oder weist darauf hin, dass noch keine vorhanden sind.
- Workflow-Lauf ist durch Push ausgelöst; Ergebnis steht noch aus.


## Aktueller Testlauf (24.11.2026, Commit `7890a0bb`)
- Verify-dev Run `45490797266`: erfolgreich; Build und Upload des Preview-Artefakts bestätigt.
- Pages Run `45490797284`: Build-Job erfolgreich (Vite-Build, Output-Prüfung, configure-pages, Upload Pages-Artefakt). Deploy-Job fehlgeschlagen.
- Deploy-Job Logs über GitHub-API-Verbindung nicht abrufbar (404 BlobNotFound). Ursache damit nicht eindeutig belegt.
- Pages-Repository-Einstellung Settings > Pages > Source = GitHub Actions bleibt zu überprüfen. Zugriff auf diese Einstellung hier nicht möglich.
- Verify-backup Run `45490784517`: erfolgreich.


## Entwicklungsupdate 28.11.2026 – Gangstrecke validiert

- Die Eingabe der Gangstrecke wird beim Speichern geprüft: numerisches Format, Bereich 0,1–100 m, Messstatus erforderlich; die Kennzeichnung „10 m“ muss exakt mit 10 m übereinstimmen. Eine abweichende Strecke benötigt einen Zahlenwert und darf nicht als 10 m markiert sein.
- Regressionchecks ergänzt; der aktuelle GitHub-Actions-Build und die Sicherheits-Smoke-Prüfung sind für Commit `5a01d09f` erfolgreich.
- Lokaler Build des aktuellen Branches in einer isolierten Sandbox: 1.572 Module verarbeitet, Build erfolgreich; `npm run test:smoke` meldet 69 bestandene Prüfungen.
- Interaktiver Headless-Test auf 390 × 844 px: 7,5 m mit „10 m“ wird blockiert; 7,5 m mit „abweichende Strecke gemessen“ lässt sich als Demo-Akte speichern; Datenschutz-Reset erfolgreich. Keine JavaScript-Fehler, fehlgeschlagenen Netzwerkrequests oder horizontalen Überläufe in diesem Test.
- **Vercel-Preview für den korrigierten App-Commit ist noch nicht veröffentlicht.** Vercel meldet `api-deployments-free-per-day` (mehr als 100 Deployments/24 h). Der letzte READY-Preview-Stand ist `2d9e5972` und enthält noch nicht die korrigierte Regex; er ist daher nicht für den neuen Gangstrecken-Test geeignet.
- Main bleibt bei `9f1001ad`; keine Zusammenführung, Production oder bestehende Domain verändert.
- Grenzen: Der interaktive Test umfasst gezielt den Gangstrecken-/Speicher-/Reset-Pfad, nicht den vollständigen klinischen Workflow, Kamera oder Live-Worker. Nur fiktive Demo-Daten verwenden; keine klinische Validierung.


## Verifizierungs-Audit 28.11.2026, 03:30 CET
- GitHub-API bestätigt den tatsächlichen Branch-HEAD: `24cad90e70445dabfb977e9ee7713f7362a3ead5` (Commit vom 28.11.2026, 01:28:34 UTC). Der zuletzt auf Vercel veröffentlichte App-Code ist `5e0395b42e8eb0745eb77f66a6de93b90e0ce0c6` (Prototype-Warnung), Deployment `sensoped-ai-ucat`, Zustand READY; Branch-Alias: `https://sensoped-ai-ucat-git-sensoped-ai-neuentwicklung-rainerrauch.vercel.app`. Die direkte HTTP-/Browser-Abfrage konnte in dieser Prüfung nicht bestätigt werden.
- Verify-dev Workflow für HEAD `24cad90`: erfolgreich (Run `46093288264`); Installieren, Vite-Build, Worker-Syntax, Smoke-Checks, Output-Prüfung und Artifact-Upload abgeschlossen. Das Artifact `sensoped-ai-development-preview` ist bis 12.12.2026 verfügbar.
- Verify-backup Run `46093288272`: erfolgreich, Restore in temporäres Verzeichnis und Build der wiederhergestellten Dateien abgeschlossen. Daily-backup Run `46093288298`: erfolgreich; Tag `backup-2026-11-28-24cad90e7044` wurde erstellt.
- Der Branch-Vergleich mit `main` (Commit `9f1001adac6ac17e319479ae8dc55f4abdeae024`) ergibt `diverged`, 375 Commits ahead und 12 behind. Keine Zusammenführung vorgenommen.
- Korrektur der vorherigen Statusangaben: GitHub zeigt aktuell HEAD `24cad90`; frühere in Chatmeldungen genannte SHAs `5a01d09`, `d18c7c46` und mehrere spätere behauptete App-Commits sind in diesem aktuellen Branch-Stand nicht als HEAD bestätigt. Ein lokaler Clone ist in der aktuellen Arbeitsumgebung wegen DNS-Fehler `github.com` nicht möglich; deshalb wird kein neuer lokaler Browser-/E2E-Test behauptet. Das zuletzt dokumentierte 390×844-Interaktionstest-Ergebnis ist nicht durch einen aktuellen Workflow-Run belegt und wird hier nicht als verifiziert übernommen.
- Vercel-Deployment `sensoped-ai-ucat` ist laut Vercel API READY für Commit `5e0395b`; es ist nicht der Branch-HEAD `24cad90`, dessen letzte Änderung nur die Smoke-Test-Assertion betrifft. Die App-UI auf `5e0395b` ist daher die letzte verifizierte veröffentlichte App-Version, nicht der aktuelle HEAD als gesamter Commit.
- Main, Production und bestehende Domain bleiben unverändert.


## Demo-Aktenimport abgesichert (28.11.2026, 03:31 UTC)
- Import-Button ist auch bei leerer Sitzungsaktenliste verfügbar.
- JSON-Import begrenzt auf 2 MB und maximal 100 Akten; validiert Patientenfelder, Befundwerte, IDs und Medienlisten vor dem Hinzufügen.
- Maximal 6 Bild- und 3 Videodateinamen pro Akte; Originaldateien werden nicht importiert. Duplikate werden anhand der ID übersprungen.
- Ungültige, verschachtelte oder zu große Feldwerte werden abgewiesen. Testfälle für gültige/ungültige Akten, Duplikate, Größenlimits und Medienlimits hinzugefügt.
- GitHub Actions Verify-dev Run 46103264516 für Commit `fc8bd916a5b932452ee5d1bd5068840f99b7862c` erfolgreich: Vite-Build, Worker-Syntax, 73 Smoke-Checks und 12 Import-Validierungstests; Artifact `sensoped-ai-development-preview` bis 12.12.2026.
- Verify-backup Run 46103264517 erfolgreich; Backup-Tag `backup-2026-11-28-fc8bd916a5b9` auf den geprüften Code-HEAD.
- Vercel Preview-Checks für die verknüpften Projekte werden aktuell durch das Tageslimit (build-rate-limit) abgewiesen; daher keine neue Live-Preview verifiziert. Das GitHub Actions Build-Artefakt ist der verfügbare Teststand.
- Main bleibt bei `9f1001adac6ac17e319479ae8dc55f4abdeae024`; keine Zusammenführung, Production oder bestehende Domain verändert.
