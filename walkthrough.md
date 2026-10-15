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

## ⚡ Floating Jumping Scroll Guide Indicator (Bottom-Right Corner)

### 1. Motivation
- On initial landing, the founder hero section spans the initial screen viewport height. Visitors might not instinctively know that significant content awaits below (Diplomatic delegations, Facebook dispatches, project templates).
- The user requested a small jumping/bouncing icon in the bottom corner of the screen to guide visitors to scroll down.

### 2. Solutions Implemented
- **Design & Layout (`index.html` & `style.css`)**:
  - Implemented `.floating-scroll-down-btn`: A boutique glassmorphism pill badge (`rgba(18, 16, 14, 0.86)` with `backdrop-filter: blur(14px)` and gold border `rgba(212, 175, 55, 0.38)`).
  - Pinned at the **bottom-right corner** (`bottom: 32px; right: 32px` on desktop, `bottom: 74px; right: 18px` on mobile positioned safely above the mobile bottom nav dock).
  - Features an animated down-arrow SVG with `@keyframes iconJumpBounce` jumping rhythmic downward pulses (dip, bounce, rest every 1.8s) paired with a breathing gold glow (`@keyframes scrollPillPulse`).
- **Interactive Smooth Scroll (`script.js`)**:
  - Clicking the button triggers `scrollToSection('delegation-gallery')` with sticky header offset correction.
  - As the user scrolls down past the hero section (`window.pageYOffset > 100px`), the button automatically and gracefully fades out (`.is-hidden`).
  - If the user scrolls back to the very top, the button smoothly fades back in.
- **Cache-Busting Update**:
  - Bumped to `v=3.4` (`style.css?v=3.4` and `script.js?v=3.4`).

---

## ✨ 5 Modern Luxury Animations Suite (Elite Editorial Experience)

### 1. Liquid Metallic Gold Shimmer
- **Elements**: `.founder-hero-name .accent-text` ("Bao Duy"), `.logo span` ("Studio"), `.drawer-logo span`, `.footer-logo span`.
- **Effect**: Multi-stop metallic gold & champagne gradient moving dynamically across typography (`@keyframes metallicGoldSheen`), resembling polished metal reflecting gallery lights.

### 2. Golden Border Beam / Sweeping Sheen
- **Elements**: `.founder-badge`, `.gallery-badge`, `.hub-badge`, `.fb-section-badge`, `.drawer-badge`.
- **Effect**: A slim, angled ribbon of golden light glides across the pill badge borders every 5.5 seconds (`@keyframes badgeSheenSweep`), creating high-end tactile allure without visual clutter.

### 3. Mouse-Tracking Spotlight Glow
- **Elements**: `.founder-credentials-grid`, `.founder-card-meta`, `.delegation-stage`, `.templates-hub-banner`.
- **Effect**: Smooth radial spotlight (`340px circle at var(--mouse-x) var(--mouse-y)`) follows the cursor across card surfaces via `requestAnimationFrame` throttled calculations, reproducing signature Apple Pro and Linear dark-mode interfaces.

### 4. Subtle 3D Parallax Tilt
- **Elements**: `.founder-visual-card` (Avatar frame, rotating dashed ring, and Founder identity meta-card).
- **Effect**: Interactive 3D spatial rotation (max 4.5 degrees) responsive to cursor coordinates on non-touch screens with `cubic-bezier(0.16, 1, 0.3, 1)` spring release.

### 5. Cinematic Scroll Stagger Reveal with Blur
- **Elements**: All section headers, delegation stage, filmstrip, Facebook feed container, and templates banner.
- **Effect**: Elements glide upward smoothly (`translateY(32px) -> 0`) while transitioning from softened optical blur into crisp sharpness (`filter: blur(8px) -> blur(0)`), creating an editorial, museum-grade exhibition experience.

---

## 🔗 Live Deployment
- **Repository**: `https://github.com/baonin0610/baodi-studio`
- **Latest Commit**: `03fd884`
- **Live URL**: `https://baonin0610.github.io/baodi-studio/`



