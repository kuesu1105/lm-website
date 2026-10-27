# Lüdi Motos AG – Website

Ausführliche Anleitung (Farben, Inhalte, Winteraktion, Formulare): https://claude.ai/artifact/6Zjxza1xrJSbzVEbLz8p4Q

Statische, responsive Website (HTML/CSS/JS, kein Framework). Einfach `index.html` im Browser öffnen
oder den Ordner auf einen beliebigen Webserver hochladen.

## Seiten
| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Begrüssung, Winteraktion, Suzuki-/SYM-Neuheiten mit Filter, Dienstleistungen, Öffnungszeiten (Live-Status) |
| `werkstatt.html` | Alle 14 Dienstleistungen, Ersatz- und Mietfahrzeuge, **Serviceanmeldung in 3 Schritten** |
| `fahrzeuge.html` | 11 Neuheiten mit Filter, Inserate von motorradhandel.ch (Neu, Occasionen, Vorführ, Miete) |
| `winteraktion.html` | Winteraktion mit gratis Abholdienst (40 km, 1.11.2026–1.3.2027), Countdown, **Anmeldung in 3 Schritten** |
| `portrait.html` | Team, Geschichte, Bildergalerie, Anfahrt, Links & Partner |
| `kontakt.html` | Kontaktformular, Öffnungszeiten, Anfahrt, Karte (lädt erst nach Klick) |
| `agb.html`, `impressum.html` | AGB und Impressum (Texte von luedimotos.ch), Datenschutz |

Texte, Fotos, Logo, Öffnungszeiten und Partner-Links stammen von luedimotos.ch.

## Anpassen
- **Farben:** `css/style.css`, ganz oben unter `:root` (Logofarben `--logo-blue`, `--logo-wheel`, `--logo-grey`).
- **Texte ändern:** Seiteninhalte liegen in `_quelle/pages/`, Kopf- und Fussbereich in `_quelle/build.py`.
  Danach neu erzeugen: `python3 _quelle/build.py .`
- **Winteraktion nächstes Jahr:** Daten in `winteraktion.html` (`data-countdown`, `data-countdown-start`, Texte) und auf der Startseite anpassen.
- **Neue Modelle:** Bild nach `img/` legen und eine Karte in `fahrzeuge.html` bzw. `index.html` kopieren.

## Formulare versenden
Ohne Server öffnen die Formulare das E-Mail-Programm mit einer vorausgefüllten Nachricht an
info@luedimotos.ch. Für den Direktversand einen Formular-Dienst (z. B. Formspree) oder ein Server-Script
einrichten und dessen URL als `data-endpoint="…"` beim `<form data-form>` eintragen.

## Hinweise
- Die Fahrzeugangebote werden wie bisher über das Skript von motorradhandel.ch geladen (Händler 706).
  Falls das Laden fehlschlägt, erscheint ein Link zu motorradhandel.ch.
- Ergänzende Texte (Beschreibungen der Dienstleistungen, FAQ, Ablauf-Schritte) sind auf Basis der
  Originalinhalte ausformuliert und sollten kurz gegengelesen werden.
