# SENSOPED AI – Neuentwicklung
## Architektur- und Entwicklungsgrundlage (Start)

### Leitbild
Eine robuste, mobile-first Untersuchungsanwendung für die standardisierte Fuß-, Statik- und Bewegungsanalyse. Die Software unterstützt den Untersucher, dokumentiert Befunde, assistiert bei der Interpretation und erstellt verständliche Berichte. Klinische Entscheidungen und Freigabe bleiben beim Fachpersonal.

### Prinzipien
- **Untersuchungsführung:** klare Schrittfolge, Fortschritt, Rücksprung und autosave.
- **Minimale Eingabe:** Auswahlfelder, sinnvolle Defaults, Spracheingabe und automatische Übernahme erkannter Werte.
- **Modular:** jedes Untersuchungsmodul isoliert, testbar und austauschbar.
- **Mobile-first:** Smartphone, Tablet und Desktop; große Bedienelemente und verständliche Kontraste.
- **Human-in-the-loop:** KI-Ausgaben als Vorschläge, nachvollziehbar und vom Untersucher zu bestätigen.
- **Datenschutz:** Datenminimierung, sichere Speicherung, Rollen/Rechte, Protokollierung, Lösch- und Exportkonzept.
- **IP-Schutz:** keine sensiblen Schlüssel im Frontend; KI-/Geschäftslogik soweit möglich serverseitig.

### Zielworkflow
1. Patientenakte / Identifikation
2. Anamnese und Beschwerden
3. Basisdaten und relevante Vorgeschichte
4. Fußuntersuchung und Beweglichkeit
5. Fußstatik / Abdruck / Bildaufnahme
6. Bewegungs- und Videoanalyse
7. KI-gestützte Auswertung (mit Konfidenz/Unsicherheiten)
8. Untersucherprüfung und Befundfreigabe
9. Versorgungsvorschlag, einschließlich SENSOPED sensomotorischer Einlagen, sofern passend
10. Patientenbericht und Arzt-/Therapeutenbericht
11. Export, Speicherung und Abschluss

### Module
- Patientenverwaltung (MVP: lokale Demo-Daten, später sichere Backend-Anbindung)
- Untersuchungsworkflow / Status
- Anamnese
- Fußbefund
- Bild- und Abdruckanalyse
- Video-/Gang-Analyse
- Spracheingabe
- KI-Befundassistent
- Versorgungs-/Einlagenmodul
- Berichtsgenerator
- Export und Dokumentation

### Technische Leitentscheidung (vorläufig)
Frontend als komponentenbasierte Web-App; Datenmodell und UI getrennt; Backend-API für Authentifizierung, Patientendaten, KI-Verarbeitung und Schlüsselverwaltung. Vor Auswahl konkreter Frameworks/Services werden Version 1.9 und der bestehende Repository-Stand untersucht, damit bewährte Funktionen nicht verloren gehen.

### Sicherheitsanforderungen
- keine API-Schlüssel oder privaten Zugangsdaten im Browser
- Authentifizierung und Berechtigungen
- Transportverschlüsselung und sichere Speicherung
- möglichst pseudonymisierte KI-Anfragen
- Datenexport/-löschung, Audit-Log und Backup
- klare Einwilligungs-/Hinweisprozesse für Bild und Video
- Sicherheits- und Datenschutzprüfung vor realen Patientendaten

### Entwicklungsphasen
**Phase 0 – Bestandsaufnahme:** Version 1.9, aktuelle Repo-Struktur, funktionierende Funktionen und Fehlerbild dokumentieren.

**Phase 1 – Fundament:** UX-Grundgerüst, Navigation, Designsystem, Datenmodell, Autosave, Testbasis.

**Phase 2 – Untersuchungs-MVP:** Patientenakte, Anamnese, Fußbefund, statische Bilder/Abdruck, Befundübersicht.

**Phase 3 – KI und Medien:** Spracheingabe, Bildassistenz, Video-/Gang-Analyse; zunächst prototypisch und kontrolliert.

**Phase 4 – Berichte:** Patienten- und Arztbericht, Export, Versorgungsvorschläge.

**Phase 5 – Sicherheit und Qualität:** Tests, Datenschutz, Zugriffskontrollen, Fehlerbehandlung, mobile Tests und Pilotbetrieb.

### Definition of Done
Ein Modul gilt erst als fertig, wenn es auf Smartphone und Desktop geprüft ist, Fehlerzustände verständlich behandelt, Daten zuverlässig speichert, sich im Workflow nutzen lässt und getestet wurde. KI-Ausgaben werden als assistierend gekennzeichnet und können vor Berichten bestätigt/angepasst werden.

### Nächster Schritt
Bestandsaufnahme des bestehenden Codes und der Version 1.9. Die Version 1.9 wird als funktionelle Referenz herangezogen; ihre Datei muss für einen direkten Vergleich bereitgestellt werden, sofern sie nicht bereits im Repository enthalten ist.
