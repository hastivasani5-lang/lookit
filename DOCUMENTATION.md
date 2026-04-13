# Lookit E-commerce Website Documentation

## Overview
Lookit is a modern, fully responsive E-commerce platform built with Next.js (App Router), Tailwind CSS, and Framer Motion. The design system is inspired by high-end brands (Apple/Nike/Stripe) and ensures a premium, consistent user experience across all pages.

---

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript/JavaScript

---

## Project Structure

```
src/
  app/
    about/
      page.tsx         # About page (premium layout)
    shop/
      page.tsx         # Shop page (main entry)
  components/
    Navbar.tsx         # Top navigation bar
    Footer.tsx         # Footer (consistent with About page)
    shop/
      ShopHero.jsx         # Hero/banner section
      FilterBar.jsx        # Search/filter UI
      ProductGrid.jsx      # Responsive product grid (3 per row)
      ProductCard.jsx      # Premium product card (ul/li based)
      FeaturesSection.jsx  # Features (About style)
      TestimonialsSection.jsx # Customer reviews
      CartDrawer.jsx       # Slide-in cart drawer
      products.json        # Dummy product data
```

---


## Key Features

- **Premium Design System:**
  - Clean typography, consistent spacing, gradients, rounded corners, soft shadows
  - Section layouts match About page for brand consistency

- **Shop Page:**
  - Hero section with animated banner
  - Filter/search bar (sticky, glassmorphism)
  - Product grid (3 per row on desktop, responsive)
  - Product cards: large image, floating badge, price, rating, animated buttons
  - Features section (4 columns, icons)
  - Testimonials slider
  - Cart drawer with smooth animation

- **Admin Panel:**
  - Secure login for admin users
  - Dashboard with quick stats and notifications
  - Approve/reject professional applications
  - Review management (flag, delete, view details)
  - Category management (add/edit/delete professional categories)
  - Uploads management (professional uploads, student purchases)
  - Payouts management (track and mark payouts for professionals)
  - Alerts and notifications
  - View and respond to contact messages

- **Professional Features:**
  - Professional user management (view, edit, and approve professionals)
  - Professional categories (technology, design, marketing, analytics, business, etc.)
  - Track professional uploads and certificates
  - Review and rating system for professionals
  - Payout tracking for professional services

- **Accessibility:**
  - Semantic HTML (ul/li for product grid)
  - Keyboard and screen reader friendly

- **Performance:**
  - Optimized images, lazy loading, minimal bundle size

- **Animations:**
  - Framer Motion for smooth transitions and micro-interactions

---

## How to Run
1. **Install dependencies:**
   ```
   npm install
   ```
2. **Start development server:**
   ```
   npm run dev
   ```
3. **Build for production:**
   ```
   npm run build
   ```
4. **Preview production build:**
   ```
   npm run start
   ```

---

## Customization
- **Add/Edit Products:**
  - Update `src/components/shop/products.json` with your product data.
- **Change Design:**
  - Edit Tailwind classes in component files for colors, spacing, etc.
- **Add Features:**
  - Create new components in `src/components/shop/` and import them in `page.tsx`.

---

## Deployment
- Recommended: [Vercel](https://vercel.com/) (zero-config for Next.js)
- Push to GitHub, connect repo to Vercel, and deploy.

---

## Credits
- UI/UX: Inspired by Apple, Nike, Stripe
- Icons: [Lucide](https://lucide.dev/)
- Animations: [Framer Motion](https://www.framer.com/motion/)

---

## Contact
For support or questions, contact the Lookit team.
