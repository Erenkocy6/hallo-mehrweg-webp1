# Prüfprotokoll

Datum: 11. November 2026. Durchgeführt durch den KI-Assistenten bei der Erstellung; keine erfundene unabhängige Teamabnahme.

## Automatisierte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| `npm run build` | SCSS mit lokalem Bootstrap erfolgreich zu einer CSS-Datei kompiliert. |
| `npm test` | 4 Tests bestanden: vorhandene Logik, Cent-Summen inklusive Steuer, leerer Warenkorb, Mengenbegrenzung. |
| `python3 scripts/check-html.py` | 26 HTML-Seiten geprüft: lokale Dateien/Links/Anker, Alt-Texte, Labels, IDs, genau eine h1, gemeinsame Header/Footer, ein lokales Stylesheet, keine Inline-Styles. |
| `node --check` | Eigene Browser-JavaScript-Dateien syntaktisch gültig. |
| `tests/browser.cjs` mit Playwright/Chromium | 26 Seiten bei jeweils 320, 390, 768 und 1440 px: kein horizontaler Überlauf, keine defekten Bilder. |
| Browser-Konsole/Netzwerk | Keine JavaScript-Fehler, keine HTTP-Fehler, keine externen Laufzeit-Requests. |
| Filter/Suche | 12 Schüsseln initial; kombinierter Holzfilter, Sortierung, leere Ergebnismenge, Kokossuche und Flaschenkategorie geprüft. |
| Warenkorb/Bestellung | 3 Kokosschüsseln ergeben inklusive Versand 27,87 €; Seitenwechsel, Merkliste, Pflichtfelder und lokale Demo-Bestätigung erfolgreich. |
| Weitere Interaktion | FAQ, mobile Navigation, Galerie, lokales Kontaktformular und sichere Textausgabe von Kommentaren geprüft. |
| Datenschutz | Warenkorb/Merkliste löschbar; Checkout bei leerem Warenkorb deaktiviert. |
| Offline | Startseite und Produktübersicht direkt über `file://` bei deaktiviertem Netzwerk erfolgreich geöffnet. |

## Visuelle Kontrolle

Startseite auf Desktop und Mobilgerät, Produktübersicht, Produktdetails und mobiles Bestellformular als Browser-Screenshots geprüft. Fotografien wurden zusätzlich als Kontaktbogen geprüft. Es gibt keine abgeschnittenen Inhalte oder horizontalen Scrollbalken in den geprüften Ansichten.

Die Gestaltung folgt der Struktur der Vorlage, verwendet jedoch andere lizenzierte Fotos, ein eigenes vereinfachtes Logo und leicht dunklere Grüntöne. Dies ist keine pixelgenaue Reproduktion.

## Gefundene und behobene Probleme

- Zu große Rasterabstände (`g-5`) ließen das Bestellformular mobil seitlich überlaufen. Korrigiert zu `g-4 g-lg-5`.
- Die Produkt-Icon-Leiste überschritt bei 320 px die Kartenbreite. Mit Bootstrap-Spalten und umbruchfähiger Anordnung korrigiert.
- Ein Inline-`span` als Ratio-Container ließ Galerie-Vorschaubilder falsch skalieren. `d-block` ergänzt.
- Galerie schaltete zunächst nur den Füllmodus um. Durch tatsächliche Ausschnittpositionen ersetzt.
- Die erste Bildprüfung behandelte noch nicht geladene Lazy-Loading-Bilder als defekt. Der Test wartet jetzt explizit auf deren Dekodierung; die Webseite behält Lazy Loading bei.
- Der zunächst verwendete installierte Chrome erzeugte fehlerhaft gekachelte Screenshots. Visuelle Endkontrolle mit dem zu Playwright passenden Chromium wiederholt.

## Noch nicht abgeschlossen bzw. nicht geprüft

- Echte Teamarbeit, persönliche Codekenntnis und Live-Abnahme.
- Individuelle Betreiberangaben und rechtliche Vollständigkeit für einen tatsächlichen Betreiber/Hoster.
- Upload nach Moodle und Zugriffsrechte eines Remote-Git-Repositories.
- Vollständige WCAG-Zertifizierung und Tests auf allen Browser-/Gerätekombinationen. Geprüft wurden Chromium, responsive Größen, Labels/Alt-Texte und zentrale Bedienabläufe.

Diese offenen organisatorischen Punkte sind getrennt von der technischen Funktionsprüfung zu betrachten.
