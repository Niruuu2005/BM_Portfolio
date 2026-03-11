# Phase 3 — Styling Polish & Deployment

> **Phase Goal:** Finalize the visual design, add micro-animations and responsive polish, then deploy the website to Vercel with proper environment variables configured.

---

## 7.1 Visual Polish Tasks

### Hero Section Gradient Background
```css
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* Glowing gradient orbs behind the hero */
.hero-section::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  pointer-events: none;
}

.hero-section::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
  bottom: 0;
  left: -100px;
  pointer-events: none;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-24) 0;
}

.hero__greeting  { color: var(--color-accent); font-size: var(--font-size-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: var(--space-2); }
.hero__name      { font-family: var(--font-heading); font-size: var(--font-size-5xl); font-weight: 700; line-height: 1.1; margin-bottom: var(--space-3); }
.hero__title     { color: var(--color-accent); font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); }
.hero__institution { color: var(--color-text-muted); font-size: var(--font-size-lg); margin-bottom: var(--space-4); }
.hero__tagline   { color: var(--color-text-muted); font-size: var(--font-size-lg); line-height: 1.6; margin-bottom: var(--space-8); max-width: 480px; }
.hero__actions   { display: flex; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-8); }
.hero__links     { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.profile-badge   { padding: 6px 16px; background: rgba(255,255,255,0.06); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-muted); transition: all var(--transition-fast); text-decoration: none; }
.profile-badge:hover { border-color: var(--color-accent); color: var(--color-accent); background: rgba(59,130,246,0.08); text-decoration: none; }

/* Profile Photo */
.hero__photo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero__photo-wrap::before {
  content: '';
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), #8B5CF6);
  opacity: 0.3;
  animation: pulse-ring 3s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.5; }
}

.hero__photo {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-accent);
  position: relative;
}

.hero__photo-placeholder {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 4px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
}

/* Stats row */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  padding-bottom: var(--space-16);
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  transition: border-color var(--transition-fast);
}

.stat-card:hover { border-color: var(--color-accent); }
.stat-number { display: block; font-family: var(--font-heading); font-size: var(--font-size-3xl); font-weight: 700; color: var(--color-accent); }
.stat-label  { display: block; font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-1); }
```

---

## 7.2 Timeline Component CSS (Education / Experience)

```css
.timeline { position: relative; padding-left: var(--space-8); }

.timeline::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
}

.timeline-item { position: relative; margin-bottom: var(--space-8); }

.timeline-dot {
  position: absolute;
  left: -35px;
  top: 8px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 3px solid var(--color-bg);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
}

.timeline-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: border-color var(--transition-fast);
}

.timeline-card:hover { border-color: rgba(59,130,246,0.4); }

.timeline-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2); }
.timeline-degree { font-family: var(--font-heading); font-size: var(--font-size-xl); font-weight: 700; }
.timeline-year   { background: rgba(59,130,246,0.12); color: var(--color-accent); padding: 4px 12px; border-radius: var(--radius-full); font-size: var(--font-size-sm); font-weight: 600; white-space: nowrap; }
.timeline-specialization { font-size: var(--font-size-lg); font-weight: 500; color: var(--color-text); margin-bottom: var(--space-1); }
.timeline-institution { color: var(--color-text-muted); }
.timeline-university { font-size: var(--font-size-sm); margin-top: var(--space-1); }
.timeline-thesis { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-2); font-style: italic; }

/* Badges */
.badge { display: inline-block; padding: 3px 10px; border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: 600; margin-top: var(--space-2); margin-right: var(--space-2); }
.badge-accent { background: rgba(59,130,246,0.15); color: var(--color-accent); }
.badge-gold   { background: rgba(245,158,11,0.15); color: var(--color-warn); }
.badge-indexing { background: rgba(16,185,129,0.15); color: var(--color-success); }

/* Publications */
.publication-list { list-style: none; display: flex; flex-direction: column; gap: var(--space-4); counter-reset: pub-counter; }
.publication-item { display: flex; gap: var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-5); transition: border-color var(--transition-fast); }
.publication-item:hover { border-color: rgba(59,130,246,0.3); }
.pub-number { font-family: var(--font-heading); font-size: var(--font-size-xl); font-weight: 700; color: var(--color-accent); min-width: 2ch; }
.pub-content { flex: 1; }
.pub-title   { font-weight: 600; margin-bottom: var(--space-1); line-height: 1.4; }
.pub-authors { font-size: var(--font-size-sm); margin-bottom: var(--space-1); }
.pub-venue   { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-2); }
.pub-meta    { display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap; }
.btn-doi     { font-size: var(--font-size-xs); color: var(--color-accent); border: 1px solid var(--color-accent); border-radius: var(--radius-md); padding: 2px 8px; text-decoration: none; }
.btn-doi:hover { background: var(--color-accent); color: #fff; text-decoration: none; }

/* Filters */
.pub-controls { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap; }
.year-select { padding: var(--space-2) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font-size: var(--font-size-sm); }
.pub-count { color: var(--color-text-muted); font-size: var(--font-size-sm); }

/* Contact */
.contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-12); }
.contact-info h3 { font-family: var(--font-heading); font-size: var(--font-size-2xl); margin-bottom: var(--space-3); }
.contact-details { margin-top: var(--space-6); display: flex; flex-direction: column; gap: var(--space-3); }
.contact-item { display: flex; gap: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-sm); }
.contact-form { display: flex; flex-direction: column; gap: var(--space-4); }
.contact-form textarea { resize: vertical; }
```

