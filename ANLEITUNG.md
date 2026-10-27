# Lüdi Motos Webseite – Anleitung

Stand: 27. Oktober 2026. Diese Datei ist die massgebliche Fassung der Anleitung. Änderungen bitte hier vornehmen.

## Überblick

Die Webseite besteht aus einfachen HTML-, CSS- und JavaScript-Dateien. Sie braucht keine Datenbank und kein CMS und läuft auf jedem Webserver. Alle Dateien liegen in diesem Repository (`lm-website`).

**Wichtigste Regel:** Texte nie direkt in den fertigen Seiten (`index.html` usw.) ändern, sondern in den Vorlagen unter `_quelle/pages/`. Danach erzeugt ein kleines Skript die fertigen Seiten neu (siehe Abschnitt Arbeitsablauf). Sonst gehen Änderungen beim nächsten Erzeugen verloren.

| Datei / Ordner | Inhalt | Ändern für |
| --- | --- | --- |
| `_quelle/pages/*.html` | Inhalt jeder Seite (ohne Kopf- und Fussbereich) | Texte, Bilder, Fahrzeuge, Team, FAQ, Formulare |
| `_quelle/build.py` | Kopfbereich, Navigation, Fussbereich, Öffnungszeiten-Liste, Seitentitel, Icons | Menü, Kontaktdaten oben/unten, Öffnungszeiten, Instagram, Google-Beschreibung |
| `css/style.css` | Gestaltung: Farben, Schriften, Abstände | Farben, Schriftgrössen, Look |
| `js/main.js` | Interaktionen: Menü, Formulare, Filter, Countdown, Öffnungsstatus, Fahrzeugangebote | Öffnungszeiten für den Live-Status, Formularversand, Inserate-Kategorien |
| `img/` | Logo, Favicon, Fotos, Fahrzeugbilder, Suzuki- und SYM-Logo | Bilder austauschen oder ergänzen |
| `index.html`, `werkstatt.html`, … | Fertige Seiten, werden erzeugt | Nicht direkt bearbeiten, nur hochladen |
| `README.md` | Kurzanleitung für Entwickler | – |
| `ANLEITUNG.md` | Diese Anleitung | – |

| Seite | Datei | Vorlage |
| --- | --- | --- |
| Home | `index.html` | `_quelle/pages/index.html` |
| Dienstleistungen + Serviceanmeldung | `werkstatt.html` | `_quelle/pages/werkstatt.html` |
| Fahrzeuge | `fahrzeuge.html` | `_quelle/pages/fahrzeuge.html` |
| Winteraktion + Anmeldung | `winteraktion.html` | `_quelle/pages/winteraktion.html` |
| Über uns | `portrait.html` | `_quelle/pages/portrait.html` |
| Kontakt | `kontakt.html` | `_quelle/pages/kontakt.html` |
| AGB | `agb.html` | `_quelle/pages/agb.html` |
| Impressum & Datenschutz | `impressum.html` | `_quelle/pages/impressum.html` |

## Arbeitsablauf

Jede Änderung läuft in vier Schritten: Vorlage bearbeiten, Seiten neu erzeugen, lokal prüfen, hochladen. Du brauchst nur einen Texteditor (z. B. Visual Studio Code oder Notepad++) und Python 3.

1. **Vorlage bearbeiten:** die passende Datei in `_quelle/pages/` (Inhalt) oder `_quelle/build.py` (Kopf, Menü, Fuss, Öffnungszeiten) öffnen und speichern. Gestaltung und Skripte (`css/style.css`, `js/main.js`) bearbeitest du direkt, sie werden nicht erzeugt.
2. **Seiten erzeugen:** im Hauptordner des Repositorys ein Terminal öffnen und ausführen: `python3 _quelle/build.py .`  
   Unter Windows heisst der Befehl oft `py _quelle/build.py .` Das Skript meldet jede erzeugte Seite mit «built …».
