# SENSOPED AI – Sicherheits- und Validierungsplan

Dieser Plan gilt für den Entwicklungszweig `sensoped-ai-neuentwicklung`. Er ist eine Arbeitsliste, keine Freigabe für den klinischen Einsatz.

## Aktueller Stand aus der Quellcodeprüfung
- Die App verwendet derzeit Demo-/Browser-Speicherung; keine klinisch geeignete Patientendatenbank oder Zugriffskontrolle.
- Der Worker prüft die konfigurierte Origin, aber Origin/CORS ist keine Authentifizierung.
- Worker-Endpunkte für Transkription, Interpretation und Bildbeschreibung sind vorhanden; Deployment und Live-Tests sind noch nicht bestätigt.
- Bildausgaben sind Hinweise, keine validierte medizinische Analyse. Videoanalyse ist nicht angeschlossen.
- Keine realen Patientendaten im Prototyp.

## Priorisierte nächste Schritte
1. **Worker bereitstellen und prüfen:** Secrets ausschließlich im Worker; `ALLOWED_ORIGIN` exakt setzen; /health, /transcribe, /interpret und /image mit synthetischen Testdaten prüfen.
2. **Authentifizierung und Zugriff:** Vor Patientendaten Authentifizierung, rollenbasierte Zugriffe und serverseitige Prüfung ergänzen; CORS allein genügt nicht.
3. **Datenschutz & Speicher:** Speicherstrategie, Löschfristen, Einwilligung, Export/Löschung und verschlüsselte Speicherung definieren; Session-/Browser-Demo-Daten klar abgrenzen.
4. **Protokollierung:** Datenschutzgerechte Audit-Logs ohne unnötige sensible Inhalte implementieren.
5. **Upload-Sicherheit:** Dateityp, Dateigröße, Bild-/Audio-Parsing, Fehlerpfade und Missbrauchsschutz testen.
6. **Klinische Validierung:** Testfälle für Seitenverwechslung, fehlende Daten, widersprüchliche Angaben und halluzinierte Befunde; Ergebnisse durch Fachpersonen prüfen.
7. **Mobile UX:** Mikrofon, Fotoaufnahme, Video, Upload und Offline-/Fehlerzustände auf Android real testen.
8. **Freigabe-Gate:** Keine realen Patientendaten und kein klinischer Einsatz vor Datenschutz-, Sicherheits-, rechtlicher und klinischer Prüfung.

## Testmatrix (synthetische Daten)
- Origin fehlt / falsch / korrekt
- Worker-Secret fehlt (ohne Secret offenzulegen)
- Zu große Audio-, Bild- und JSON-Payloads
- Falscher MIME-Typ, ungültiges JSON, unbekannte Route
- Rechts/links unklar oder widersprüchlich
- Untersuchungsschritte fehlen: Antwort muss fehlende Bereiche kenntlich machen
- Prompt-Injection in Befundnotizen: Inhalte als Daten behandeln
- Android-Mikrofon verweigert, kein Speech API, Netzwerkfehler, Timeout
