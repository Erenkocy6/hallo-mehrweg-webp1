# Dokumentation zur 1. Hausübung – Hallo Mehrweg

## 1. Technische Umsetzung und eigene CSS-Selektoren

Jede Seite ist eine eigenständige HTML-Datei. Header und Footer enthalten auf allen Seiten identisches Markup. Der optionale Generator erzeugt dieses gemeinsame Markup; es ist bereits in den ausgelieferten HTML-Dateien enthalten und muss nicht zur Laufzeit geladen werden.

Die Gestaltung basiert auf Bootstrap 5.3.8. In `scss/main.scss` stehen Farbvariablen, Schriftfamilie, Schriftgrößen, Containerbreiten, Ecken, Linkdarstellung und Formulareinstellungen **vor** dem Import von Bootstrap. Alles wird zu genau `assets/css/main.css` kompiliert. Es gibt keine zusätzliche CSS-Datei, keine `<style>`-Blöcke und keine Inline-Styles.

Layout, Abstände, Flexbox, Raster, Textfarben, Bildskalierung, Rahmen, Hintergründe und responsive Umschaltung verwenden Bootstrap-Klassen wie `row`, `col-md-6`, `g-4`, `ratio`, `object-fit-cover`, `d-none`, `navbar-expand-md` und `bg-light`.

Die wenigen eigenen Ergänzungen sind begründet:

| Ergänzung | Warum notwendig? |
|---|---|
| Zwei `@font-face`-Deklarationen | Die Einbindung lokaler Schriftdateien kann nicht mit Bootstrap-Klassen erfolgen. Sie deklarieren die reguläre und die fette PT Sans Narrow. |
| `.hero-ratio` | Das breite Startseitenmotiv der Vorlage benötigt ein Verhältnis von ungefähr 100:37; Bootstrap bietet dieses Verhältnis nicht standardmäßig. Eine Mindesthöhe hält die Überschrift auf kleinen Displays lesbar. |
| `.banner-ratio` | Die flachen Banner der Unterseiten haben ein Verhältnis von ungefähr 100:18, ebenfalls kein Standardverhältnis. |
| `.photo-shade` | Bootstrap bietet keinen gerichteten Transparenzverlauf von links nach rechts. Er verbessert den Kontrast weißer Texte auf Fotos. |
| `.photo-top`, `.photo-bottom` | Bootstrap stellt `object-fit`, aber keine Klassen für `object-position` zur Verfügung. Die zwei Klassen wählen obere bzw. untere Ausschnitte für die Produktgalerie. |

Die Klassen `.product-card` sowie `data-*`-Attribute sind JavaScript-Anknüpfungspunkte und besitzen keine eigenen CSS-Regeln.

## 2. Drei exemplarische KI-Arbeitsaufträge

**Transparenz:** Der tatsächliche Nutzerauftrag lautete: „löse die abga komplett erstelle ordner ud alles“. Die folgenden drei Prompts sind **sinngemäße, nachträglich strukturierte Arbeitsaufträge aus dieser KI-Erstellung**, keine wortgetreuen zusätzlichen Nachrichten der Teammitglieder. Ergebnisse und Prüfungen beziehen sich auf die tatsächlich vorhandene Umsetzung. Vor der Abgabe muss das Team eigene tatsächlich genutzte Prompts ergänzen bzw. diese Darstellung mit der Lehrperson abstimmen; hier wird keine persönliche Teamreflexion erfunden.

### A – Vorlage in eine lokale Bootstrap-Struktur übertragen

**Ausgangsproblem:** Sechs unterschiedliche Ansichten sollten mit gemeinsamer Navigation, responsivem Aufbau und ausschließlich lokalen Ressourcen umgesetzt werden.

**Sinngemäßer Prompt:** „Analysiere die sechs Mockups. Erzeuge für jede Ansicht eine separate HTML-Datei mit identischem Kopf- und Fußbereich. Verwende Bootstrap 5 lokal, passe es über SCSS-Variablen an und ergänze nur zwingend notwendige eigene Regeln.“

**Ergebnis:** 26 eigenständige Seiten einschließlich aller Produktdetails und Ergänzungsseiten, lokale Bootstrap-Quellen, SCSS-Theme und bereits kompiliertes CSS.

**Übernommen:** Bootstrap-Raster, Navbar, Collapse/Akkordeon, Karussell sowie gemeinsame Vorlagen für Header/Footer.

**Angepasst:** Das Grün wurde etwas dunkler als in der Vorlage gewählt, damit kleine Schrift und Buttons besser lesbar sind. Die Bilder wurden durch kommerziell nutzbare Pexels-Fotos ersetzt. Rechtliche Texte wurden als Demo-Texte mit ausdrücklich offenen Betreiberangaben verfasst.

**Prüfung:** Alle HTML-Dateien werden auf lokale Links, Sprungmarken, Alt-Texte, Labels, eindeutige IDs und identische Kopf-/Fußbereiche geprüft. Zusätzlich erfolgte eine Browserprüfung bei 320, 390, 768 und 1440 Pixeln.

### B – Preisberechnung und Bestellablauf prüfen

