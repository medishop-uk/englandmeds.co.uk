// Paste the EnglandMeds Apps Script deployment ID or full /exec URL after deployment.
(function(){
  window.ENGLANDMEDS_DATA_SPREADSHEET_ID=''; // Set the actual spreadsheet ID, not a deployment ID.
  var value='';
  if(!value){window.ENGLANDMEDS_DATA_API='';return;}
  window.ENGLANDMEDS_DATA_API=/^https:\/\/script\.google\.com\/macros\/s\//.test(value)
    ? value
    : 'https://script.google.com/macros/s/'+value.replace(/^\/+|\/+$/g,'')+'/exec';
})();

// Recording an order is best effort; it must never block contact checkout.
window.englandmedsSaveOrder = async function(url, spreadsheetId, order) {
  if (!url) return false;
  var controller = new AbortController(), timer;
  try {
    return await Promise.race([
      (async function() {
        var response = await fetch(url, {
          method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'},
          body: JSON.stringify({action: 'createOrder', order: order, userAgent: navigator.userAgent}),
          signal: controller.signal
        });
        if (!response.ok) return false;
        var result = await response.json();
        return !!(result && result.ok && (!result.spreadsheetId || !spreadsheetId || result.spreadsheetId === spreadsheetId));
      })(),
      new Promise(function(resolve) {
        timer = setTimeout(function() { resolve(false); controller.abort(); }, 4000);
      })
    ]);
  } catch (error) {
    return false;
  } finally {
    clearTimeout(timer);
  }
};
