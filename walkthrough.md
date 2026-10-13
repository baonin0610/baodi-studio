# Walkthrough - Fix Auto-Scroll Issue & Add SLSU International Partnership Post

This document summarizes the root cause and fix for the page auto-scrolling behavior, and the integration of the 5th official post from Southern Leyte State University (SLSU).

---

## 🛠️ 1. Root Cause & Fix: Page Auto-Scrolling Every Few Seconds

### Root Cause
- In the initial carousel auto-rotation logic, every 9 seconds `goToCard()` invoked:
  ```javascript
  tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  ```
  In web browsers, calling `element.scrollIntoView(...)` scrolls the **entire browser viewport / document** to reveal that element, causing the window to suddenly jerk/scroll down to the Facebook section even while the user was reading the hero or other parts of the page.

### The Fix
1. **Isolated Inner Horizontal Scroll**:
   - Replaced `tab.scrollIntoView` with container-scoped scrolling:
     ```javascript
     if (tabsContainer && tabsContainer.scrollWidth > tabsContainer.clientWidth) {
         const activeTab = tabs[normalizedIndex];
         if (activeTab) {
             const targetLeft = activeTab.offsetLeft - (tabsContainer.clientWidth / 2) + (activeTab.offsetWidth / 2);
             tabsContainer.scrollTo({ left: targetLeft, behavior: 'smooth' });
         }
     }
     ```
   - This smoothly centers the tab on mobile screens **without ever touching or scrolling the window**.

2. **Viewport-Aware Auto-Play (`IntersectionObserver`)**:
   - Auto-play no longer runs indiscriminately in the background.
   - An `IntersectionObserver` detects when `#fb-carousel-container` is in view (`threshold: 0.2`).
   - If the user is at the top of the page, hero, or other sections, the timer is stopped.
   - It only rotates when the user is actively viewing the Facebook section, and pauses on hover or touch.

---

## 🏛️ 2. New 5th Milestone: Southern Leyte State University (SLSU)

Integrated the official university publication:
- **Title**: *SLSU Advances International Partnerships in Academic, Research, Innovation, Publication, and Extension Programs*
- **URL**: [SLSU Official Publication](https://southernleytestateu.edu.ph/index.php/en/menu-page-home/4450-slsu-advances-international-partnerships-in-academic-research-innovation-publication-and-extension-programs)
- **Key Leadership**: SLSU President Dr. Jude A. Duarte, VP for Academic Affairs Dr. Constantino G. Medilo, Jr., Global Engagement Director Dr. Ingrid M. Uy, and the University of Danang – Software Development Center (UD–SDC) delegation.
- **Topics**: AI innovation, software engineering, co-authored scholarly publications, community extension, and UN Sustainable Development Goals (SDGs 4, 9, 11 & 17).
- **Media Asset**: Added high-resolution photographic dispatch `assets/fb_slsu_advances.jpg`.
- **Navigation Updates**:
  - Tab 05: `Southern Leyte State Univ` (`SLSU • Sogod Campus`)
  - Carousel slide counter updated to `01 / 05`
  - 5 interactive progress dots

---

## 🔗 Live Deployment
- **Repository**: `https://github.com/baonin0610/baodi-studio`
- **Commit**: `7e846d8`
- **Live URL**: `https://baonin0610.github.io/baodi-studio/#facebook-feed`
