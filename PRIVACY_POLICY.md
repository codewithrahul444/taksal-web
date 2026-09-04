# Privacy Policy for Taksal Studio

**Effective Date:** September 4, 2026  
**Application Name:** Taksal (Taksal Studio)  
**Package Identifier:** `com.card.mint.cardbuilder`  
**Application Version:** 3.0.0 (Build 7)  
**Developer Entity:** Card Mint / Taksal Studio  
**Official Contact:** support@cardmint.app  

---

## 1. Overview & Data Sovereignty Principle

This Privacy Policy describes how **Taksal Studio** handles information when you use our Android application.

Taksal Studio is built around a foundational architectural commitment: **True Offline-First Data Sovereignty**. We do not operate proprietary backend servers to collect, harvest, aggregate, or sell your commercial records, client contact books, tax documents, or creative designs. All operations, vector layouts, database entries, and billing computations occur natively on your device.

---

## 2. Information Architecture & Local Storage

All user-generated business and creative data is stored exclusively on your physical device within application-private SQLite database tables managed by the Android Room persistence library:

1. **Design Artifacts:** Element coordinates, text layers, font styling, layer ordering, and background properties for business cards, logos, posters, flyers, banners, and social posts (stored in `designs` table).
2. **Business Profile & Brand Kits:** Business legal name, tagline, address, phone number, email address, GSTIN (Tax ID), and UPI Virtual Payment Address (VPA) for invoice letterheads (stored in `brand_kits` table).
3. **Invoices & Estimates:** Invoice identification numbers, customer names, client emails, itemized line goods/services, tax rates, total valuations, and payment status (stored in `invoices` and `quotations` tables).
4. **Point of Sale Receipts:** POS receipt numbers, customer names, payment methods (Cash/UPI/Card), item lists, tax rates, and timestamps (stored in `receipts` table).
5. **Inventory Records:** Product titles, unique SKU identifiers, stock quantities, unit prices, product categories, suppliers, and safety stock threshold levels (stored in `products` table).
6. **Expense Ledgers:** Categorized operational expenditure amounts, notes, and dates (stored in `expenses` table).

**Zero Cloud Sync:** None of the above commercial records are uploaded to or stored on our servers. Your data resides solely in your device's internal sandboxed storage (`/data/data/com.card.mint.cardbuilder/`).

---

## 3. Hardware-Backed Encryption Vault (Android KeyStore)

To protect sensitive business records and API keys against extraction from physical device theft or rooted environments, Taksal implements the **Android KeyStore Cryptographic Security Vault** (`SecureDatabaseHelper`):

* **Encryption Standard:** 256-bit AES (Advanced Encryption Standard) in GCM (Galois/Counter Mode) with 128-bit authentication tags and cryptographically secure 12-byte random initialization vectors (IVs).
* **Key Generation:** Master cryptographic keys are generated and securely stored inside the hardware Secure Enclave or Trusted Execution Environment (TEE) of your device.
* **Backup Extraction Guard:** The application explicitly sets `android:allowBackup="false"` in its manifest to block unauthorized ADB (Android Debug Bridge) or unencrypted cloud backup extraction.
* **Cleartext Guard:** The application enforces `android:usesCleartextTraffic="false"`, mandating encrypted TLS/HTTPS for any network communication.

---

## 4. Android Device Permissions

Taksal requests only the minimum Android system permissions required for operation:

| Permission | API Level | Purpose |
| :--- | :--- | :--- |
| `android.permission.INTERNET` | All | Delivers Google AdMob advertisements, handles Gemini AI API calls, and fetches open-source vector icons from Iconify. |
| `android.permission.ACCESS_NETWORK_STATE` | All | Detects network connectivity before sending network requests. |
| `android.permission.ACCESS_WIFI_STATE` | All | Optimizes ad rendering and connection bandwidth. |
| `android.permission.READ_MEDIA_IMAGES` | API 33+ (Android 13+) | Allows you to import photos, company logos, or backgrounds from your photo gallery into designs. |
| `android.permission.READ_EXTERNAL_STORAGE` | API ≤ 32 | Legacy storage permission for importing user images into canvas designs. |
| `android.permission.WRITE_EXTERNAL_STORAGE` | API ≤ 28 | Legacy storage permission allowing exported designs and PDFs to be saved to public device storage. |
| `com.google.android.gms.permission.AD_ID` | API 33+ | Allows the Google Mobile Ads SDK to access the Google Advertising ID for advertising attribution and frequency capping. |

