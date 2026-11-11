# Lernhilfe für die Abnahme

## Aufbau in 60 Sekunden erklären

„Unsere Webseite besteht aus einzelnen HTML-Seiten. Bootstrap liefert das Raster und die meisten Gestaltungsklassen. Wir ändern Farben, Schrift und Standardabstände über SCSS-Variablen vor dem Bootstrap-Import. Daraus entsteht eine einzige lokale CSS-Datei. JavaScript ergänzt Warenkorb, Filter und Demoformulare. Es gibt keinen Backend-Shop und keine echten Zahlungen. Alle Dateien einschließlich Fotos und Schriften liegen lokal.“

## Typische Fragen

**Was bedeutet `col-md-6`?** Ab dem md-Breakpoint (768 px) belegt die Spalte sechs von zwölf Rasterspalten, also die Hälfte. Darunter füllt sie standardmäßig die verfügbare Zeile.

**Was machen `row`, `g-4` und `container`?** `container` begrenzt die Inhaltsbreite responsiv, `row` fasst Spalten zusammen, `g-4` setzt horizontale und vertikale Zwischenräume.

**Warum SCSS und nicht einfach CSS nachladen?** Die Aufgabe fordert Bootstrap-Anpassung über Variablen und eine gemeinsame kompilierte Datei. SCSS ersetzt Werte vor der Generierung der Bootstrap-Klassen. Browser laden die fertige CSS-Datei, nicht SCSS.

**Warum stehen Variablen vor dem Import?** Bootstrap verwendet Vorgaben mit `!default`; vorher gesetzte eigene Werte überschreiben diese Standardvorgaben.

**Wie arbeitet ein FAQ?** `data-bs-toggle="collapse"` aktiviert das lokale Bootstrap-JavaScript. `data-bs-target` verweist auf die ID des Inhalts. `aria-expanded` und `aria-controls` beschreiben den Zustand für Hilfstechnologien.

**Warum `defer` bei Skripten?** Die Dateien können parallel zur HTML-Verarbeitung geladen werden, werden aber erst nach dem Parsen in ihrer Reihenfolge ausgeführt. Der Katalog und ShopCore sind daher vor app.js verfügbar.

**Was ist `data-*`?** Eigene HTML-Datenattribute. Eine Produktkarte trägt z. B. Material und Preis. JavaScript liest sie über `element.dataset.material` bzw. `.price` aus.

**Warum Integer-Cent?** Binäre Gleitkommazahlen können Dezimalbeträge ungenau darstellen. 699 Cent sind exakt. Formatiert wird erst bei der Ausgabe.

**Wie berechnet sich enthaltene Umsatzsteuer?** Bei einem Bruttopreis mit 19 % Steuer: `brutto * 19 / 119`, am Ende auf Cent runden. `brutto * 0.19` wäre die falsche Formel für bereits enthaltene Steuer.

**Wo liegen die Daten?** Nur Produkt-IDs und Mengen in localStorage. Formulareingaben werden nicht gespeichert oder versendet. localStorage überlebt Neuladen und kann unter Datenschutz gelöscht werden.

**Warum `textContent` statt `innerHTML` für Kommentare?** Damit eingegebene Zeichen wie `<script>` nur als Text erscheinen und nicht als ausführbares HTML interpretiert werden. `innerHTML` wird hier ausschließlich mit kontrollierten Katalogdaten bzw. festem Markup verwendet.

**Ist die Seite ohne JavaScript nutzbar?** Navigation, Inhalte und Produktlinks sind in HTML enthalten. Warenkorb, Filter, mobile Collapse-Navigation und Demoformulare benötigen JavaScript. Der lokale Webserver ist zum Ansehen nicht zwingend erforderlich.

**Was macht der Generator?** Er vermeidet unterschiedliche Header/Footer, schreibt aber echte vollständige HTML-Dateien. Er ist ein optionales Entwicklungswerkzeug, kein Bestandteil der Laufzeit.

## Kleine Änderungen ohne KI üben

1. Primärfarbe in `scss/main.scss` ändern, `npm run build` ausführen, Ergebnis ansehen.
2. Eine Überschrift in einer HTML-Datei ändern und den Browser neu laden.
3. Ein Raster von drei auf zwei Spalten ändern: `col-md-4` durch `col-md-6` ersetzen.
4. Ein Formularfeld mit eigenem eindeutigen `id` und passendem `label for` ergänzen.
5. Ein weiteres FAQ über das vorhandene Muster einfügen; IDs und `data-bs-target` müssen zusammenpassen.
6. Preis einer bestehenden Ware ändern: Katalog **und** statische Produktdarstellung konsistent halten, am besten über den Generator.
7. Ein neues Bild lokal ablegen, relativen Pfad und sinnvollen Alt-Text verwenden, Quelle im Impressum ergänzen.

## Fehler systematisch eingrenzen

- Bild fehlt: Pfad und Groß-/Kleinschreibung prüfen, Netzwerk-Tab auf 404 untersuchen.
- Mobil horizontaler Scrollbalken: feste Breiten, lange untrennbare Texte, Raster ohne `row` prüfen.
- Button ohne Wirkung: Browserkonsole, geladenes lokales Skript, ID und Event-Selektor prüfen.
- Falsche Summe: Cent vs. Euro, Menge, Versand und Rundung getrennt kontrollieren.
- SCSS-Änderung unsichtbar: erneut kompilieren; Browser lädt `assets/css/main.css`, nicht die SCSS-Datei.
- Änderungen nach Generatorlauf weg: direkte HTML-Änderungen wurden nicht in den Generator übertragen.

Diese Lernhilfe ersetzt das eigene Durcharbeiten nicht. Alle Teammitglieder müssen die relevanten Abschnitte selbst erklären können.
