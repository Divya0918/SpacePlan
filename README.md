# SpacePlan – 3D Interior Design SaaS Platform

> **Tagline:** "Design Your Space. Visualize Your Future."  
> **Platform:** Production-grade 3D Interior Design SaaS Landing Page & Studio Customizer.

---

## 1. Project Overview

**SpacePlan** is a high-performance, web-based 3D interior design SaaS marketing platform that empowers homeowners, architects, and interior designers to visualize, customize, and plan living spaces before committing to real-world renovations.

Through interactive browser-based 3D visualization, users can explore room layouts, arrange designer furniture, experiment with wall colors and material swatches, simulate authentic solar daylight conditions, and walk through their dream rooms in real-time WebGL.

This repository contains the complete frontend implementation built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Three.js**, and **Framer Motion**.

---

## 2. Key Features & Implemented Website Sections

### A. Navigation Bar (`Navbar.tsx`)
- **Sticky Blur Header:** Retains clean glassmorphism backdrop blur on scroll.
- **Brand Identity:** Custom geometric 3D isometric house/cube icon in terracotta and dark moss green.
- **Section Spy:** Automatically tracks active viewport section and highlights navigation links (`Home`, `Features`, `How It Works`, `3D Preview`, `Pricing`, `About`, `Contact`).
- **Smooth Scrolling:** Fluid scroll transitions with offset calculation to prevent header occlusion.
- **Responsive Mobile Navigation:** Full-featured animated slide-down hamburger drawer.
- **Direct CTA:** "Get Started" button navigates smoothly to the demo request suite.

### B. Hero Section (`Hero.tsx`)
- **Main Headline:** *"Your Room. Your Rules. Your Vision."*
- **Supporting Description:** Clear product value proposition highlighting zero CAD learning curve.
- **Primary & Secondary CTAs:** "Start Designing Free" (launches 3D room preview) and "Explore Features".
- **Visual Composition:** 2-column layout with high-definition interior imagery.
- **Floating Glassmorphic Cards:**
  - *3D Perspective HUD:* Real-time 60 FPS WebGL monitor.
  - *Material Swatches:* Bouclé Ivory, Terracotta Linen, Nordic Moss, and Warm Blonde Oak.
  - *Spatial Dimensions:* Interactive area measurement (5.4m × 6.8m | 36.7 m²).
- **Social Proof:** Verified 4.9/5 star customer rating badge and trust statement (10,000+ happy spaces planned).

### C. Features Section (`Features.tsx`)
- **Heading:** *"Everything You Need to Create Your Dream Space"*
- **6 Comprehensive Architectural Feature Cards:**
  1. *Interactive 3D Preview:* Free orbital rotation, pan, and perspective inspection.
  2. *Smart Furniture Placement:* Magnetic auto-alignment, collision detection, and clearance safety.
  3. *Color & Material Customization:* Physically Based Rendering (PBR) wall paints, woods, and fabrics.
  4. *Room Layout Planner:* 2D floorplan blueprint and 3D architectural dimensioning.
  5. *Daylight & Mood Simulation:* Solar raycasting, golden hour sunsets, and ambient fixtures.
  6. *Instant Specs & Shopping Export:* 1-click bills of materials, spec sheets, and CAD/PDF exports.
- **Micro-interactions:** Elevation hover effects, accent border highlights, and bottom interactive callout bar.

### D. About & How It Works Section (`HowItWorks.tsx` & `About.tsx`)
- **Heading:** *"From Empty Space to Beautiful Place"*
- **Three-Step Guided Workflow:**
  - *Step 1 – Start with Your Room:* Choose room templates or enter millimeter architectural dimensions.
  - *Step 2 – Customize Your Design:* Browse 5,000+ designer catalog items and test wall paints.
  - *Step 3 – Preview Your Dream Space:* 3D walkthrough, daylight shifts, and contractor handoff.
- **Interactive Step Spotlight:** Live tabbed preview with high-res interior visual progression.
- **About SpacePlan Studio:** Mission narrative on democratizing interior architecture, verified metrics, and core craftsmanship values.

