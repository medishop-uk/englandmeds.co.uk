const { chromium } = require('C:/Users/Hp/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({headless:true});
 const routes = ['', 'blog/', 'blog/post/generalised-anxiety-disorder-vs-panic-disorder', 'shop/', 'shop/category/anxiety-and-panic-disorders', 'shop/medicine/diazepam-martin-dow-10mg-elm', 'service-area/best-online-drugstore-in-england', 'service-area/safe-online-pharmacy-in-workington-englandmeds-uk'];
 const errors=[];
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes) {
   await page.goto('http://localhost/englandmeds.co.uk/'+route,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),photos:document.querySelectorAll('.medicine-photo img,.editorial-photo img,.article-photo img').length}));
   console.log(JSON.stringify({width,route,...result}));
   if(result.overflow||result.broken.length||!result.photos)errors.push({width,route,...result});
  }
  await page.close();
 }
 await browser.close();
 if(errors.length){console.error(errors);process.exitCode=1;}
})();
