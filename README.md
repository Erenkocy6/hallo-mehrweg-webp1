# Hallo Mehrweg – WebP1, Hausübung 1

Statische, responsive Umsetzung der sechs Mockup-Seiten aus dem Aufgabenblatt (WiSe 2026/2027), ergänzt um Kontakt, Warenkorb, Merkliste, Impressum, Datenschutz und Demo-AGB. **Kein echter Shop.**

## Sofort öffnen

`index.html` doppelklicken. HTML, CSS, JavaScript, Bilder und Schriften sind bereits vollständig lokal enthalten. Zum Betrachten ist weder npm noch eine Internetverbindung nötig.

Für eine zuverlässige gemeinsame Speicherung von Warenkorb und Merkliste über alle Seiten empfehlen wir den lokalen Server:

```sh
npm start
```

Anschließend `http://127.0.0.1:8080` öffnen. Der Server benötigt nur Node.js und keine installierten npm-Pakete. Er ist ausschließlich auf dem eigenen Rechner erreichbar. Bei direktem Öffnen über `file://` kann die Behandlung des localStorage je nach Browser abweichen.

## Noch persönlich ergänzen

Auf ausdrücklichen Wunsch bleiben diese Angaben zunächst offen:

- Teamnamen (zwei oder drei Personen), ggf. Matrikelnummern nach Lehrveranstaltungsvorgabe.
- Echte Betreiber- und Kontaktangaben in `impressum.html` und `datenschutz.html`.
- Repository-URL und tatsächliche Teambeiträge in `docs/TEAM.md`.
- Persönliche Reflexion der KI-Nutzung: `DOKUMENTATION.md` enthält nachvollziehbar gekennzeichnete, sinngemäße Arbeitsaufträge aus dieser KI-Erstellung. Das Team muss die Angaben prüfen und um eigene tatsächlich verwendete Prompts ergänzen.

Suche nach `[ERGÄNZEN`, um offene Stellen zu finden. Die Vorlagen sind ohne echte Betreiberangaben **nicht rechtlich vollständig**. Für öffentliches Hosting sind zusätzliche Hosting-/Datenschutzangaben nötig. Es wird keine rechtliche Vollständigkeit für einen echten Shop behauptet.

Ein lokales Git-Repository ist vorbereitet. Ein initialer Commit dokumentiert die KI-Erstellung; er ersetzt nicht die geforderten laufenden Commits aller Teammitglieder. Ein Remote-Repository wurde nicht angelegt und nichts hochgeladen.

## Seitenzuordnung

| PDF-Vorlage | Datei |
|---|---|
| Seite 4: Startseite | `index.html` |
| Seite 5: Kategorien und Anbieter | `anbieter.html` |
| Seite 6: Ergebnisse, Filter und Produkte | `produkte.html` |
| Seite 7: Produktdetails | `produkt-kokos.html` |
| Seite 8: Über uns und FAQ | `ueber-uns.html` |
| Seite 9: Bestellformular | `bestellung.html` |
| Weitere Produktdetails | 14 weitere `produkt-*.html` |
| Ergänzte Seiten | `kontakt.html`, `warenkorb.html`, `merkliste.html`, `impressum.html`, `datenschutz.html`, `agb.html` |

## Struktur

```text
Hallo-Mehrweg/
├── *.html                   26 eigenständige HTML-Seiten
├── assets/
│   ├── css/main.css         Ein fertiges Stylesheet inklusive Bootstrap
│   ├── js/                  Lokales Bootstrap, Katalog und Shop-Demo
│   ├── fonts/               PT Sans Narrow als lokale WOFF2-Dateien
│   └── img/                 Komprimierte WebP-Fotos und SVG-Favicon
├── scss/main.scss           Bootstrap-Variablen und begründete Ergänzungen
├── vendor/                  Bootstrap-SCSS und Software-/Schriftlizenzen
├── scripts/                 Optionaler Generator, Linkprüfung, lokaler Server
├── tests/                   Rechen- und Browserprüfungen
├── docs/                    Team, Quellen, Abnahmehilfe und Prüfprotokoll
├── DOKUMENTATION.md         CSS-Begründung und KI-Reflexion
├── package.json
└── package-lock.json
```

## Bearbeiten und kompilieren

Die fertigen HTML-Dateien können direkt bearbeitet werden. Der optionale Python-Generator `scripts/build-pages.py` schreibt sämtliche HTML-Dateien neu und hält Header/Footer identisch. **Nicht ausführen, wenn direkt vorgenommene HTML-Änderungen nicht zuerst in den Generator übernommen wurden.** Persönliche Angaben entweder im Generator oder ausschließlich in den finalen HTML-Dateien pflegen und danach nicht neu generieren.

Für SCSS-Änderungen:

```sh
npm ci
npm run build
```

Farben, Abstände, Schrift und Bootstrap-Komponenten werden über SCSS-Variablen vor dem Bootstrap-Import angepasst. `vendor/bootstrap-scss` enthält alle Bootstrap-Quellen. Das fertige CSS wird mit ausgeliefert; die Lehrperson muss nichts kompilieren.

## Prüfen

```sh
npm test
python3 scripts/check-html.py
```

Optionaler vollständiger Browsertest in einem zweiten Terminal, während `npm start` läuft:

```sh
npm install --no-save playwright@1.62.1
npx playwright install chromium
node tests/browser.cjs
```

Die Browserinstallation wird nur zum Testen benötigt. Sie wird nicht in der Abgabe mitgeliefert. Die Ergebnisse der tatsächlich durchgeführten Prüfungen stehen in `docs/PRUEFPROTOKOLL.md`.

## Funktionsumfang

- Responsive Bootstrap-Navigation, Karussell und FAQ-Akkordeon.
- Kategorien, Produktsuche, kombinierte Material-/Farb-/Marken-/Preis-/Größenfilter und Sortierung.
- Menge, Warenkorb, persistente Merkliste, Entfernen und Leeren.
- Cent-genaue Summen, inklusive ausgewiesener Umsatzsteuer; Versand 6,90 € nur bei gefülltem Warenkorb.
- Beschriftete und validierte Demoformulare; keinerlei echte Anmeldung, Zahlung oder Datenübermittlung.
- Kommentare werden sicher als Text angezeigt, ohne HTML-Ausführung und ohne dauerhafte Speicherung.
- Lokale Speicherfunktion unter Datenschutz löschbar.

Bilder sind lizenzierte **Symbolbilder**, Produktdaten und Bewertungen sind Beispiele. Die Galerie zeigt unterschiedliche Ausschnitte desselben Fotos, keine erfundenen zusätzlichen Produktperspektiven. Es gibt keine echte Anbieterkooperation.

## Abgabe

Das danebenliegende ZIP enthält den vollständigen Projektordner ohne `node_modules`, `.git` und Test-Screenshots. Für eine neue ZIP nach Änderungen:

```sh
python3 scripts/package.py
```

Das Git-Repository bleibt außerhalb der ZIP im lokalen Ordner erhalten. Remote-Zugang und Team-Commits müssen für die Abnahme tatsächlich vorhanden sein. Vor Moodle-Abgabe die Checkliste in `docs/ABGABE-CHECKLISTE.md` durcharbeiten.
