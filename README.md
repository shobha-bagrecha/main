# Shobha Bagrecha — Website

Professional coaching and transformational leadership site for Shobha Bagrecha.
Built with pure HTML, CSS, and JavaScript. No frameworks or dependencies.

---

## Project Structure

```
shobha-main/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── script.js       # Nav, animations, counter, carousel
│   │   └── booking.js      # Calendly loader + fallback form
│   └── images/
│       ├── icons/          # Logos, stat icons, program icons, social impact photos
│       └── photos/         # Hero, about, testimonial photos
└── README.md
```

---

## Setup Checklist

### 1. Calendly (Booking Section)

1. Create a free account at [calendly.com](https://calendly.com)
2. Create a new event type: **"20 Minute Discovery Call"**
3. Copy your event URL (e.g. `https://calendly.com/yourname/20min`)
4. Open `index.html` and find the Calendly widget block (search for `calendlyWidget`)
5. Replace `data-url="https://calendly.com/shobhabagrecha/20min"` with your actual URL

> Until Calendly is configured, the fallback contact form is shown automatically.

---

### 2. Email Lead Capture — Netlify Forms

The site uses **Netlify Forms** (zero-config when deployed to Netlify). Three forms are set up:

| Form name       | Purpose                        |
|-----------------|--------------------------------|
| `free-resource` | Download guide lead capture    |
| `booking`       | Fallback booking request       |
| `newsletter`    | Monthly newsletter signup      |

Submissions appear in your Netlify dashboard under **Forms**.

**To connect Mailchimp instead:**
- In `index.html`, find the `free-resource` form
- Replace `<form ... data-netlify="true">` with your Mailchimp embed `<form action="https://...us*.list-manage.com/subscribe/post?u=...">`
- See comment in `index.html` for exact location

**To connect ConvertKit instead:**
- Replace the form action with your ConvertKit form URL
- See comment in `index.html` for exact location

---

### 3. Google Analytics

Already added as a commented-out block in `index.html` `<head>`:

```html
<!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> -->
```

To activate:
1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Uncomment the GA block in `index.html` and replace `G-XXXXXXXXXX` with your ID

---

### 4. Contact Email

Open `index.html`, search for `shobha@shobhabagrecha.com` and update with Shobha's real email address.

---

### 5. Social Links

All social links are already set in the footer. To update, search in `index.html` for:
- `facebook.com/bagrecha.shobha`
- `instagram.com/shobhabagrecha`
- `linkedin.com/in/shobhabagrecha`
- `youtube.com/c/ShobhaBagrecha`
- `twitter.com/shobhabagrecha`

---

## Deployment — Netlify (Recommended)

1. Push this repo to GitHub
2. Log into [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select the repo — no build command needed, publish directory = `/` (root)
4. Click **Deploy** — Netlify Forms activate automatically

**Custom domain:**
- In Netlify dashboard → **Domain settings → Add custom domain**
- Point your DNS to Netlify's nameservers

---

## Local Development

No build tools needed. Just open `index.html` in a browser — or use a simple dev server:

```bash
# Python 3
python -m http.server 3000

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:3000`

---

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). IE not supported.
Graceful fallbacks provided for `IntersectionObserver` and CSS `clamp()`.

---

## Performance Notes

- Hero image uses `<picture>` with separate mobile/desktop sources
- All below-fold images use `loading="lazy"`
- Google Fonts loaded with `rel="preconnect"` for faster first paint
- No JavaScript frameworks — minimal JS footprint
- Target: Lighthouse 90+ on all metrics
