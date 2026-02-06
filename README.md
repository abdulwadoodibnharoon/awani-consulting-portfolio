# Awani Consulting Portfolio

A modern, professional portfolio website for software consulting services, built with React and Vite using Awani's brand colors.

## Features

- **Modern Design**: Glassmorphism effects, animated gradients, and smooth animations
- **Awani Brand Colors**: Navy theme with teal/cyan accents
- **Fully Responsive**: Works on desktop, tablet, and mobile
- **Sections**:
  - Hero with animated background orbs
  - Services (AI/ML, Custom Dev, Fractional CTO, API Integration)
  - Awani Voice Assistant case study
  - Pricing tiers
  - Technology expertise
  - Contact section
  - Professional footer

## Color Palette

- **Navy Dark**: #0a0e27
- **Navy Medium**: #151a3d
- **Teal Bright**: #00d9b3 (primary accent)
- **Green Bright**: #2df5b8
- **Blue Bright**: #00a8e8

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Access

**Local Development**: http://localhost:5173/

## Tech Stack

- React 18
- Vite
- Pure CSS (no frameworks needed)
- Modern CSS features (Grid, Flexbox, CSS Variables, Backdrop Filter)

## Customization

### Update Content
Edit `src/App.jsx` to change:
- Your name and contact info
- Service descriptions and pricing
- Case study details
- Technology stack

### Update Styling
Edit `src/App.css` to modify:
- Colors (CSS variables in `:root`)
- Animations
- Spacing and layouts
- Responsive breakpoints

## Next Steps

1. **Add Images**: Replace emoji icons with actual service/product screenshots
2. **Add Form**: Integrate contact form with backend (e.g., Formspree, EmailJS)
3. **Add Analytics**: Google Analytics or Plausible
4. **Deploy**: Vercel, Netlify, or your own server
5. **SEO**: Add meta tags, Open Graph images
6. **Blog**: Add a blog section for thought leadership

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to Your Server
```bash
npm run build
rsync -avz dist/ user@server:/var/www/consulting.awani.ai/
```

## License

Private - Awani Consulting © 2026
