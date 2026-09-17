# EnglandMeds static website

The site uses the supplied EnglandMeds HTML content, EnglandMeds logo palette, shared medicine pricing, WhatsApp/Telegram contacts, basket flow, and review/order Apps Script implementation.

## Connect englandmeds-data.xlsx

1. Open `englandmeds-data.xlsx` in the EnglandMeds Google Drive account.
2. Open Extensions > Apps Script and paste `google-apps-script/reviews.gs`.
3. Run `setup` once and approve access.
4. Deploy as a Web app and copy the URL ending in `/exec`.
5. Paste that URL or deployment ID into the `value` variable in `assets/js/config.js`.
6. Optionally paste the spreadsheet ID into `ENGLANDMEDS_DATA_SPREADSHEET_ID` for response verification.

The API deliberately ships unconfigured so EnglandMeds orders cannot be written into the MidlandsRx spreadsheet by mistake.

## Production review ? 17 September 2026

### Verified locally

- All 49 pages render at desktop (1440px) and mobile (390px) widths with no detected JavaScript errors, horizontal overflow, or broken loaded images.
- All 49 public page destinations resolve. Direct `.html` and `index.html` requests redirect permanently to clean URLs, preserving query strings.
- Original document-export HTML stays hidden during normal page initialization; a loading message appears instead. A timeout restores readable content if scripts fail. JavaScript-disabled visitors retain the source content.
- Medicine placeholders remain. Basket and contact navigation appear on all page types.
- Legacy redirects match exact paths, avoiding accidental matches against newer slugs.
- Internal Git, tools and Apps Script source paths are denied by Apache.
- Current medicine slugs map to the existing catalogue and pricing families rather than the generic fallback.

### Deployment

Upload the site contents and `.htaccess` to the domain document root on Apache with `mod_rewrite`, `mod_headers` and `AllowOverride All` enabled. Keep the actual `.html` files: Apache serves them internally under clean URLs. Opening files directly or using a static server that ignores `.htaccess` will not apply these redirects.

Use HTTPS for `www.englandmeds.co.uk`. After upload, check the home page, a category, medicine, blog post, `.html` redirects, and both contact checkout buttons on the real domain. DNS, the production certificate, hosting configuration and the uploaded deployment have not been verified by the local audit.

Do not upload `.git`, `tools`, `google-apps-script`, README.md, medicine-price-list.txt or sitemap-old.xml. Apache also denies requests for those internal paths/files.

### Integration still pending

`assets/js/config.js` has no Apps Script deployment URL. WhatsApp/Telegram checkout works without it; spreadsheet order recording and review submission do not. Set up the EnglandMeds spreadsheet, run `setup`, deploy the corrected Apps Script, then enter the `/exec` URL and optionally the spreadsheet ID in config.js. Check `?action=health` before enabling live recording. No real orders or reviews were submitted during testing.

The script now stores the bound spreadsheet ID during setup and opens it explicitly for web requests. It uses a script lock because document locks and active-document methods are unsuitable for web-app execution. References: https://developers.google.com/apps-script/guides/bound and https://developers.google.com/apps-script/reference/lock/lock-service.

Run `node tools/verify-production.cjs` with XAMPP Apache running for the page/redirect audit, and `node tools/verify-checkout-fallback.cjs` for simulated checkout failures. The test tools use the locally installed Playwright path and are development tools only.