3. **Lokal prüfen:** `index.html` im Browser öffnen und die geänderte Seite anschauen. Bei Bildern oder Skripten hilft ein kleiner lokaler Server: `python3 -m http.server`, dann `http://localhost:8000` aufrufen.
4. **Hochladen:** die geänderten Dateien per FTP oder über das Kundenportal des Hosters (Call-Up) auf den Webserver kopieren. Hochladen musst du nur die fertigen Seiten, `css/`, `js/` und `img/`. Den Ordner `_quelle/`, `README.md` und `ANLEITUNG.md` braucht der Server nicht.

Meldet das Skript `unresolved placeholders`, steht in einer Vorlage ein Platzhalter wie `{{icon:…}}` mit einem Namen, den es nicht gibt. Die verfügbaren Icon-Namen stehen oben in `_quelle/build.py` unter `ICONS`, z. B. `phone`, `mail`, `wrench`, `tire`, `snow`, `heart`.

## Farben, Schriften und Logo

Alle Farben stehen zentral ganz oben in `css/style.css` im Block `:root`. Wer dort einen Wert ändert, ändert ihn auf allen Seiten gleichzeitig. Nach einer CSS-Änderung muss nichts neu erzeugt werden, nur `css/style.css` hochladen.

| Name | Wert | Wofür |
| --- | --- | --- |
| `--logo-blue` | #0000ff | Blau des Schriftzugs im Logo (Referenz) |
| `--logo-wheel` | #3f48cc | Blau der Räder im Logo, Anfang des Farbverlaufs in blauen Bannern |
| `--logo-grey` | #7f7f7f | Grau des Rahmens im Logo (Referenz) |
| `--brand` | #1a22e6 | Hauptfarbe: Buttons, Links, Icons, aktive Menüpunkte, Laufband |
| `--brand-dark` | #1016b0 | Buttons beim Überfahren mit der Maus |
| `--brand-rgb` | 26, 34, 230 | Dieselbe Hauptfarbe als Zahlen für halbtransparente Flächen. Muss immer zu `--brand` passen |
| `--tint` / `--tint-2` | #eef0ff / #e2e6ff | Hellblaue Flächen: Kopfleiste, Fussbereich, Icon-Hintergründe |
| `--ice` | #e8f4ff | Eisblau der Winteraktion |
| `--bg` | #fafbff | Seitenhintergrund |
| `--text` / `--heading` | #1b1d2a / #12142a | Fliesstext und Überschriften |
| `--muted` | #5d6275 | Graue Nebentexte |

**Beispiel Hauptfarbe ändern:** `--brand`, `--brand-dark` (etwas dunkler) und `--brand-rgb` (dieselbe Farbe als drei Zahlen) zusammen anpassen. Die Zahlen liefert jeder Farbwähler, z. B. die Google-Suche «color picker».

