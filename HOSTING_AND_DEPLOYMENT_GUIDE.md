# Hosting & Deployment Guide — Taksal Studio Website

This comprehensive guide outlines step-by-step instructions to deploy the production-ready **Taksal Studio** official website (`https://taksal.com`) to **Cloudflare Pages** (Option A) with your verified **`app-ads.txt`** file, custom headers, and clean URL rewrites.

Because the website is built with clean, semantic HTML5, CSS3 custom properties, and vanilla JavaScript without heavy framework dependencies, it requires **zero server-side runtime**, achieves near-instant TTFB (Time to First Byte), and can be hosted for **$0/month** on Cloudflare's global edge network.

---

## Pre-Flight Verification Checklist

All required files are verified in `/home/rahullagariya/AndroidStudioProjects/Taksal Web`:

- [x] `app-ads.txt` (Contains: `google.com, pub-7030166934019393, DIRECT, f08c47fec0942fa0`)
- [x] `_headers` (Cloudflare Pages custom HTTP headers: MIME type for `app-ads.txt`, security headers, static caching)
- [x] `_redirects` (Clean URL rewrites for `/privacy`, `/terms`, `/features`, `/about`, `/support`, `/faq`, `/contact`)
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

## Option A: Cloudflare Pages Deployment (Step-by-Step)

Cloudflare Pages provides the world's fastest Edge network, automatic Brotli compression, free wildcard SSL, and DDoS mitigation.

### Method 1: Git Integration (Recommended for Continuous Deployment)

#### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new) and create a repository named `taksal-web` (Public or Private).
2. Push your local code from `/home/rahullagariya/AndroidStudioProjects/Taksal Web`:
   ```bash
   cd "/home/rahullagariya/AndroidStudioProjects/Taksal Web"
   git remote add origin git@github.com:codewithrahul444/taksal-web.git
   git push -u origin main
   ```
   *(Or use HTTPS: `https://github.com/codewithrahul444/taksal-web.git`)*

#### Step 2: Connect to Cloudflare Pages
1. Log in to your **Cloudflare Dashboard** ([dash.cloudflare.com](https://dash.cloudflare.com/)).
2. In the left navigation, click **Compute (Workers & Pages)** > **Pages** (or **Workers & Pages** > **Create application** > **Pages**).
3. Select **Connect to Git** and choose your repository: `codewithrahul444/taksal-web`.
4. Configure Build Settings:
   - **Project name:** `taksal-web` (or `cardmint`)
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** *(Leave completely blank)*
   - **Build output directory:** `/` (or leave empty)
5. Click **Save and Deploy**. Cloudflare will deploy your site in ~15 seconds to a live URL like `https://taksal-web.pages.dev`.

---

### Method 2: Direct CLI Deployment with Wrangler (Zero Git Required)

If you prefer to deploy immediately from your terminal without pushing to GitHub first:
```bash
cd "/home/rahullagariya/AndroidStudioProjects/Taksal Web"
npx wrangler pages deploy . --project-name=taksal-web
```
Wrangler will prompt you to authenticate with Cloudflare in your browser once, create the project, and upload all static files directly.

---

## Custom Domain Setup (`taksal.com`)

To connect your own apex domain and `www` subdomain:

1. In your Cloudflare Pages project dashboard, click the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter `taksal.com` and click **Continue**.
4. If your domain's DNS is managed on Cloudflare:
   - Cloudflare will automatically configure the CNAME record (with CNAME flattening at apex).
5. If your domain is registered on another registrar (Namecheap, GoDaddy, Google Domains / Squarespace):
   - Add the following DNS record in your registrar's DNS panel:
     - **Type:** `CNAME`
     - **Name:** `@` (or `taksal.com`)
     - **Target / Value:** `taksal-web.pages.dev`
     - **Proxy status:** Proxied (if using Cloudflare DNS) or DNS only
   - Repeat for `www`:
     - **Type:** `CNAME`
     - **Name:** `www`
     - **Target / Value:** `taksal-web.pages.dev`
6. Cloudflare automatically issues and renews a free universal SSL/TLS certificate.

---

## Verifying `app-ads.txt` for Google AdMob

Google AdMob requires `app-ads.txt` to verify app ownership and protect your ad revenue from unauthorized inventory spoofing.

### 1. Test in Browser / Terminal
Once deployed, verify that `app-ads.txt` is publicly accessible at your root domain:
```bash
curl -I https://taksal.com/app-ads.txt
```
Expected response:
```http
HTTP/2 200
content-type: text/plain; charset=utf-8
cache-control: public, max-age=3600
access-control-allow-origin: *
```
And check file content:
```bash
curl https://taksal.com/app-ads.txt
```
Output:
```
google.com, pub-7030166934019393, DIRECT, f08c47fec0942fa0
```

### 2. Configure Google Play Developer Console
Google AdMob discovers your `app-ads.txt` URL by looking up the **Developer Website** listed on your Google Play Store store listing.

1. Open [Google Play Console](https://play.google.com/console).
2. Select your app: **Taksal** (`com.card.mint.cardbuilder`).
3. Navigate to **Grow** > **Store presence** > **Store settings**.
4. In the **Store listing contact details** section:
   - **Website:** Enter `https://taksal.com` (or your exact custom domain).
5. Navigate to **Policy and programs** > **App content** > **Privacy Policy**:
   - **Privacy Policy URL:** Enter `https://taksal.com/privacy.html`.
6. Click **Save**.

### 3. Check Status in Google AdMob Dashboard
1. Open [Google AdMob](https://admob.google.com/).
2. In the left sidebar, click **Apps** > **View all apps**.
3. Click the **app-ads.txt** tab at the top.
4. Locate `Taksal` (`com.card.mint.cardbuilder`).
5. Click **Check for updates**. Google's crawler will verify:
   - `https://taksal.com/app-ads.txt`
   - Publisher ID: `pub-7030166934019393`
   - Status changes from *"Needs attention"* to **"Authorized"** (green checkmark).

---

## Other Hosting Alternatives (Quick Reference)

### Option B: GitHub Pages
1. On GitHub, navigate to repository **Settings** > **Pages**.
2. Set Source to `Deploy from a branch` (`main` / `/root`).
3. Enter `taksal.com` under Custom domain, and check **Enforce HTTPS**.

### Option C: Netlify
1. Drag the entire `/home/rahullagariya/AndroidStudioProjects/Taksal Web` folder into `app.netlify.com/drop`.
2. Connect custom domain in **Domain management**.

### Option D: Custom Linux Nginx VPS
```bash
sudo cp -r "/home/rahullagariya/AndroidStudioProjects/Taksal Web/"* /var/www/taksal.com/
sudo certbot --nginx -d taksal.com -d www.taksal.com
```
