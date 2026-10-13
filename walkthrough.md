# Walkthrough - Interactive Facebook Post Carousel with University Tabs

This document details the transformation of the vertical Facebook Feed into an **Interactive Horizontal Slider / Carousel** featuring **University Tabs**, directional arrow navigation, live slide counter, touch gestures, and auto-rotation.

---

## 🚀 Key Improvements Implemented

### 1. Interactive University Tab Navigation Bar (`.fb-carousel-nav`)
- Created a top navigation bar directly above the Facebook post viewport:
  - **Tab 01**: `Western Leyte College` (WLC • Ormoc City)
  - **Tab 02**: `BiPSU University` (STCS • Naval, Biliran)
  - **Tab 03**: `Leyte Normal University` (DIGITS • Tacloban)
  - **Tab 04**: `Visayas State University` (VSU • Baybay City)
- Features:
  - Active pill highlight with glow effect and number badge (`01`, `02`, `03`, `04`).
  - Smooth auto-scroll to keep active tab centered during touch navigation on mobile.
  - Live slide counter (`01 / 04`).
  - Next / Previous circular arrow buttons with hover and active states.

### 2. Single-Post Carousel Viewport (`#fb-cards-viewport`)
- Eliminated vertical scrolling: Displays **1 prominent card at a time** instead of 4 vertically stacked cards.
- Retained the complete Facebook post layout:
  - High-resolution campus photography on the left with location pill tags.
  - Author info, verified badge, dispatch timestamp, formatted post content, hashtag pills, interactive Like/Reaction counters, and verified Facebook link buttons on the right.
- Smooth CSS keyframe transitions (`fbSlideInNext` & `fbSlideInPrev`) delivering directional slide animation.

### 3. Gesture Controls & Smart Playback (`script.js`)
- **Touch Swipe**: Full horizontal swipe support on touch screens (smart threshold detecting horizontal gestures).
- **Auto-Play**: Automatically advances every 9 seconds, with intelligent pause-on-hover and pause-on-touch.
- **Keyboard Navigation**: Left/Right arrow keys allow immediate slide switching.
- **Spotlight Integration**: Clicking photo spotlight thumbnails or external post targets smoothly jumps the carousel to that specific university card (`window.jumpToFacebookCard`).

---

## 📱 Mobile & Responsive Experience
- Responsive breakpoints handle horizontal tab scrolling on screens under 880px and 768px.
- Compact layout on mobile devices ensures zero page jumping or awkward layout reflow.

---

## 🔗 Live Deployment
- **Repository**: `https://github.com/baonin0610/baodi-studio`
- **Commit**: `abec2fe`
- **Live URL**: `https://baonin0610.github.io/baodi-studio/#facebook-feed`
