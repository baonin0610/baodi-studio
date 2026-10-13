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

## 🔗 Live Deployment
- **Repository**: `https://github.com/baonin0610/baodi-studio`
- **Commit**: `814e73d`
- **Live URL**: `https://baonin0610.github.io/baodi-studio/`
