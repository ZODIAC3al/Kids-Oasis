---
name: Kinetic Education System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#464555'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
  bg-light: '#FAFAFC'
  bg-dark: '#0F172A'
  text-primary: '#111827'
  glass-stroke: rgba(255, 255, 255, 0.1)
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  unit: 8px
---

## Brand & Style

This design system is engineered for a premium enterprise SaaS environment that bridges the gap between educational marketplace discovery and robust academy management. The brand personality is professional, precise, and sophisticated—intentionally moving away from "juvenile" aesthetics to cater to high-end educators and discerning parents.

The design style is a hybrid of **Minimalism** and **Glassmorphism**. It leverages heavy whitespace, strict grid discipline, and translucent layers to create a sense of breathability and technological sophistication. Drawing inspiration from industry leaders like Stripe and Linear, the UI prioritizes clarity, structural integrity, and high-fidelity interactions to evoke a sense of trust and institutional excellence.

## Colors

The palette utilizes a deep Indigo as the primary driver for brand recognition and primary actions. Sky Blue and Emerald serve as functional accents for secondary navigation and positive-state feedback (e.g., "Paid," "Enrolled," "Active"). 

In **Light Mode**, the background uses a subtle off-white to reduce eye strain, while **Dark Mode** employs a deep Navy-Slate to maintain contrast and luxury feel. Functional neutrals are strictly controlled to maintain a clear hierarchy; use the primary text color for headings and the secondary neutral for metadata and descriptions. Glassmorphism effects should use white or black overlays with 4-8% opacity depending on the mode.

## Typography

Geist is selected for its technical precision and modern "monospaced-adjacent" feel that suits enterprise dashboards. Typography follows a strict hierarchy where large headings use aggressive negative letter-spacing for a compact, editorial look.

Body text maintains generous line-height to ensure readability during long management sessions. Use semi-bold weights for labels and interactive elements to distinguish them from static content. All display sizes must scale down on mobile breakpoints to prevent layout breaking, following the mobile-specific tokens provided.

## Layout & Spacing

The system uses a **Fixed Grid** on desktop and a **Fluid Grid** on mobile. The layout is built on an 8px base unit to ensure perfect alignment of all components.

- **Desktop:** 12-column grid with 24px gutters. Content is centered within a 1440px max-width container.
- **Sidebars:** Fixed width at 280px to accommodate deep navigation trees.
- **Tablet:** 8-column grid with 16px margins.
- **Mobile:** 4-column grid with 16px margins.

Use dynamic padding for internal card structures (e.g., 24px for desktop cards, 16px for mobile) to maintain a high-end, spacious feel.

## Elevation & Depth

Hierarchy is achieved through a combination of **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh blacks, opting instead for tinted shadows that reflect the background color.

1.  **Level 0 (Base):** The primary background color.
2.  **Level 1 (Cards):** Surface color with a "Soft Floating" shadow: `0px 4px 20px rgba(0, 0, 0, 0.03)`.
3.  **Level 2 (Modals/Dialogs):** Surface color with a `0px 20px 50px rgba(0, 0, 0, 0.1)` shadow and a 1px border at 10% opacity.
4.  **Glassmorphism:** Use for navigation bars and floating headers. Apply a `blur(12px)` and a semi-transparent background color (`rgba(255, 255, 255, 0.7)` for light mode) to create a premium, layered effect.

## Shapes

The shape language is sophisticated and modern, utilizing differentiated radii to signal hierarchy. While the base roundedness is set to "Rounded" (0.5rem), this system utilizes specific overrides for key enterprise elements:

- **Buttons & Input Fields:** 14px radius for a sleek, modern touch.
- **Cards & Images:** 20px radius to soften large surface areas.
- **Dialogs & Modals:** 24px radius for a distinct, floating appearance.
- **Chips/Badges:** Full pill-shape for high-contrast visibility.

## Components

### Buttons
Primary buttons use a solid Indigo background with white text and a subtle 1px top-inner highlight. Secondary buttons use a ghost style with a subtle 1px border. All buttons have a 14px radius.

### Input Fields
Inputs are highly refined: 14px radius, 1px border (`#E5E7EB` in light mode), and a generous 12px vertical padding. Focus states should use a 2px Indigo ring with a 4px offset.

### Modern Tables
Tables should be "borderless" in appearance. Use subtle horizontal dividers (`1px`) and a highlight on row-hover. Use Emerald for positive status chips and Sky Blue for informational tags.

### Cards
Cards are the primary container. They feature a 20px radius, a soft shadow, and a 1px border that is nearly invisible except in high-contrast scenarios. 

### Glassmorphism Elements
Header bars and sticky navigation use a backdrop filter blur of 12px. This maintains context of the scroll position while providing a high-end aesthetic.

### Icons
Use Lucide-style outlined icons with a 1.5px stroke weight. Icons should be monochrome (Secondary Text color) unless used as a status indicator.