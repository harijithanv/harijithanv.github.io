# Marvic Tele — Portfolio Website

A premium, production-ready personal portfolio for **Marvic Tele**, Final Year BSc (Hons) Biomedical Science at NSBM Green University.

---

## 📁 Folder Structure

```
marvic-portfolio/
├── index.html                  ← Main HTML (single page)
├── sitemap.xml                 ← SEO sitemap
├── robots.txt                  ← SEO robots file
├── README.md                   ← This file
└── assets/
    ├── css/
    │   └── style.css           ← All styles
    ├── js/
    │   └── script.js           ← All JavaScript
    └── images/
        ├── profile.jpg         ← YOUR PHOTO (replace this!)
        ├── og-image.png        ← Social share image (1200×630)
        └── gallery/
            ├── poster1.jpg
            ├── lab1.jpg
            ├── lab2.jpg
            ├── prisma.jpg
            ├── conf1.jpg
            └── infographic.jpg
```

---

## 🚀 GitHub Pages Deployment

### Step 1 — Create your repository
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it `yourusername.github.io` (replace `yourusername` with your GitHub username)
4. Set to **Public**
5. Click **Create repository**

### Step 2 — Upload files
**Option A — GitHub Web UI (simplest):**
1. Open your new repository
2. Click **Add file → Upload files**
3. Drag and drop the entire `marvic-portfolio/` folder contents (not the folder itself — its contents)
4. Click **Commit changes**

**Option B — Git CLI:**
```bash
cd marvic-portfolio
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repository → **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Wait 1–2 minutes, then visit `https://yourusername.github.io`

---

## 🎨 Customisation Checklist

### Mandatory personalisation
- [ ] Replace `assets/images/profile.jpg` with your actual photo (square crop, min 600×600)
- [ ] Update all `yourusername.github.io` URLs to your real GitHub Pages URL
- [ ] Update email address in the Contact section (`index.html`)
- [ ] Update LinkedIn, ORCID, Google Scholar, ResearchGate, GitHub links
- [ ] Update CV link — place your PDF as `assets/Marvic_Tele_CV.pdf`
- [ ] Replace `sitemap.xml` URL with your real URL

### Optional
- [ ] Add real gallery images to `assets/images/gallery/`
- [ ] Add conference poster images
- [ ] Update certifications with actual certificate names and dates
- [ ] Adjust skill percentage values in `index.html`

---

## 🛠 Technologies Used

| Library | Version | Purpose |
|---------|---------|---------|
| AOS | 2.3.4 | Scroll animations |
| GSAP | 3.12.5 | Advanced animations |
| ScrollTrigger | 3.12.5 | Scroll-driven effects |
| GLightbox | 3.2.0 | Gallery lightbox |
| Font Awesome | 6.5.0 | Icons |
| Google Fonts | — | DM Serif Display, DM Sans, JetBrains Mono |

All libraries loaded from CDN — no build tools required.

---

## ♿ Accessibility

- Semantic HTML5 landmarks
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Reduced motion support (`prefers-reduced-motion`)
- Alt text on all images

---

## 📊 Performance Tips

- Compress `profile.jpg` to under 200KB using [Squoosh](https://squoosh.app)
- Create `og-image.png` at 1200×630px for social sharing
- Gallery images: compress to under 150KB each

---

## 📄 License

Personal use only. Designed for Marvic Tele's academic portfolio.

---

*Built with precision for MSc applications, research internships, and international research collaborations.*
