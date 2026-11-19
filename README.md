# Ashish & Pushpanjali — Wedding Invitation

React + Vite wedding invitation for the December 2026 celebrations in Darbhanga, Bihar.

## Run locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

The editable React source is stored as gzip snapshots under `source/`. The prebuild/predev restore script expands the snapshots into `src/` only when those files are absent.

## Main features

- Automatic opening sequence and scrollable invitation
- Grand mandap hero and animated couple names
- Digital invitation card preview
- Expandable bride/groom family cards
- Three event cards with directions and calendar downloads
- Gallery lightbox with previous/next navigation
- Blessing wall saved in the visitor's browser
- RSVP with an initially blank guest-count selection
- Responsive desktop and mobile styling

## Personalise

Edit `src/data/wedding.js`. Add the actual portraits as:

- `public/images/bride-photo.jpg`
- `public/images/groom-photo.jpg`

The current site uses initial/placeholder treatments until those photographs are added.

Add the soundtrack file at `public/audio/ganesh-vandana-inspired-instrumental.mp3` to enable the background music control.

## Demo limitations

RSVP submissions are currently local/copyable only and are not delivered to a server. Blessing messages are saved in each visitor's browser. Autoplay may be blocked by the browser; visitors can use the music control after the page loads.