---

## 7.3 Responsive Breakpoints

```css
/* Tablet: 768px */
@media (max-width: 768px) {
  .hero__inner { grid-template-columns: 1fr; text-align: center; gap: var(--space-8); }
  .hero__photo { width: 220px; height: 220px; }
  .hero__photo-placeholder { width: 220px; height: 220px; }
  .hero__photo-wrap { order: -1; }
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .hero__actions { justify-content: center; }
  .hero__links { justify-content: center; }
  .contact-grid { grid-template-columns: 1fr; }
  .footer__inner { grid-template-columns: 1fr; }
  .hero__name { font-size: var(--font-size-4xl); }
}

/* Mobile: 480px */
@media (max-width: 480px) {
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .hero__name { font-size: var(--font-size-3xl); }
  .section-title { font-size: var(--font-size-3xl); }
  .publication-item { flex-direction: column; }
  .timeline { padding-left: var(--space-6); }
  .timeline-dot { left: -26px; }
}
```

---

## 7.4 Framer Motion Scroll Animations

Add these to any component that should animate on scroll:

```jsx
import { motion } from 'framer-motion'

// Fade-up on scroll
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5 }}
>
  {/* content */}
</motion.div>

// Stagger children (for lists)
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map((i) => (
    <motion.li key={i.id} variants={item}>{i.title}</motion.li>
  ))}
</motion.ul>
```

---

## 7.5 Deployment to Vercel

### Step 1: Install Vercel CLI (optional)
```bash
npm install -g vercel
```

### Step 2: Build the project locally first to verify
```bash
npm run build
# dist/ folder is generated — check for errors
```

### Step 3: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Personal academic website"
git remote add origin https://github.com/yourusername/personal-website.git
git push -u origin main
```

### Step 4: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — keep defaults
5. Set **Environment Variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Deploy**

### Step 5: Custom Domain (optional)
1. Go to the deployed project in Vercel
2. Settings → Domains → Add your domain
3. Point your domain's DNS to Vercel nameservers

---

## 7.6 SEO — Head Tags

Add to `index.html`:
```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dr. Your Name — Associate Professor | PCCOE Pune</title>
  <meta name="description" content="Personal academic portfolio of Dr. Your Name — Associate Professor of Computer Engineering. Research, Publications, Patents, and Teaching." />
  <meta name="keywords" content="professor, academic, research, publications, patents, computer engineering, pune" />
  <meta property="og:title" content="Dr. Your Name — Academic Portfolio" />
  <meta property="og:description" content="Research, Publications, Patents, and Teaching." />
  <meta property="og:type" content="website" />
</head>
```

---

## 7.7 Phase 3 Completion Checklist

```
[ ] Hero gradient bg + glowing orbs
[ ] Hero photo with pulsing ring animation
[ ] Stat cards in hero footer row
[ ] Timeline component for Education & Experience
[ ] Publication list with numbered items + DOI badge
[ ] Year filter dropdown for publications
[ ] Contact section grid — info + form
[ ] Badge styles: accent, gold, indexing
[ ] Responsive styles at 768px and 480px
[ ] Framer Motion scroll animations on all sections
[ ] npm run build completes with no errors
[ ] Deployed on Vercel
[ ] Environment variables set in Vercel dashboard
[ ] Custom domain connected (if applicable)
[ ] SEO meta tags in index.html
```

---

*Frontend Phase 3 — Styling & Deployment | v1.0 — March 2026*