### E. Interactive 3D Room Designing Workspace (`DesignWorkspace.tsx` & `RoomPreview.tsx`)
Inspired by professional interior design software (Planner 5D, Homestyler, Roomstyler):
- **3D Visualization Canvas:**
  - Cutaway architectural 3D room with real-time Three.js WebGL lighting, soft shadows, and floor grid helper.
  - **Dynamic Room Resizing:** Interactive room width (4m - 9m) and length (4m - 9m) resizing with real-time floor area calculation and boundary updates.
  - **Drag-and-Drop Placement:** Drag any piece from the left catalog directly onto the 3D room floor, with Raycasting snapping to floor coordinates.
  - **Click & Drag Arranging:** Directly drag placed furniture across the room floor with boundary collision clamping.
  - **Selection Ring & Floating Gizmo:** Glowing cyan floor contour ring under the selected object (matching CAD references), with floating action buttons for Rotate 45°, Duplicate, Add to Wishlist, and Delete.
  - **2D / 3D Blueprint Switcher:** Seamless transition between Top-Down 2D floorplan mode and 3D Isometric CAD perspective.
  - **Zoom & View Navigation:** Smooth zoom in (+), zoom out (-), reset view, and orbit rotation controls.
  - **Undo & Redo System:** Complete state history stack with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`) and toolbar buttons.
  - **Wall Paint Customizer:** 12 curated designer swatches featuring the signature **Roasted Mocha (`#5F4336`)**, Alabaster Cream, Terracotta Clay, Nordic Sage, and Aegean Slate.
  - **Floor Selection:** Light Nordic Oak, French Walnut Herringbone, Roasted Mocha Parquet, Carrara White Marble, and Polished Concrete.
  - **Lighting Suite:** Daylight Sun, Golden Hour Sunset, and Twilight Evening with interior glowing lamp emitters.
- **Left Furniture Catalog Drawer:**
  - Categorized into **Living Room**, **Dining Room**, **Bedroom**, and **Decorations & Accents**.
  - Search filter and live model counters.
  - Instant click-to-add or drag-and-drop onto canvas.
  - Pre-staged design templates (*Modern Mocha Lounge*, *Sanctuary Master Bedroom*).
- **Right-Side Customization Panel:**
  - Detailed model header with category tag, duplication, and deletion.
  - **Finish / Color Swatches:** 12 architectural colors with instant 3D mesh recoloring.
  - **Material Textures:** Bouclé Textile, Aniline Leather, Rich Velvet, Natural Oak, Honed Marble, and Brushed Brass.
  - **Exact Dimensional Sliders:** Width (X-axis), Depth/Length (Z-axis), Height (Y-axis), and Elevation off floor (mm accuracy).
  - **Rotation Dial:** 360° degree rotation slider with quick 45° step buttons.
  - **"ADD TO WISHLIST" Button:** One-click save with animated heart indicator.
- **Save Design & Project Library ("My Saved Designs"):**
  - **Save Design:** One-click save modal with custom project name, room category tags, live item counts, dimensions, finishes, and budget summary. Stored in browser `localStorage`.
  - **Saved Designs Library:** Dedicated gallery modal viewing all saved designs with timestamps, room previews, one-click **"Open in 3D"** loading, duplication, `.spaceplan` JSON export, and JSON file import.
- **Space Plan Layout Switcher:**
  - Quick-switch dropdown in the top CAD toolbar and catalog banner to immediately change the 3D room canvas between **Living Room Plan**, **Dining Room Plan**, **Master Bedroom Plan**, **Kitchen & Island Plan**, and **Modern Studio Plan**.
- **Wishlist Drawer & Spec Exporter:**
  - Slide-out drawer tracking saved furniture pieces, chosen dimensions, materials, and price estimates.
  - Automatic total budget calculator with "Request Quote with Wishlist Specs" action that pre-fills the demo inquiry form.
- **4-Space Residence Showcase:**
  - Instant toggle to explore pre-staged **Living Hall**, **Master Bedroom**, **Island Kitchen**, and **Outdoor Garden** suites.

### F. Pricing Section (`Pricing.tsx`)
- **Heading:** *"Simple Plans for Every Space"*
- **Billing Switch:** Monthly and Annual toggle (with "Save 20%" badge).
- **Two Plan Tiers:**
  - *Starter Plan (Free):* 1 active room project, 100+ standard models, 2D planning, community support.
  - *Studio Plan ($12/month or $10/mo annual):* Highlighted with terracotta border and "Most Popular Option" badge. Unlimited projects, 5,000+ catalog items, 4K renders, priority architectural support.
- **Sample Price Notice:** Transparently marked as illustrative sample prices.

### G. Contact & Demo Request Section (`Contact.tsx`)
- **Heading:** *"Ready to Design Your Dream Space?"*
- **Two-Column Layout:**
  - *Left Column:* Direct email (`hello@spaceplan.design` with one-click copy button), studio address, 2-hour response time guarantee, and studio assurance badge.
  - *Right Column:* Fully functional client-side interactive form.
- **Validation Suite:**
  - Full Name validation (required, length check).
  - Email format validation with regex (`name@domain.com`).
  - Target Room selector chips.
  - Optional design goals / room dimensions field.
- **Confirmation State:**
  - Instant submit spinner simulation.
  - Celebratory confetti explosion (`canvas-confetti`).
  - Detailed confirmation message displaying chosen plan and room target.
  - "Submit Another Request" reset trigger.

