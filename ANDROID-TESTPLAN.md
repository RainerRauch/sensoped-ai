# SENSOPED AI – Android-Testplan (manuelle Abnahme)

Test ausschließlich mit fiktiven Daten, keine personenbezogenen Patientendaten.

## Start
- Preview auf Android öffnen und neu laden.
- Prüfen, ob die Oberfläche ohne horizontales Scrollen bedienbar ist.
- Navigation zwischen Untersuchungsschritten prüfen.
- Zurücknavigation ohne Verlust des aktuellen Demo-Befunds prüfen.

## Sprache / Mikrofon
- Diktierfunktion bei einem Befundfeld testen.
- Android-Berechtigungsdialog: erlauben und verweigern testen.
- Gboard-Diktat als fallback prüfen, falls Browser Speech API fehlt.
- Fehler/Timeout/kein gesprochenes Wort beobachten.
- Kontrollieren, ob Text im richtigen Feld landet und editierbar bleibt.

## Kamera / Dateien
- Foto aufnehmen (wenn Browserzugriff verfügbar).
- Bilddatei auswählen und Upload abbrechen.
- Ungültige Dateitypen testen.
- Bei Bildanalyse nur synthetische Testbilder verwenden.
- Keine automatische Diagnose als gesichert darstellen.

## Verbindung
- Worker-URL leer: verständliche Fehlermeldung.
- Worker nicht erreichbar: Fehlermeldung und Retry.
- /health-Test: Ergebnis verständlich darstellen.
- Worker-Interpretation mit künstlichen Befunddaten testen.

## Abschluss
- Entwurf speichern und erneut öffnen.
- Testdaten entfernen.
- Keine echte Patientendatenbank oder sichere klinische Freigabe voraussetzen.
- Gerät, Browser-Version, Tester, Datum und Probleme in einem Testprotokoll notieren.
