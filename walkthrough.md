# Walkthrough - 3D Virtual Exhibition Portfolio Upgrades (Template 11)

This document summarizes the upgrades made to expand the **Template 11 - 3D Virtual Exhibition Portfolio** with canvas particles, dynamic 3D filters, and text scrambling decoder effects.

---

## 🛠️ Upgrades Implemented

### 1. Interactive HTML5 Canvas Particles Background
- Injected a `<canvas id="particle-canvas">` covering the background stage.
- Programmed a particle system running 65 floating stardust nodes with custom drift speeds and fading bounds.
- Wired mouse movement tracking to calculate real-time proximity. Particles within a `130px` radius of the cursor experience a **mouse magnetic repulsion force**, flowing around the pointer like air currents before smoothly returning to their base paths.

### 2. Dynamic 3D Category Filter Sorter
- Appended a category filter block in the bottom HUD: `ALL`, `BRANDING`, `MARKETING`, `DIGITAL`.
- Clicking any tag filters the 6 project cards inside the 3D space:
  - Matching cards stay sharp and visible.
  - Unmatched cards **spin on their Y-axis (185 degrees), recede far back into Z space (-800px), and fade to 4% opacity (`filtered-out` class)**. This creates a gorgeous, volumetric depth-of-field collapse effect.

### 3. Holographic Scramble Text Decoder
- Coded a text scrambling animation method (`scrambleText`) that cycles characters (`A-Z, 0-9, #@$%`) before settling onto the actual string.
- Bound this scrambler to trigger when:
  - Mouse hovers over any card in the 3D grid (scrambling the `.card-name` title).
  - Project detail overlay fades in (deciphering the main project header).

---

## 🧪 Testing and Verification

- Tested desktop trackpad and mouse coordinates to check particle repulsion flows.
- Switched bottom HUD filter tags to verify cards collapse back into the Z-abyss.
- Verified text scrambles correctly on hover and overlay zoom loads.
