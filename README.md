# Sanctus

A Catholic saints directory — single-page overlay-based PWA with 5,795 saints. Search, bookmark, and explore saint biographies with offline support.

## Features

- **5,795 saints** with biographies, feast days, patronage, and images
- **Search** with debounced input across names, patronage, and origin
- **Bookmarks** persisted in IndexedDB
- **Saint of the Day** — daily featured saint
- **PWA** — installable, caches images for offline access
- **Desaturated grid** — hover to reveal full color
- **Hide-on-scroll header** — scroll down to hide nav, up to show

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4**
- **Static JSON** (`public/saints.json`) — saints data, served from the CDN and precached for offline
- **IndexedDB** (`idb`) — bookmarks
- **Phosphor Icons**
- **vite-plugin-pwa** — service worker & manifest

## Getting Started

```bash
npm install
npm run dev
```

No environment variables or backend required — all saint data is bundled in `public/saints.json`.

## Build

```bash
npm run build
```

Deploy the `dist/` folder to any static host.

## Data Source

Saint data sourced from [Catholic.org](https://www.catholic.org).