### Permissions We Explicitly DO NOT Request
* **No Camera permission:** Photos and logos are imported using Android's system photo picker.
* **No Location permissions:** Fine or coarse location is never accessed.
* **No Microphone or Audio permissions:** No audio recording occurs.
* **No Contacts permissions:** QR contact cards use data you manually type into the form.
* **No SMS or Phone permissions.**

---

## 5. Third-Party Advertising & Consent Management

Taksal Studio is provided 100% free of monetary charge. To support continuous maintenance and new feature development, the application displays advertisements served by **Google AdMob** (Google Mobile Ads SDK).

### A. Google User Messaging Platform (UMP) & GDPR / CCPA Compliance
* Taksal integrates Google's certified **User Messaging Platform (UMP)** SDK.
* Upon initial launch in the European Economic Area (EEA), United Kingdom, and Switzerland, users are presented with a consent form to manage personalized advertising and cookie/device identifier permissions.
* Users can re-surface and revise their consent choices at any time by navigating to **Settings > Consent & Privacy Choices**.
* If consent is declined, Google AdMob serves non-personalized, contextual ads.

### B. Ad Frequency & Cooldown Safeguards
* **Task Breakpoint Interstitials:** Interstitial ads only display at natural milestones (such as after an export completes).
* **60-Second Cooldown:** Interstitials enforce a strict 60-second cooldown timer (`Constants.MIN_INTERSTITIAL_COOLDOWN_MS = 60000`). If another action occurs within 60 seconds, the ad is suppressed.
* **Never During Active Design:** Ads never interrupt active editing on the vector canvas or invoice drafting.

---

## 6. Gemini 3.5 AI Studio

Taksal offers optional generative AI features powered by Google's Gemini models:

* **Ephemeral Memory Architecture:** AI conversation turns are kept strictly in transient memory during an active session and are never written to disk (`GeminiChatRepository`). Exiting the AI screen clears the session.
* **Encrypted API Keys:** When you enter your own Google AI Studio API key, it is encrypted on-device via Android KeyStore AES-256-GCM. Plaintext keys are never logged or sent to any server other than Google's official Gemini endpoint (`generativelanguage.googleapis.com`) over TLS.
* **Google Generative AI Privacy:** All requests sent to the Gemini API are governed by the Google Privacy Policy (https://policies.google.com/privacy).

---

## 7. Telemetry & Analytics

Taksal does NOT include invasive third-party telemetry suites (e.g. Facebook SDK, AppsFlyer, or data brokers). Internal events logged via `ProductAnalytics` are written to standard Android Logcat (`TaksalAnalytics`) for debugging export failures and ad callbacks, with production logs filtered to warnings and errors. No personal data or business records are included.

---

## 8. User Rights (GDPR, UK DPA, CCPA / CPRA)

Users retain full legal rights over their personal data:
* **Access & Export:** Export your designs (PNG, SVG, PDF) and business records (CSV, PDF) at any time.
* **Correction:** Edit business profiles, invoices, or inventory items directly in the app.
* **Consent Revocation:** Change your advertising consent preferences anytime via in-app Settings.
* **Sale of Data:** We do NOT sell, rent, or trade your personal information.

---

## 9. Data Deletion & Complete Account Erasure

Because Taksal does not maintain centralized cloud accounts, you possess direct control over complete data erasure:

1. **Reset All Preferences:** Navigate to **Settings > Reset All Settings** to restore default studio configurations.
2. **Empty Trash Vault:** Navigate to **Settings > Trash & Version Vault > Empty Vault** to permanently erase deleted designs.
3. **Complete Local Storage Erasure:** In Android **Settings > Apps > Taksal > Storage > Clear Storage**, delete all application data.
4. **Uninstall:** Removing the app from your device permanently purges all local databases, encrypted preferences, and hardware KeyStore keys.

---

## 10. Children's Privacy (COPPA)

Taksal Studio is designed for commercial and general creative use. We do not knowingly collect personal data from children under 13 (or 16 in the European Union). If you believe a child has provided personal details through our support channels, please notify us for immediate deletion.

---

## 11. Contact & Legal Inquiries

If you have questions regarding this Privacy Policy or wish to submit a compliance request:

* **Entity:** Card Mint / Taksal Studio Engineering Team
* **Email:** support@cardmint.app
* **Package Identifier:** `com.card.mint.cardbuilder`
* **Subject:** Privacy Compliance Inquiry — Taksal Studio
