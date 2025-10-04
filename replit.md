# Syari Language Dictionary Application

## Overview

This is a web-based dictionary application for two constructed languages: "Syari-tatsu-go" (シャリタツ語) and "Kapu-go" (カプ語). The application provides search functionality for language learners to look up words by character composition, reading, or Japanese meaning. It's built as a simple Express.js server that serves static HTML pages with client-side JavaScript for search functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static HTML Pages Pattern**
- The application uses traditional multi-page architecture with separate HTML files for each route
- Rationale: Simple deployment, no build process required, SEO-friendly
- Pages: home.html, syari.html, syari-search.html, kap.html, kap-search.html
- Each page includes its own inline or linked JavaScript for interactivity

**Client-Side Search Logic**
- Search functionality implemented entirely in browser using Fetch API
- Data fetched from JSON files (data.json, full.json, kap-data.json) on demand
- Three search modes: character/alphabet lookup, reading (pronunciation), and Japanese meaning
- Rationale: Reduces server load, enables offline-capable functionality, simpler architecture

**Visual Component System**
- Character builder interface using clickable image components (syari-search.html)
- Images represent language character parts that can be combined
- Parts tracked in arrays and used to filter dictionary entries
- Custom font files for displaying constructed language characters (kap-original.ttf)

### Backend Architecture

**Express.js Static File Server**
- Minimal Node.js server using Express 4.x
- Primary purpose: serve static files and HTML pages
- CORS enabled for cross-origin requests with specific whitelist
- Rationale: Lightweight, simple to deploy, minimal server-side processing needed

**Route Structure**
- Simple route-to-file mapping without MVC framework
- Routes: /, /syari, /kap, /kap/search, /syari/search
- Each route serves corresponding HTML file
- Incomplete search endpoint at `/search/parts/:parts` (backend search feature appears partially implemented)

**Data Storage Strategy**
- JSON files as primary data store (data.json, full.json, kap-data.json)
- No database used - data stored in flat files
- Rationale: Small dataset size, read-only access pattern, simple deployment
- Tradeoff: Not scalable for large datasets, no real-time updates, but sufficient for dictionary use case

### Styling and UI

**Gradient Background Design**
- Linear gradient combining blue, purple, and yellow tones (#E3F2FD → #F3E5F5 → #FFF9C4)
- Consistent color scheme across pages
- Custom Japanese font (Honoka Maru Gothic) for better readability

**Responsive Design**
- CSS clamp() functions for fluid typography
- Mobile-first approach with viewport meta tags
- Container-based layout system

## External Dependencies

### NPM Packages
- **express** (^4.21.2): Web server framework
- **cors** (^2.8.5): Cross-Origin Resource Sharing middleware
- **axios** (^1.7.9): HTTP client (installed but not actively used in shown code)
- **@types/node** (^18.0.6): TypeScript definitions for Node.js

### Static Assets
- Custom font files: honoka-maru.ttf (Japanese font), kap-original.ttf (constructed language font)
- Image assets for language characters stored in /bigimg/ and /img/ directories
- Favicon for browser tab display

### External Services
- CORS whitelist includes:
  - https://syari.onrender.com/ (production deployment)
  - Replit development environment URL
- Google site verification for search console integration

### Data Format
Dictionary entries follow structured JSON format:
- **Syari language**: word key, yomi (reading), imi (meaning), parts (character components), optional fields (gogen/etymology, kaisetu/explanation, reibun/examples)
- **Kap language**: reading, meaning, etymology, examples (kapu/japanese pairs), notes