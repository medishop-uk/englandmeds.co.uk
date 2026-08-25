# EnglandMeds orders and reviews API

This Apps Script binds to the EnglandMeds `englandmeds-data.xlsx` workbook and manages the `orders` and `reviews-ratings` tabs.

1. Open the workbook and choose Extensions > Apps Script.
2. Paste `reviews.gs`, run `setup`, and approve access.
3. Deploy a Web app, then open its `/exec?action=health` URL.
4. Put the deployment ID or full `/exec` URL in `../assets/js/config.js`.

Order statuses: New, Contacted, Confirmed, Completed, Cancelled. Review statuses: Pending, Approved, Rejected.
