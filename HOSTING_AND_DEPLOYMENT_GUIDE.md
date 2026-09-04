# Hosting & Deployment Guide — Taksal Studio Website

This comprehensive guide outlines step-by-step instructions to deploy the production-ready **Taksal Studio** official website (`https://cardmint.app`) across modern static hosting providers.

Because the website is built with clean, semantic HTML5, CSS3 custom properties, and vanilla JavaScript without heavy framework dependencies, it requires **zero server-side runtime**, achieves near-instant TTFB (Time to First Byte), and can be hosted for **$0/month** on high-performance global CDNs.

---

## Pre-Flight Verification Checklist

Before publishing, verify the following files are in place in `/home/rahullagariya/AndroidStudioProjects/Taksal Web`:

- [x] `index.html` (Home Page)
- [x] `features.html` (Deep-Dive Features & Modules)
- [x] `about.html` (Philosophy, Architecture & Story)
- [x] `support.html` (Technical Guides & Printer Setup)
- [x] `contact.html` (Validated Contact Form)
- [x] `faq.html` (Categorized Q&A Accordion)
- [x] `privacy.html` (GDPR & CCPA Compliant Privacy Policy)
- [x] `terms.html` (Terms & Conditions)
- [x] `PRIVACY_POLICY.md` & `privacy-policy.txt` (Alternative Legal Formats)
- [x] `TERMS_AND_CONDITIONS.md` (Markdown Legal Format)
- [x] `sitemap.xml` & `robots.txt` (Search Engine Indexing)
- [x] `assets/css/style.css` (Design System Stylesheet)
- [x] `assets/css/legal.css` (Legal Documentation Stylesheet)
- [x] `assets/js/main.js` (Interactive Controller)
- [x] `assets/images/` (App Icon, Feature Graphic & Optimized WebP Screenshots)

---

## Hosting Option A: Cloudflare Pages (Recommended)

Cloudflare Pages provides the world's fastest Edge network, automatic Brotli compression, free wildcard SSL, and DDoS mitigation.

### Step 1: Push Code to Git
Initialize a Git repository inside the website root:
```bash
cd "/home/rahullagariya/AndroidStudioProjects/Taksal Web"
git init
git add .
git commit -m "feat: Initial release of Taksal Studio official website v3.0.0"
git remote add origin git@github.com:your-username/taksal-web.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. Log in to your **Cloudflare Dashboard** (`dash.cloudflare.com`).
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select the repository `taksal-web`.
4. Configure Build Settings:
   - **Framework preset:** `None`
   - **Build command:** *(Leave empty)*
   - **Build output directory:** `/` (or root directory)
5. Click **Save and Deploy**. Your site will be live on a `*.pages.dev` subdomain in less than 30 seconds.

### Step 3: Configure Custom Apex & Subdomain
1. In the Cloudflare Pages project, click **Custom domains** > **Set up a domain**.
2. Enter `cardmint.app` and `www.cardmint.app`.
3. Cloudflare will automatically route DNS records (CNAME flattening) and provision an edge SSL certificate.

---

## Hosting Option B: GitHub Pages

GitHub Pages is simple and free directly from your repository.

### Step 1: Push Repository
Push your code to GitHub as shown in Option A.

### Step 2: Enable GitHub Pages
1. On GitHub, navigate to your repository **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` / `root (/)`
3. Click **Save**.

### Step 3: Custom Domain & Enforce HTTPS
1. In the **Custom domain** field, enter `cardmint.app`.
2. Add a `CNAME` file in the root if not generated automatically:
   ```bash
   echo "cardmint.app" > CNAME
   ```
3. Check the box for **Enforce HTTPS** (takes a few minutes to issue certificate).

---

## Hosting Option C: Netlify

Netlify offers instant drag-and-drop deployment or Git integration.

### Method 1: Instant Drag & Drop (Zero Git Required)
1. Log in to `app.netlify.com`.
2. Open the **Sites** tab and scroll to the bottom.
3. Drag the entire `/home/rahullagariya/AndroidStudioProjects/Taksal Web` folder directly into the Netlify browser drop target.
4. Your website is deployed instantly!

### Method 2: Git Continuous Deployment
1. Click **Add new site** > **Import an existing project**.
2. Connect your GitHub/GitLab account and choose `taksal-web`.
3. Leave build command blank, publish directory set to `.`.
4. Click **Deploy Site**.

---

## Hosting Option D: Custom Linux VPS (Nginx on Ubuntu / Debian)

If hosting on an independent virtual private server (e.g. DigitalOcean, AWS EC2, Linode, or Hetzner):

### Step 1: Install Nginx & Certbot
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 2: Copy Site Files to Webroot
```bash
sudo mkdir -p /var/www/cardmint.app
sudo cp -r "/home/rahullagariya/AndroidStudioProjects/Taksal Web/"* /var/www/cardmint.app/
sudo chown -R www-data:www-data /var/www/cardmint.app
sudo chmod -R 755 /var/www/cardmint.app
```

### Step 3: Nginx VirtualHost Configuration
Create `/etc/nginx/sites-available/cardmint.app`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name cardmint.app www.cardmint.app;

    root /var/www/cardmint.app;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline';" always;

    # Static Asset Caching (1 Year for images/fonts)
    location ~* \.(webp|png|jpg|jpeg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
    }

    # CSS & JavaScript Caching (7 Days)
    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public, must-revalidate";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/cardmint.app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Issue Free SSL Certificate with Let's Encrypt
```bash
sudo certbot --nginx -d cardmint.app -d www.cardmint.app --agree-tos --email support@cardmint.app
```
Certbot will configure automatic renewal via systemd timer.

---

## Domain DNS Configuration Reference

Point your domain registrar (Namecheap, GoDaddy, Google Domains / Squarespace) to your host using standard DNS records:

### For Cloudflare Pages or Netlify
| Type | Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `@` (or ALIAS/ANAME) | `your-site.pages.dev` (or `your-site.netlify.app`) | Auto |
| **CNAME** | `www` | `your-site.pages.dev` (or `your-site.netlify.app`) | Auto |

### For GitHub Pages
| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | 3600 |
| **A** | `@` | `185.199.109.153` | 3600 |
| **A** | `@` | `185.199.110.153` | 3600 |
| **A** | `@` | `185.199.111.153` | 3600 |
| **CNAME** | `www` | `your-username.github.io` | 3600 |

### For Custom Linux VPS
| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `<YOUR_SERVER_PUBLIC_IP>` | 300 |
| **A** | `www` | `<YOUR_SERVER_PUBLIC_IP>` | 300 |

---

## Post-Deployment Verification

1. **Test SSL / HTTPS:** Open `https://cardmint.app` and confirm the browser displays a secure lock icon without mixed-content warnings.
2. **Test Responsive Layout:** Test page rendering across Mobile (375px), Tablet (768px), and Desktop (1200px+).
3. **Verify Lightbox & Forms:** Confirm screenshot lightbox modal opens cleanly and the contact form validates input.
4. **Submit Sitemap to Google Search Console:**
   - Open `search.google.com/search-console`.
   - Add property `https://cardmint.app`.
   - Submit sitemap URL: `https://cardmint.app/sitemap.xml`.
5. **Update Google Play Store Console:**
   - Under **App Content** > **Privacy Policy**, paste: `https://cardmint.app/privacy.html`.
   - Under **Store Listing** > **Website**, enter: `https://cardmint.app/`.
