# Walkthrough - Permanent Resolution for Auto-Scrolling & Cache Invalidation

This document details the complete elimination of auto-scrolling issues and cache-busting deployment.

---

## 🛠️ Root Causes & Final Fixes

### 1. Browser Script Caching (`script.js?v=2.2`)
- **Issue**: In `index.html`, `script.js` was loaded with `?v=2.2`. Even after removing `tab.scrollIntoView`, visitors' browsers were still executing the **cached old version of `script.js`** containing the 9-second `scrollIntoView` call.
- **Fix**: Bumped cache version query to `?v=3.2` on both `script.js` and `style.css`. Every browser is now forced to fetch the latest code immediately.

### 2. URL Hash Anchor Snapping (`#facebook-feed`)
- **Issue**: When users visited the site with `#facebook-feed` in their browser address bar, modern browser scroll-anchoring algorithms periodically re-anchored to the hash upon DOM mutations or reflows.
- **Fix**: Added silent history cleanup on page load:
  ```javascript
  if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  ```

### 3. Removal of Auto-Play Timers on Facebook Post Feed
- **Issue**: Automated rotation on reading articles interrupts reading and triggers background layout events.
- **Fix**: Completely removed `setInterval` / auto-play from `initFacebookPostsCarousel()`. The Facebook post carousel now **only changes when the user explicitly clicks a tab, clicks an arrow (`<` or `>`), or swipes on mobile**. It will never move on its own when leaving the page still.

### 4. Delegation Visual Gallery Observer Guard
- Added `IntersectionObserver` to `#delegation-gallery` so its carousel timer only runs when the gallery is actively in view, preventing any layout reflow triggers while reading at the top of the page.

---

## 🧭 Unified ScrollSpy Engine & Mobile Navigation Tracking

### 1. Root Cause
- **Desktop Navbar**: Previously had zero scroll listener attached to `.site-header .nav-links .nav-link`. The `active` class was statically placed on `About` and never updated as the user scrolled through the page.
- **Mobile Bottom Nav**: Had duplicate tabs ("Home" and "About") both attempting to target the same hero section, and used fragile `offsetTop` math that broke across nested main layouts.
- **Anchor Offset**: Section headers were getting tucked under the sticky header when jumping directly to an anchor link.

### 2. Solutions Implemented
- **Unified ScrollSpy Engine (`script.js`)**:
  - Automatically synchronizes **Desktop Header Links**, **Mobile Drawer Links**, and **Mobile Bottom Nav Dock** simultaneously.
  - Uses `getBoundingClientRect()` with a bottom-to-top detection algorithm and a `90px` sticky-header offset, running at 60fps via `requestAnimationFrame` and passive event listeners.
  - Automatically highlights the active section in real-time as user scrolls between:
    1. **About Developer** (`#about-developer` / `#hero-section`)
    2. **Delegations** (`#delegation-gallery`)
    3. **Facebook Dispatches** (`#facebook-feed`)
- **Streamlined Mobile Bottom Dock (`index.html`)**:
  - Replaced the duplicate "Home" tab with 4 dedicated, balanced actions: **About**, **Delegations**, **Facebook**, and **Projects** (`templates.html`).
  - Active tab text and icon highlighted in accent gold `#d4af37`.
- **Sticky Offset Margins (`style.css`)**:
  - Added `scroll-margin-top: 85px` on `#hero-section`, `#about-developer`, `#delegation-gallery`, and `#facebook-feed` so smooth scroll landing positions are unobstructed by the fixed header.
- **Cache-Busting Update**:
  - Updated asset version to `v=3.3` (`style.css?v=3.3` and `script.js?v=3.3`).

---

## 🔗 Live Deployment
- **Repository**: `https://github.com/baonin0610/baodi-studio`
- **Latest Commit**: `f32748e`
- **Live URL**: `https://baonin0610.github.io/baodi-studio/`

