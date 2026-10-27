#!/usr/bin/env python3
"""Assembles static pages: shared layout + page bodies + inline icons."""
import re
import sys
from pathlib import Path

SRC = Path(__file__).parent / "pages"
OUT = Path(sys.argv[1])

S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
ICONS = {
    "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    "pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "arrow": '<path d="M5 12h14M13 5l7 7-7 7"/>',
    "check": '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    "tick": '<path d="M20 6 9 17l-5-5"/>',
    "wrench": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    "tire": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>',
    "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    "gauge": '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
    "bike": '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h3l2 4M5.5 17.5 9 10h6l3.5 7.5M9 10l-1-3H5"/>',
    "snow": '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/><path d="m9 4 3 3 3-3M9 20l3-3 3 3M4 9l3 3-3 3M20 9l-3 3 3 3"/>',
    "truck": '<path d="M10 17h4V5H2v12h3M14 9h4l4 4v4h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    "battery": '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M7 10v4M11 10v4"/>',
    "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    "star": '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    "helmet": '<path d="M3 15a9 9 0 0 1 18 0v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 6v5h9"/>',
    "scooter": '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 18h6M18 15l-3-10h-3M15 5h3M6 15h6l3-4"/>',
    "drop": '<path d="M12 2.7 6.3 8.4a8 8 0 1 0 11.4 0z"/>',
    "cog": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    "tag": '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
    "sparkle": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    "up": '<path d="M18 15l-6-6-6 6"/>',
    "map": '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/>',
    "send": '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    "home": '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    "award": '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    "wash": '<path d="M7 16.3c2.2 0 4-1.8 4-4 0-1.1-.6-2.2-1.6-3.1L7 7 4.6 9.2C3.6 10.1 3 11.2 3 12.3c0 2.2 1.8 4 4 4z"/><path d="M12.6 5.4 15 3l2.4 2.4c1 1 1.6 2.1 1.6 3.3a4 4 0 0 1-6 3.4"/><path d="M14 18.3c1.7 0 3-1.3 3-3 0-.8-.4-1.6-1.1-2.3L14 11l-1.9 2c-.7.7-1.1 1.5-1.1 2.3 0 1.7 1.3 3 3 3z"/>',
    "key": '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    "store": '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8M10 21v-5h4v5"/>',
    "shirt": '<path d="M20.4 6.6 16 4l-1 1a4 4 0 0 1-6 0L8 4 3.6 6.6a1 1 0 0 0-.4 1.3l1.6 3a1 1 0 0 0 1.2.5L7 11v10h10V11l1 .4a1 1 0 0 0 1.2-.5l1.6-3a1 1 0 0 0-.4-1.3z"/>',
    "parking": '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    "train": '<rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 11h16M8 20l-2 2M16 20l2 2M8 16h.01M16 16h.01"/>',
    "school": '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    "instagram": '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
}

NAV = [
    ("index.html", "Home"),
    ("werkstatt.html", "Dienstleistungen"),
    ("fahrzeuge.html", "Fahrzeuge"),
    ("winteraktion.html", "Winteraktion"),
    ("portrait.html", "Über uns"),
    ("kontakt.html", "Kontakt"),
]

PAGES = [
    ("index.html", "Lüdi Motos AG – Motorrad- und Rollerspezialist in Schafhausen i.E.",
     "Lüdi Motos AG in Schafhausen i.E.: offizieller Partner von Suzuki und SYM, Service und Reparaturen aller Marken, Spezialist für Moto Guzzi und Yamaha. Winteraktion mit gratis Abholdienst."),
    ("werkstatt.html", "Dienstleistungen & Serviceanmeldung | Lüdi Motos AG",
     "Service und Wartung aller Marken, Pneuservice, MFK-Bereitstellung, Unfallreparaturen inkl. Versicherungsabwicklung, Oldtimer, Umbauten, Miet- und Ersatzfahrzeuge. Jetzt online einen Servicetermin anmelden."),
    ("fahrzeuge.html", "Fahrzeuge – Neuheiten & Angebote | Lüdi Motos AG",
     "Neue Suzuki- und SYM-Modelle, Neufahrzeuge, Occasionen, Vorführ- und Mietfahrzeuge bei Lüdi Motos AG in Schafhausen i.E."),
    ("winteraktion.html", "Winteraktion mit gratis Abholdienst | Lüdi Motos AG",
     "Vom 1. November 2026 bis 1. März 2027 holen wir dein Motorrad oder deinen Roller im Umkreis von 40 km gratis ab. Jetzt zur Winteraktion anmelden."),
    ("portrait.html", "Über uns – Team & Geschichte | Lüdi Motos AG",
     "Lüdi Motos seit 1969: Team, Geschichte und Anfahrt. Ehemalige Yamaha- und Moto-Guzzi-Vertretung, heute Partner von Suzuki und SYM."),
    ("kontakt.html", "Kontakt & Öffnungszeiten | Lüdi Motos AG",
     "Kontakt, Öffnungszeiten und Anfahrt zu Lüdi Motos AG, Goldbachstrasse 8, 3415 Schafhausen i.E."),
    ("agb.html", "AGB | Lüdi Motos AG", "Allgemeine Geschäftsbedingungen der Lüdi Motos AG."),
    ("impressum.html", "Impressum & Datenschutz | Lüdi Motos AG", "Impressum und Datenschutz der Lüdi Motos AG."),
]

