// Paste the EnglandMeds Apps Script deployment ID or full /exec URL after deployment.
(function(){
  window.ENGLANDMEDS_DATA_SPREADSHEET_ID='AKfycbwsGoYVVBlIWjVJc1T8LqQx704EXynwJVaDjDA3rg-KBKNBhsiJiuUeAJnziiNXmrlG';
  var value='';
  if(!value){window.ENGLANDMEDS_DATA_API='';return;}
  window.ENGLANDMEDS_DATA_API=/^https:\/\/script\.google\.com\/macros\/s\//.test(value)
    ? value
    : 'https://script.google.com/macros/s/'+value.replace(/^\/+|\/+$/g,'')+'/exec';
})();
