# Ashish & Pushpanjali — Cinematic Wedding Invitation

React + Vite wedding invitation for the December 2026 celebrations. The existing names, family details, event dates, venue names, Hindi details and gallery source data are preserved from the project.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Cinematic intro

Royal doors → envelope with golden wax seal → interactive scratch-heart (mouse/touch) with tap-to-reveal fallback → invitation reveal → main website. Guests can skip the intro. Completion is remembered for the current tab session.

## Existing functionality retained

- Countdown to the December 9, 2026 wedding date
- Event cards, map directions and calendar downloads
- Gallery lightbox with next/previous and keyboard support
- Bride/groom and family details
- Local blessing wall
- RSVP preview with a blank guest-count selection and copyable response
- Background music control

## Important current limitations

- The inspected source has no event timings. No times have been invented.
- The stored venue data in the existing project is in Darbhanga, Bihar. The task text also mentions Jhargram, West Bengal; this is a conflict that must be verified before sending invitations.
- RSVP currently prepares a copyable response; no server submission or guest-management database was present in the source.
- Blessings are stored in each visitor's browser only.
- No QR guest check-in or unique guest links were found in the inspected source.
- Replace the portrait placeholders with actual photographs at `public/images/bride-photo.jpg` and `public/images/groom-photo.jpg`.
- Browsers may block autoplay; use the visible music control if playback does not start automatically.
