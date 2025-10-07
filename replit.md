# Syari Language Dictionary Application

## Overview

This is a web-based dictionary application for two constructed languages: "Syari-tatsu-go" (シャリタツ語) and "Kapu-go" (カプ語). The application provides search functionality for language learners to look up words by character composition, reading, or Japanese meaning. Additionally, it includes a materials viewer for displaying study notes and reference images. It's built as a simple Express.js server that serves static HTML pages with client-side JavaScript for search functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static HTML Pages Pattern**
- The application uses traditional multi-page architecture with separate HTML files for each route
- Rationale: Simple deployment, no build process required, SEO-friendly
- Pages: home.html, syari.html, syari-search.html, kap.html, kap-search.html, kap-docs.html
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

**Materials Viewer System** (Added 2025-10-04)
- Dedicated page for viewing study materials and reference notes (kap-docs.html)
- Sidebar + Main area layout with category filtering
- Grid display of material cards with thumbnails
- Modal overlay for full-size image viewing
- Lazy loading for optimized performance
- JSON-based material metadata (kap-materials.json)

### Backend Architecture

**Express.js API Server** (Updated 2025-10-07)
- Minimal Node.js server using Express 4.x
- **API-only server** - frontend separated to GitHub Pages (https://syari3.github.io/syari-frontend)
- Deployed to Render for backend API functionality
- Uses `process.env.PORT || 5000` for flexible port configuration
- CORS enabled for GitHub Pages origin (https://syari3.github.io)
- Rationale: Separation of concerns - API on Render, SEO-optimized static frontend on GitHub Pages

**API Endpoints**
- `GET /data` - Returns complete Syari dictionary data (data.json)
- `GET /kap-data.json` - Returns Kap language dictionary data
- `GET /kap-materials.json` - Returns study materials metadata
- `GET /search/parts/:parts` - Searches Syari words by character parts
- `GET /search/word/:id` - Returns specific word details by ID
- All endpoints return JSON responses

**Data Storage Strategy**
- JSON files as primary data store (data.json, full.json, kap-data.json, kap-materials.json)
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
- Study materials and notes stored in /img/notes/ directory
- Favicon for browser tab display

### Deployment Architecture (Updated 2025-10-07)
- **Backend API**: Deployed to Render (e.g., https://syari-api.onrender.com)
  - API-only Node.js server
  - Serves JSON data endpoints
  - CORS configured for GitHub Pages origin
- **Frontend**: Deployed to GitHub Pages (https://syari3.github.io/syari-frontend)
  - Static HTML, CSS, JavaScript files from public/ folder
  - Fetches data from Render API
  - SEO-optimized for Google search visibility
- Google site verification for search console integration

### Data Format
Dictionary entries follow structured JSON format:
- **Syari language**: word key, yomi (reading), imi (meaning), parts (character components), optional fields (gogen/etymology, kaisetu/explanation, reibun/examples)
- **Kap language**: reading, meaning, etymology, examples (kapu/japanese pairs), notes
- **Materials metadata** (kap-materials.json): id, title, image path, category, description, date