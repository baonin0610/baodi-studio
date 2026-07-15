# Walkthrough - Horizontal Parallax Exhibition Expansion (Template 10)

This document summarizes the changes made to expand **Template 10 (Creator - Bui Linh Chi)** with three new dynamic slides (extending it to 12 slides total) and implementing customized CSS animations.

---

## 🛠️ Upgrades Implemented

### 1. Slide Expansion (From 9 to 12 Slides)
- Appended three new high-end editorial slides at the back of the horizontal track:
  - **Slide 9: Client Feedback (Reviews)**: Featuring testimonials from marketing directors, styled with a vertical left accent bar that expands on hover.
  - **Slide 10: Strategic Methodology (Workflow)**: Detailing a 4-step execution plan (Audit, Strategy, Execution, Optimize) in a clean, staggered timeline grid that slides horizontally on hover.
  - **Slide 11: Visual Creatives (Collage Gallery)**: A layered asymmetrical image collage of photography assets. Individual images slide and pop to the front in Z-space when hovered.
  - **Slide 12: Contact / Connect**: Renumbered the final contact slide to slide 12.

### 2. Expanded Table of Contents Menu Mapping
- Updated the **TOC Index list** on Slide 2 (Index) to support 8 main menu items representing all 12 slides.
- Updated the click mapping array in `script.js` so that clicking any index item performs a smooth 3D curved slide jump to the corresponding section.

### 3. Dynamic Color Variable Themes
- Declared custom background, text, accent, and dashed border variables for slides 9, 10, 11, and 12 in `style.css` (featuring charcoal dark, sand cream, forest green, and terracotta burgundy).
- Ambient glowing orbs and outline typography automatically adapt colors as these slides pass the viewport center.

---

## 🧪 Testing and Verification

- Tested horizontal scroll track lengths to ensure LERP physics, top progress bar HUD width, and active slide selectors scale dynamically for 12 slides.
- Verified that mobile devices correctly disable 3D cylinder translations and stack all 12 pages vertically.
- Successfully pushed all changes to GitHub Pages.
