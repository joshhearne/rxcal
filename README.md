# RxCal

A privacy-first medication schedule generator with calendar export. Built for anyone managing short-term prescriptions — for yourself, your kids, your parents, or your pets.

**[Live App →](https://rxcal.app)**

---

## Features

- **Single Medication** — schedule any medication by total doses or number of days, with temperature checkpoints
- **Fever Reduction** — alternate up to three medications (e.g. Tylenol / Motrin) in round-robin rotation with configurable intervals and temperature checkpoints
- **Advanced Intervals** — per-medication repeat intervals for mixed-protocol rotation (e.g. Tylenol every 4h, Motrin every 6h)
- **Calendar Export** — generates a `.ics` file compatible with Apple Calendar, Google Calendar, Outlook, and Samsung Calendar
- **Printable Schedule** — color-coded print layout with temperature write-in fields; grayscale-friendly for black & white printers
- **Notes** — freeform notes field with Markdown support for doctor instructions, allergies, or special directions
- **Prescribed To** — attach a patient name to the schedule, print header, and calendar events
- **°F / °C toggle** — Fahrenheit or Celsius temperature tracking
- **Share / Copy Link** — encode the full schedule into a URL for sharing with another caregiver
- **Zero data collection** — everything runs entirely in the browser; no data is ever sent to a server

---

## Privacy

RxCal has no backend, no database, no analytics, and no accounts. All schedule generation happens client-side in JavaScript. Closing the tab discards everything. The `.ics` file is generated locally and never uploaded anywhere.

---

## Deployment

RxCal is a single static HTML file with no build step, no dependencies, and no npm.

### Cloudflare Pages

1. Fork this repository
2. In Cloudflare Pages, create a new project and connect your fork
3. Set build command to _(none)_ and output directory to `/`
4. Deploy

### Any static host

Upload `index.html` to any static file host (Netlify, GitHub Pages, S3, etc.). No configuration needed.

### Local

```bash
git clone https://github.com/jhearne/rxcal.git
cd rxcal
open index.html
```

---

## Development

There is no build process. Edit `index.html` directly. All HTML, CSS, and JavaScript live in a single file by design — keeping it simple to audit, fork, and self-host.

---

## Roadmap / Contributing

Pull requests welcome. Some ideas not yet implemented:

- Weight-based dosing suggestions for common OTC medications
- Recurring `.ics` event support (RRULE) for long-term medications
- PWA / home screen installable version

---

## License

MIT — see [LICENSE](LICENSE)

---

*Built by [HearneTech](https://hearnetech.com)*
