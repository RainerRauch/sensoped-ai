# SENSOPED AI – Demo-Prüfplan (Entwicklungsbranch)

> Ausschließlich mit künstlichen Demo-Daten testen. Dieser Prototyp ist kein freigegebenes Patientenakten-System und liefert keine validierte Diagnostik.

## Testablauf auf Smartphone oder Desktop

1. **Start und Orientierung** – Dashboard öffnen; Navigation, Petrol-Oberfläche und Hinweis auf den Prototyp prüfen.
2. **Demo-Patient** – einen fiktiven Namen und ein fiktives Geburtsdatum eingeben. Keine echten Namen, Adressen, Telefonnummern, Diagnosen oder Bilder verwenden.
3. **Anamnese** – Beschwerde, Dauer, Belastung und Schmerz nur mit künstlichen Testwerten eingeben; Schmerzbereich 0–10 kontrollieren.
4. **Fußbefund / Statik** – rechte und linke Seite getrennt dokumentieren; Frontal-, Rück- und Seitenansicht als Textbeobachtung abbilden.
5. **Bilddokumentation** – Demo-Medienbestätigung setzen; PNG, JPEG oder WebP bis 10 MB pro Bild und insgesamt maximal 6 Fotos/30 MB ausprobieren. Zuordnung und Notiz kontrollieren; Bild entfernen und dasselbe Testbild erneut auswählen.
6. **Gang / Video** – Demo-Bestätigung setzen; künstliches Video (max. 100 MB je Video, 3 Videos/150 MB gesamt) laden, Perspektive und Beobachtungsnotiz eintragen. Die App wertet Videos nicht automatisch aus.
   - Gangstrecke: Eingaben von 0,1 bis 100 m testen; Speichern muss eine gemessene Streckenbestätigung verlangen. „10 m“ darf nur mit exakt 10 m gespeichert werden; abweichende Strecken benötigen einen Zahlenwert.
7. **Auswertung / Bericht** – den regelbasierten Hinweisentwurf erstellen, fachlich im Demo-Kontext prüfen, Patienten- und Arztbericht auswählen und Export auslösen. Exportdatei mit einem fiktiven Namen prüfen; keine diagnostische Aussage als validiert behandeln.
8. **Patientenansicht** – nur dokumentierte Inhalte kontrollieren; fehlende Angaben müssen als nicht dokumentiert erkennbar sein. Demo-Freigabe setzen und Druck/PDF nur mit künstlichen Daten testen.
9. **Speichern / Wiederöffnen** – Demo-Akte speichern, in der Sitzung öffnen und kontrollieren, dass Medien nur als Namen/Notizen dokumentiert sind; ursprüngliche Dateien werden beim Wiederöffnen nicht automatisch geladen.
10. **Datenschutz-Reset** – bestätigen; Demo-Akten, Entwurf, Suchfeld und temporäre Medien sollen entfernt werden. Die Worker-Adresse bleibt als Konfiguration erhalten.

## Erwartete Schutzgrenzen

- Medienbestätigung ist ein Demo-Gate, kein rechtlicher Einwilligungsnachweis.
- Gesichts-Pixelierung, sichere Benutzerkonten, verschlüsselte Patientenakte, Audit-Protokoll und rechtskonforme Freigabe sind nicht implementiert.
- Bilder und Videos werden in dieser Demo nicht automatisch diagnostisch ausgewertet; der Worker-Bildhinweis ist eine unterstützende Demo und muss fachlich geprüft werden.
- Browser-Sitzungsspeicher ist kein sicherer, dauerhafter Speicher für Patientendaten.
- Worker und externe API-Verbindung nur mit künstlichen Testdateien prüfen.

## Responsive / Accessibility

- Smartphone: 390 px Breite; keine horizontale Überläufe, Navigation und Schritte erreichbar, Buttons bequem antippbar.
- Tastatur: alle Buttons und Eingaben erreichen; Fokusindikator sichtbar.
- Statusmeldungen: werden als höfliche Live-Region angekündigt.
- Reduzierte Bewegung: Einstellung des Betriebssystems beachten.

## Ergebnisprotokoll

Datum, Browser/Version, Bildschirmbreite, getestete Schritte, Fehler und Screenshots (ohne personenbezogene Inhalte) notieren. Smoke-Checks und Build sind getrennt von einem interaktiven Browser-Test zu bewerten.