**Ausgangsproblem:** Die Bestellübersicht im Mockup enthält widersprüchliche Beträge. Außerdem sollen Warenkorb und Bestellformular sinnvoll zusammenarbeiten.

**Sinngemäßer Prompt:** „Prüfe 3 Schüsseln à 6,99 Euro zuzüglich 6,90 Euro Versand. Implementiere einen Demo-Warenkorb mit Mengenprüfung, korrekter Gesamtsumme und enthaltener 19-Prozent-Umsatzsteuer, ohne echte Bestellung oder Zahlung auszulösen.“

**Ergebnis:** `shop-core.js` rechnet in ganzen Cent. 3 × 699 + 690 = 2787 Cent. Der enthaltene Steueranteil beträgt gerundet 445 Cent. Ein leerer Warenkorb hat weder Versandkosten noch eine aktive Bestellschaltfläche.

**Übernommen:** Ganzzahlige Geldwerte, Beschränkung der Mengen auf 1 bis 99, `Intl.NumberFormat` für die Ausgabe und Formularvalidierung.

**Verworfen:** Eine reine Übernahme der widersprüchlichen Gesamtzeile aus dem Mockup wäre fachlich falsch. Es wurde weder der fehlerhafte Betrag kopiert noch eine tatsächliche Zahlung integriert.

**Prüfung:** Vier Node-Tests und ein Browserdurchlauf mit drei Kokosschüsseln, Seitenwechsel, Pflichtfeldprüfung und Demo-Bestätigung.

### C – Interaktive Elemente kritisch kontrollieren

**Ausgangsproblem:** Suche, Merkliste, Galerie und Kommentare dürfen nicht bloß klickbar aussehen. Formulare dürfen keine echten Dienste kontaktieren.

**Sinngemäßer Prompt:** „Prüfe die interaktiven Elemente: kombinierte Filter, leere Ergebnisse, Speicherung des Warenkorbs, mobile Navigation, Kommentare und lokale Demoformulare. Vermeide externe Requests und zeige Nutzereingaben als Text an.“

**Ergebnis:** Filter und Sortierung wirken auf vorhandene Produktkarten; Merkliste und Warenkorb speichern nur Produktkennungen und Mengen. Kontakt und Checkout zeigen lokale Bestätigungen. Kommentare werden mit `textContent` eingefügt.

**Übernommen:** Speicherung ohne persönliche Daten, verständliche Leermeldungen, beschriftete Icon-Buttons, `aria-live`-Rückmeldungen und eine Löschfunktion für lokale Daten.

**Angepasst:** Ein erster Galerieansatz schaltete lediglich zwischen `object-fit-cover` und `object-fit-contain` um. Das erfüllte die beschrifteten Ausschnitte nicht. Er wurde durch tatsächliche `object-position`-Ausschnitte ersetzt und entsprechend als Ausschnittgalerie benannt.

**Prüfung:** Der Browsertest bestätigt Suche/Filter, sichere Darstellung von `<script>`- und `<img>`-Text in Kommentaren, FAQ, mobile Navigation, Löschung der lokalen Daten und fehlende externe Requests.

## 3. Konkreter verworfener KI-Vorschlag

Der erste KI-generierte Galerie-Handler änderte nur den Füllmodus des Hauptbildes. Die Buttons waren als unterschiedliche Ausschnitte bezeichnet, lieferten aber keine passenden Ausschnitte. Das war bei Prüfung des Codes erkennbar: Der Handler änderte keine `object-position`, sondern nur `object-fit`.

Dieser Vorschlag wurde nicht in der Endfassung übernommen. Stattdessen setzen `.photo-top` und `.photo-bottom` die sichtbare Bildposition. Das Hauptbild bleibt dasselbe lizenzierte Foto; es wird transparent beschrieben, dass keine weiteren echten Produktaufnahmen vorliegen. Der Browser-Test kontrolliert, dass der erste Ausschnittbutton tatsächlich die entsprechende Klasse setzt.

Dies ist eine tatsächlich während der KI-Erstellung vorgenommene Korrektur. Sie darf nicht als unabhängig durchgeführte Teamprüfung dargestellt werden, solange das Team sie nicht selbst nachvollzogen hat.

## 4. Abweichungen und Grenzen

- Vergleichbarer Aufbau und Farbwelt, keine pixelgenaue Kopie: andere zulässige Symbolbilder und angepasste Texte.
- Logo als eigene Text-/SVG-Komposition; keine Originalmarkenlogos aus dem PDF übernommen.
- Shop-, Anbieter- und Produktinformationen sind Beispieldaten, keine echten Angebote oder Kooperationen.
- Login, Zahlungsanbieter, Bonusprogramm und Versand werden nicht als echte Dienste implementiert.
- Persönliche Angaben bleiben auf Wunsch offen. Ohne sie sind Impressum/Datenschutz nicht endgültig vollständig.
- Eine echte mehrwöchige Team-Git-Historie kann nachträglich nicht erzeugt werden. Die geforderte Zusammenarbeit bleibt Aufgabe des Teams.
- KI-Unterstützung ist laut Aufgabenblatt erlaubt. Für die Abnahme muss jedes Teammitglied den Code erklären und selbst verändern können; `docs/ABNAHME-LERNHILFE.md` unterstützt dabei.