Einige wenige Farben stehen direkt im CSS und nicht im `:root`-Block: Fehlerrot der Formulare (#dc2626), die Punkte für «geöffnet/geschlossen» (#22c55e / #ef4444), die Schneeflocken (#9cc4ff) und die unterste Leiste im Fussbereich (#e7eaff).

**Schriften:** Überschriften in *Barlow Condensed*, Fliesstext in *Inter*, beide von Google Fonts. Festgelegt in `css/style.css` (`--font-head`, `--font-body`) und geladen über den Link zu fonts.googleapis.com in `_quelle/build.py`. Eine andere Schrift braucht beide Stellen: den Namen im CSS und den Link in build.py.

**Schriftgrössen:** Überschriften `h1`, `h2`, `h3` stehen direkt unter dem `:root`-Block (z. B. `h1 { font-size: clamp(2.6rem, 6vw, 4.8rem); }`: mindestens 2.6rem, höchstens 4.8rem, dazwischen passend zur Bildschirmbreite).

**Logo:** `img/logo.png` (958 × 104 Pixel, transparenter Hintergrund). Neues Logo einfach unter demselben Namen ersetzen. Die Anzeigehöhe steht in `css/style.css` bei `.logo img { height: 40px; }` (auf dem Handy 30px).

**Browser-Symbol (Favicon):** `img/favicon.svg`, das Motorrad-Symbol aus dem Logo. **Partner-Logos:** `img/brand-suzuki.png` und `img/brand-sym.png` auf der Startseite.

## Inhalte ändern

Die meisten Inhalte änderst du in der Vorlage der jeweiligen Seite. Einige Angaben stehen an mehreren Stellen; die Tabelle zeigt, wo genau.

| Was | Wo | Hinweis |
| --- | --- | --- |
| Texte einer Seite | `_quelle/pages/<seite>.html` | Text zwischen den Tags ändern, Tags wie `<p>` oder `<h2>` stehen lassen |
| Öffnungszeiten | `_quelle/build.py` → `HOURS_LIST` **und** `js/main.js` → `HOURS` | build.py = angezeigte Liste, main.js = Live-Status «Jetzt geöffnet». Immer beide anpassen |
| Telefon, E-Mail, Adresse | `_quelle/build.py` (Kopfleiste und Fussbereich), `pages/index.html`, `pages/kontakt.html`, `pages/impressum.html` | Suchen und Ersetzen über alle Dateien, z. B. nach «034 461 14 10». Bei Links `tel:+41344611410` mit ändern |
| Instagram-Link | `_quelle/build.py` → `INSTAGRAM` | Gilt für Kopfleiste und Fussbereich |
| Menü | `_quelle/build.py` → `NAV` | Je Eintrag: Dateiname und angezeigter Name |
| Seitentitel und Google-Beschreibung | `_quelle/build.py` → `PAGES` | Titel im Browser-Tab und Text in den Suchergebnissen |
| Fusszeile, Kurztext unter dem Logo | `_quelle/build.py`, Abschnitt `<footer>` | |
| Dienstleistungen (Liste) | `pages/werkstatt.html`, Zeilen mit `class="service-item"` | Die Zahl «14 Dienstleistungen» steht zusätzlich in `werkstatt.html` und in `index.html` |
| Häufige Fragen (FAQ) | `<details>`-Blöcke unten in werkstatt, fahrzeuge, winteraktion | `<summary>` = Frage, `<div class="faq__body">` = Antwort |
| Team | `pages/portrait.html`, Blöcke `class="card team-card"` | Foto quadratisch, ca. 400 × 400 Pixel |
| Geschichte | `pages/portrait.html`, Liste `class="timeline"` | Je Meilenstein ein `<li>` |
| Partner-Links | `pages/portrait.html`, Abschnitt `id="links"` | |
| Rechtstexte | `pages/agb.html`, `pages/impressum.html` | |

**Fotos:** liegen in `img/`. Am einfachsten ersetzt du ein Foto durch eine neue Datei mit genau demselben Namen. Für ein neues Foto die Datei nach `img/` kopieren und in der Vorlage den Dateinamen im `src="img/…"` eintragen. Zudem `alt="…"` mit einer kurzen Bildbeschreibung füllen (wichtig für Google und sehbehinderte Personen). Empfehlung: JPG, ca. 1200 Pixel breit, unter 300 KB.

**Fahrzeuge / Neuheiten:** Jedes Modell ist ein Block `<article class="card vehicle" …>` in `pages/fahrzeuge.html` (alle 11) und `pages/index.html` (6 auf der Startseite). Für ein neues Modell einen bestehenden Block kopieren und anpassen:

- `data-cat="suzuki motorrad"`: steuert die Filter-Knöpfe. Möglich sind `suzuki`, `sym`, `motorrad`, `roller` (auf der Startseite nur `suzuki` / `sym`).
- `<span class="vehicle__tag">`: kleines Etikett oben links (z. B. «Crossover»). `vehicle__tag--new` = blaues Etikett oben rechts (z. B. «Neu»).
- Bild: freigestellte Fahrzeugbilder auf weissem Grund passen direkt. Für ein Foto mit Hintergrund `class="vehicle__img is-photo"` schreiben, dann füllt es die ganze Fläche.
- `vehicle__brand`, `<h3>` (Modellname) und `<p>` (Beschreibung) anpassen.

Nicht mehr aktuelle Modelle löschst du, indem du den ganzen Block von `<article` bis `</article>` entfernst.

## Winteraktion jährlich aktualisieren

Die Daten der Winteraktion (aktuell 1. November 2026 bis 1. März 2027) stehen an mehreren Stellen. Am sichersten suchst du in `_quelle/` nach «2026» und «2027» und passt jeden Treffer an.

- [ ] **Countdown** in `pages/winteraktion.html`: `data-countdown="2027-03-01"` (Ende) und `data-countdown-start="2026-11-01"` (Start), Format JJJJ-MM-TT. Vor dem Start zählt er bis zum Start, danach bis zum Ende.
- [ ] **Texte** in `pages/winteraktion.html`: Kopfbereich («Winteraktion 2026 / 2027», Zeitraum), Hinweis unter dem Countdown, Karte «4 Monate lang», Liste neben dem Formular, FAQ «Wie lange läuft die Aktion?».
- [ ] **Formular** in `pages/winteraktion.html`: Auswahl «Gewünschter Abholzeitraum» (`<select id="w-abholung">`), ein `<option>` pro Monat.
- [ ] **Startseite** `pages/index.html`: Abschnitt «Winteraktion 2026 / 2027» mit dem Zeitraum-Chip «1. Nov. 2026 – 1. März 2027».
- [ ] **Google-Beschreibung** in `_quelle/build.py` → `PAGES`, Eintrag `winteraktion.html`.
- [ ] **Bild** `img/winteraktion.jpg` bei Bedarf durch das neue Aktionsbild ersetzen.

Der Umkreis von 40 km steht ebenfalls mehrfach (Startseite, Winteraktion, `build.py`); bei einer Änderung nach «40 km» suchen.

Ausserhalb der Saison kannst du die Aktion im Menü ausblenden: in `_quelle/build.py` die Zeile `("winteraktion.html", "Winteraktion"),` in `NAV` löschen und auf der Startseite den Abschnitt `<div class="winter-feature …">` entfernen, am besten zusammen mit dem umgebenden section-Block. Die Seite selbst bleibt erreichbar.

## Formulare

Die Webseite hat drei Formulare: Serviceanmeldung (`werkstatt.html`), Anmeldung Winteraktion (`winteraktion.html`) und Kontakt (`kontakt.html`). Alle prüfen die Eingaben selbst und zeigen am Ende eine Zusammenfassung. Die Datumsprüfung der Serviceanmeldung lässt Montag, Sonntag und vergangene Tage nicht zu.

**Versand heute:** Beim Absenden öffnet sich das E-Mail-Programm der Besucherin oder des Besuchers mit einer fertig ausgefüllten Nachricht an info@luedimotos.ch. Wer kein E-Mail-Programm eingerichtet hat, kann so nicht senden.

**Versand ohne E-Mail-Programm einrichten (empfohlen):**

1. Bei einem Formular-Dienst ein Konto eröffnen, z. B. Formspree, oder beim Hoster (Call-Up) nach einem Formular-Skript fragen. Du erhältst eine Adresse, z. B. `https://formspree.io/f/abcd1234`.
2. In den Vorlagen der drei Formulare beim Tag `<form data-form …>` ergänzen: `data-endpoint="https://formspree.io/f/abcd1234"`.
3. Seiten neu erzeugen und hochladen. Die Anfragen kommen dann direkt per E-Mail an. Klappt der Versand nicht, fällt die Seite automatisch auf das E-Mail-Programm zurück.
4. Den Dienst in der Datenschutzerklärung (`pages/impressum.html`, Abschnitt «Externe Dienste») erwähnen.

**Weitere Einstellungen am `<form>`-Tag:** `data-subject="…"` = Betreff der E-Mail. `data-mailto="…"` = andere Empfängeradresse (ohne Angabe: info@luedimotos.ch).

**Felder anpassen:**

- Ein Feld ist ein Block `<div class="field">` mit `<label>`, Eingabefeld und Fehlertext (`<span class="field__error">`). Für ein neues Feld einen Block kopieren und `id`, `for` und `name` eindeutig umbenennen.
- **Pflichtfeld:** `required` ins Eingabefeld schreiben und `<span class="req">*</span>` ins Label.
- **Auswahlkacheln** (z. B. gewünschte Arbeiten): Blöcke `<div class="choice">`. Der Text in `data-value="…"` erscheint in der E-Mail. `data-required-group` am umgebenden Block bedeutet: mindestens eine Kachel wählen.
- **Auswahllisten** (z. B. Marke, Abholzeitraum): je Eintrag eine Zeile `<option>…</option>`.
- **Schritte:** Jeder Schritt ist ein `<fieldset class="form-step">`. Die Beschriftung der Fortschrittsanzeige steht oben im Formular bei `form-progress__label`.
- Die Bestätigung nach dem Absenden steht direkt unter dem Formular im Block `class="form-success"`.

## Fahrzeugangebote, Karte und externe Links

**Fahrzeuge an Lager** (Seite Fahrzeuge, Abschnitt «Aktuelle Angebote») werden wie bisher direkt von motorradhandel.ch geladen. Neue Inserate, Preise und Fotos pflegst du dort; an der Webseite musst du dafür nichts ändern.

| Reiter | Kategorie-Nummer bei motorradhandel.ch |
| --- | --- |
| Neufahrzeuge | 313 |
| Occasionen | 312 |
| Vorführfahrzeuge | 601 |
| Mietfahrzeuge | 600 |

Die Nummern stehen in `js/main.js` bei `const FZL`, die Händlernummer 706 in `pages/fahrzeuge.html` (`data-ui="706"`). Kann das Angebot nicht geladen werden, erscheint nach einigen Sekunden ein Link zu motorradhandel.ch.

**Karte (Kontaktseite):** Google Maps lädt aus Datenschutzgründen erst nach einem Klick auf «Karte laden». Die Kartenadresse steht in `pages/kontakt.html` bei `data-src="…"`, der Link «Route planen» in derselben Datei.

**Externe Links:**

- Suzuki und SYM: im Fussbereich (`_quelle/build.py`), bei den Partner-Logos auf der Startseite und auf der Fahrzeugseite.
- Partner und Verbände: `pages/portrait.html`, Abschnitt `id="links"`. Pro Partner ein Block `<a href="…"><strong>Name</strong><span>Beschreibung</span></a>`.
- Instagram: `_quelle/build.py` → `INSTAGRAM`.

## Checkliste vor dem Hochladen

- [ ] Änderungen in `_quelle/` gemacht, nicht in den fertigen Seiten
- [ ] `python3 _quelle/build.py .` ausgeführt, ohne Fehlermeldung
- [ ] Geänderte Seite im Browser angeschaut, auch in schmaler Fensterbreite (Handy-Ansicht)
- [ ] Bei neuen Bildern: Datei liegt in `img/`, Name im `src` stimmt genau (Gross-/Kleinschreibung beachten)
- [ ] Bei geänderten Öffnungszeiten: `build.py` **und** `js/main.js` angepasst
- [ ] Ein Formular einmal testweise ausgefüllt
- [ ] Änderungen committet und auf GitHub gepusht
- [ ] Geänderte Dateien auf den Webserver hochgeladen; danach im Browser neu laden (Ctrl+F5 bzw. Cmd+Shift+R), damit keine alte Version angezeigt wird

**Häufige Fehler:**

| Problem | Ursache | Lösung |
| --- | --- | --- |
| Änderung verschwindet wieder | Direkt in `index.html` statt in `_quelle/pages/` geändert | In der Vorlage ändern und neu erzeugen |
| Seite sieht nach dem Hochladen unverändert aus | Browser zeigt die gespeicherte alte Version | Ctrl+F5 bzw. Cmd+Shift+R |
| Seite ist ab einer Stelle verschoben oder leer | Ein Tag wie `</div>` wurde beim Bearbeiten mitgelöscht | Letzte Änderung rückgängig machen und nur den Text zwischen den Tags ändern |
| Bild wird nicht angezeigt | Dateiname oder Endung stimmt nicht (`.JPG` statt `.jpg`) | Namen genau angleichen |
| Live-Status «geöffnet» stimmt nicht | Nur die Liste in `build.py` geändert | `HOURS` in `js/main.js` angleichen |
| Fahrzeugangebote fehlen | motorradhandel.ch nicht erreichbar | Später erneut prüfen; der Link zu motorradhandel.ch erscheint automatisch |

**Tipp:** Jede Änderung als eigenen Commit auf GitHub ablegen. Dann lässt sich über die Versionsgeschichte jederzeit zum letzten funktionierenden Stand zurückkehren.