### H. Footer Section (`Footer.tsx` & `Modal.tsx`)
- Complete company overview and branding.
- Product quick links.
- Interactive newsletter signup with immediate confirmation.
- **Accessible Dialog Modals:** Fully functional **Privacy Policy** and **Terms of Service** modals with backdrop blur and escape key / click-outside dismissal.
- Back-to-top smooth scrolling trigger.
- **Copyright & Attribution:**
  - `"© 2026 SpacePlan Studio. All rights reserved."`
  - `"SpacePlan Studio – Design Your Space. Visualize Your Future."`

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 (`react`, `react-dom`) | Modern component architecture, state management |
| **Language** | TypeScript | Strict type safety, interfaces, and maintainability |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first responsive styling and design system |
| **3D Engine** | Three.js (`three`) | Real-time WebGL rendering, OrbitControls, PBR materials |
| **Animations** | Framer Motion (`framer-motion`) | Smooth entrance transitions, card hover micro-interactions |
| **Icons** | Lucide React (`lucide-react`) | Clean, accessible SVG iconography |
| **Delight** | Canvas Confetti (`canvas-confetti`) | Celebratory particle feedback upon form submission |
| **Bundler** | Vite 8 | Lightning-fast HMR and optimized production build |

---

## 4. Design Direction & Palette

The design reflects a high-end interior architecture brand:
- **Warm White & Cream Backgrounds:** `#FAF7F2`, `#FAF5EE`, `#F5EFE6`
- **Charcoal & Dark Green Typography:** `#1A231F`, `#2A4136`, `#151D18`
- **Terracotta Orange Accent:** `#D9633B`, `#C24F29`
- **Beige & Warm Neutral Tones:** `#EFE8DD`, `#E0D5C6`, `#D5CABB`
- **Typography:** *Playfair Display* (luxury editorial serif for headlines) & *Plus Jakarta Sans* (crisp, modern sans-serif for body copy)
- **Geometry:** Generous border radii (`rounded-2xl`, `rounded-3xl`) and multi-layer soft warm shadows (`shadow-soft-md`, `shadow-soft-xl`).

---

## 5. Project Structure

```
spaceplan-saas/
├── public/
│   └── favicon.svg           # Custom geometric 3D isometric house SVG icon
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Sticky responsive header with section spy & mobile drawer
│   │   ├── Hero.tsx          # Hero visual with floating 3D HUD & proof metrics
│   │   ├── Features.tsx      # 6 feature cards with hover transitions & callout bar
│   │   ├── HowItWorks.tsx    # 3-step workflow with visual deep dive spotlight
│   │   ├── RoomPreview.tsx   # Interactive Three.js 3D room canvas & studio toolbar
│   │   ├── Pricing.tsx       # Starter & Studio plan cards with monthly/annual switch
│   │   ├── About.tsx         # Vision narrative, verified stats, and studio craft badge
│   │   ├── Contact.tsx       # Demo request form with validation, confetti & contact info
│   │   ├── Footer.tsx        # Footer navigation, newsletter, and legal triggers
│   │   └── Modal.tsx         # Accessible modal dialog for Privacy & Terms
│   ├── types.ts              # TypeScript interfaces and union types
│   ├── App.tsx               # Root component assembling all sections
│   ├── main.tsx              # Application entry point
│   └── index.css             # Tailwind v4 configuration, font imports, and warm shadows
├── index.html                # HTML entry point with fonts & metadata
├── package.json              # Project scripts and dependencies
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite configuration with React & Tailwind plugins
└── README.md                 # Complete documentation & deployment guide
```

---

## 6. Installation & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

### Steps to Run Locally

1. **Clone or Navigate to the project directory:**
   ```bash
   cd spaceplan-saas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Open [http://localhost:5173](http://localhost:5173) to preview the live application with instant Hot Module Replacement (HMR).

---

## 7. Creating a Production Build

To test TypeScript compilation and generate an optimized production bundle:

```bash
npm run build
```

This compiles all TypeScript files and bundles minified assets into the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 8. Deployment Guide

### Deploying on Vercel

1. **Push your code to GitHub, GitLab, or Bitbucket.**
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import the repository.
4. Vercel automatically detects Vite:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**. Your SpacePlan landing page will be live on an HTTPS domain within seconds.

---

### Deploying on Netlify

1. Push your repository to your Git provider.
2. Log in to [netlify.com](https://netlify.com) and select **"Add new site" -> "Import an existing project"**.
3. Configure the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **"Deploy site"**.

Alternatively, via Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 9. Platform & Product Specifications

- **Project:** SpacePlan – 3D Interior Design SaaS Platform
- **Branding:** SpacePlan – *Design Your Space. Visualize Your Future.*
- **Scope:** 100% Client-Side Frontend (No external database or server required).
- **Core Engine:** WebGL Three.js with OrbitControls & Physically Based Rendering (PBR).
