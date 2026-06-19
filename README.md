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
- **Supabase** — saints data storage
- **IndexedDB** (`idb`) — bookmarks
- **Phosphor Icons**
- **vite-plugin-pwa** — service worker & manifest

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Build

```bash
npm run build
```

Deploy the `dist/` folder to any static host.

## Data Source

Saint data sourced from [Catholic.org](https://www.catholic.org).