HOURS_LIST = """<ul class="hours">
            <li data-day="1"><span>Montag</span><span class="closed">geschlossen</span></li>
            <li data-day="2 3 4 5"><span>Dienstag – Freitag</span><span>08:00 – 12:00<br>13:00 – 18:15</span></li>
            <li data-day="6"><span>Samstag</span><span>09:00 – 15:00</span></li>
            <li data-day="0"><span>Sonntag</span><span class="closed">geschlossen</span></li>
          </ul>"""

LOGO = '<img src="img/logo.png" alt="Lüdi Motos" width="958" height="104">'
INSTAGRAM = "https://www.instagram.com/ludimotosag/"


def icon(name):
    return f"<svg {S}>{ICONS[name]}</svg>"


def render(text):
    text = text.replace("{{logo}}", LOGO).replace("{{instagram}}", INSTAGRAM)
    text = text.replace("{{hours}}", HOURS_LIST)
    return re.sub(r"\{\{icon:(\w+)\}\}", lambda m: icon(m.group(1)), text)


def layout(fname, title, desc, body):
    links = []
    for f, label in NAV:
        active = ' is-active" aria-current="page' if f == fname else ""
        links.append(f'          <a class="nav__link{active}" href="{f}">{label}</a>')
    nav = "\n".join(links)
    return f"""<!doctype html>
<html lang="de-CH">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="img/winteraktion.jpg">
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
</head>
<body>
  <a class="sr-only" href="#main">Zum Inhalt springen</a>

  <div class="topbar">
    <div class="container">
      <span class="status-pill" data-open-status><span class="status-dot"></span><span class="status-text">Öffnungszeiten</span></span>
      <div class="topbar__links">
        <a href="tel:+41344611410">{{{{icon:phone}}}}034 461 14 10</a>
        <a class="hide-sm" href="mailto:info@luedimotos.ch">{{{{icon:mail}}}}info@luedimotos.ch</a>
        <a class="hide-sm" href="{{{{instagram}}}}" target="_blank" rel="noopener">{{{{icon:instagram}}}}@ludimotosag</a>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container">
      <a class="logo" href="index.html" aria-label="Lüdi Motos AG – Startseite">{{{{logo}}}}</a>
      <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="nav"><span></span></button>
      <nav class="nav" id="nav" aria-label="Hauptnavigation">
{nav}
          <a class="btn" href="werkstatt.html#termin">Service buchen</a>
      </nav>
    </div>
  </header>

  <main id="main">
{body}
  </main>

  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="logo" href="index.html" aria-label="Lüdi Motos AG – Startseite">{{{{logo}}}}</a>
        <p style="margin-top:20px">Dein Motorrad- und Rollerspezialist für alle Marken im Emmental. Offizieller Partner von Suzuki und SYM.</p>
        <div class="socials">
          <a href="{{{{instagram}}}}" target="_blank" rel="noopener" aria-label="Instagram">{{{{icon:instagram}}}}</a>
          <a href="mailto:info@luedimotos.ch" aria-label="E-Mail">{{{{icon:mail}}}}</a>
          <a href="tel:+41344611410" aria-label="Telefon">{{{{icon:phone}}}}</a>
        </div>
      </div>
      <div>
        <h4>Navigation</h4>
        <ul>
          <li><a href="werkstatt.html">Dienstleistungen</a></li>
          <li><a href="fahrzeuge.html">Fahrzeuge &amp; Angebote</a></li>
          <li><a href="winteraktion.html">Winteraktion</a></li>
          <li><a href="portrait.html">Über uns</a></li>
          <li><a href="portrait.html#links">Links &amp; Partner</a></li>
          <li><a href="https://moto.suzuki.ch/" target="_blank" rel="noopener">Suzuki</a> · <a href="http://www.symmotos.ch/" target="_blank" rel="noopener">SYM</a></li>
        </ul>
      </div>
      <div>
        <h4>Kontakt</h4>
        <ul>
          <li>Lüdi Motos AG<br>Goldbachstrasse 8<br>3415 Schafhausen i.E.</li>
          <li><a href="tel:+41344611410">034 461 14 10</a></li>
          <li><a href="mailto:info@luedimotos.ch">info@luedimotos.ch</a></li>
        </ul>
      </div>
      <div>
        <h4>Öffnungszeiten</h4>
        {{{{hours}}}}
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span>© <span data-year>2026</span> Lüdi Motos AG · Alle Rechte vorbehalten</span>
        <span><a href="impressum.html">Impressum</a> · <a href="impressum.html#datenschutz">Datenschutz</a> · <a href="agb.html">AGB</a></span>
      </div>
    </div>
  </footer>

  <button class="to-top" aria-label="Nach oben">{{{{icon:up}}}}</button>
</body>
</html>
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for fname, title, desc in PAGES:
        body = (SRC / fname).read_text(encoding="utf-8")
        html = render(layout(fname, title, desc, body))
        leftover = re.findall(r"\{\{[^}]+\}\}", html)
        if leftover:
            sys.exit(f"{fname}: unresolved placeholders {leftover}")
        (OUT / fname).write_text(html, encoding="utf-8")
        print("built", fname)


if __name__ == "__main__":
    main()
