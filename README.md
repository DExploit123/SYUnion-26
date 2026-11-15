# Royal Wedding Website: Samuel Onasanya & Akinlolu Yemisi

An elegant, mobile-first wedding web application celebrating the holy matrimony of **Samuel Onasanya** and **Akinlolu Yemisi** on **December 12, 2026**.

Featuring an interactive 3D interlocking gold rings hero with realistic PBR reflections and floating particles, live countdown, alternating love story timeline, ceremony & reception schedule with Google Maps directions & calendar synchronization, a three-row infinite marquee gallery, and a full-featured RSVP system.

---

## 🎨 Fast Customization Guide (`weddingConfig.ts`)

All text, dates, venue addresses, photographs, colors, and RSVP settings are centralized in **one single configuration file**:
👉 `src/config/weddingConfig.ts`

### 1. Updating Names, Dates & Verses
Open `src/config/weddingConfig.ts` and update the `couple` and `date` objects:
```typescript
couple: {
  groomFirst: "Samuel",
  groomFull: "Samuel Onasanya",
  brideFirst: "Yemisi",
  brideFull: "Akinlolu Yemisi",
  hashtag: "#ForeverSamuelYemisi",
  // ...
},
date: {
  targetIso: "2026-12-12T10:00:00",
  displayDate: "December 12, 2026",
  // ...
}
```

### 2. Changing Venues & Schedule
In `src/config/weddingConfig.ts`, update `schedule`:
- `venue`: Venue name (e.g., The Cathedral Church of Christ)
- `address`: Full street address
- `time`: Time window
- `mapUrl`: Google Maps URL for the "Get Directions" button
- `startTime` / `endTime`: ISO timestamps for Google Calendar & iCalendar export

### 3. Swapping Photographs
Place your new `.jpg` or `.png` images in `/src/assets/images/` and update the paths in `weddingConfig.ts`:
- **Love Story**: `loveStory[].image`
- **Marquee Gallery**: `gallery.row1`, `gallery.row2`, and `gallery.row3`

### 4. Updating the Color Palette & Dress Code
In `weddingConfig.ts`, you can adjust the `palette` and `dressCode` swatches:
- Deep Royal Purple: `#120826` / `#1B0A33`
- Soft Lilac: `#C8B6FF`
- Champagne Gold: `#D4AF37` / `#F3E5AB`
- Off-White: `#FBF9F5`

### 5. Customizing Registries & Cash Donations
In `weddingConfig.ts`, customize the `registry` section:
- **Gift Registries**: Update URLs for Zola, Honeyfund, and Amazon.
- **Cash Gifts & Bank Wire**: Update bank names, account names, account numbers, sort codes, and Cash App/Zelle handles. The website features automatic 1-click clipboard copy for guests!

### 6. Connecting the RSVP Form
By default, RSVPs are saved to the included Express server API (`/api/rsvp`) and cached in browser `localStorage`.
To connect to an external service:
- **Google Sheets**: Create a Google Apps Script Webhook and set `googleSheetsWebhookPlaceholder` or update the fetch destination in `src/components/RsvpForm.tsx`.
- **Supabase / Firebase**: Call your client SDK directly in `RsvpForm.tsx` within `handleSubmit`.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the wedding website.

---

## 📱 Features Included
- **3D Hero**: Procedural interlocking gold rings with realistic studio reflections via `RoomEnvironment`, diamond solitaire mount, particle system, and scroll-linked rotation.
- **Live Countdown**: Tabular countdown to December 12, 2026 in gold-outlined boxes.
- **Love Story**: Alternating timeline with photographs and milestones.
- **Wedding Schedule**: Ceremony & reception cards with Google Maps and downloadable `.ics` calendar files.
- **Dress Code Swatches**: Visual color swatches with guidelines for guests.
- **3-Row Marquee Gallery**: Infinite horizontal sliding photo rows in alternating directions (left, right, left) with pause on hover and lightbox zoom.
- **RSVP with Confetti**: Input validation, guest count selector, dietary preferences, and festive celebration state.
- **Host Dashboard**: Discreet bottom corner toggle to view real-time attendee statistics and export CSV guest lists.
- **Background Music**: Procedural soothing acoustic harp / Canon in D chime arpeggios via Web Audio API (off by default).
