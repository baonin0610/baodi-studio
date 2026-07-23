# Walkthrough - 3D Virtual Exhibition Portfolio Details Overlay Subpages (Template 11)

This document summarizes the upgrades made to expand **Template 11 (3D Virtual Exhibition Room)** with a dynamic subpage navigation slider inside the details overlay, creating a multi-page presentation experience.

---

## 🛠️ Upgrades Implemented

### 1. Dynamic Subpage Overlay Structure
- Replaced the previous separate static layout blocks in `index.html` with a unified dynamic layout under `#overlay-slides-container`.
- Integrated a subpage navigation bar (`.overlay-page-nav`) containing **PREV** and **NEXT** buttons alongside a page count indicator (`PAGE 0X / 0Y`).

### 2. Multi-page Specifications Data Store
- Declared a multi-page dataset (`cardDetailsData`) in `script.js` mapping all 8 cards to a **3-page presentation sequence**:
  - **Card 1: Owner Bio Profile**:
    - Page 1: Biography & Core Experience Summary
    - Page 2: National Economics University (NEU) Graduation Logs
    - Page 3: Marketing KPIs, Outbound Funnel values & Core Values
  - **Card 2: Career Experience Logs**:
    - Page 1: ABC Corporation SEO & Lead Generation Manager details
    - Page 2: DEF Digital Agency Content Marketing Specialist logs
    - Page 3: Freelance Consultant foundations
  - **Cards 3 to 8 (Projects 1 to 6)**:
    - Page 1: Project Overview & Main category specs
    - Page 2: Keyword gap strategy & Planning executions
    - Page 3: Conversion results, delivered assets & CTR metrics

### 3. Transition Animations & Decoders
- Coded CSS slide-ups and opacity transitions using the `.slide-fade-out` class.
- When shifting pages inside the overlay, the layout fades and trundles down, updates specifications and labels, triggers the holographic scrambling text decoder (`scrambleText`) to reveal the new subpage title, and fades back in cleanly.
- Updated the right panoramic visual image frame to transition images smoothly alongside the text content.

---

## 🧪 Testing and Verification

- Opened all 8 cards in the 3D room grid to check that the details overlay correctly initiates on Page 01.
- Toggled the next and prev subpage navigation buttons, ensuring they correctly disable when reaching bounds (first/last page).
- Verified that images and dynamic action CTA button text (e.g. Email connection, phone dialer, live preview links) adjust accurately per subpage.
- Pushed changes successfully to production.
