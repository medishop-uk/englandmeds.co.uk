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
