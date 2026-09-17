const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/Hp/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({channel:'chrome'});
 try {
 for (const route of ['', 'shop/medicine/noctin-nitrazepam-5-mg-elm']) {
  for (const channel of ['whatsapp','telegram']) {
   for (const mode of ['missing','quota','network','invalid','rejected','timeout','success']) {
    const page = await browser.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(() => localStorage.setItem('englandmedsCart',JSON.stringify([{key:'test',slug:'test',name:'Test medicine',type:'Test variant',pieces:10,price:20,quantity:2}])));
    await page.route('http://localhost/englandmeds.co.uk/**', async r => {
     const fs=require('node:fs'),path=require('node:path');
     let file=decodeURIComponent(new URL(r.request().url()).pathname).replace('/englandmeds.co.uk/','');
     if(!file||file.endsWith('/'))file+='index.html';
     if(!path.extname(file))file+='.html';
     const full=path.resolve(__dirname,'..',file);
     if(!fs.existsSync(full))return r.fulfill({status:404,body:''});
     let body=fs.readFileSync(full);
     if(file==='assets/js/config.js')body=body.toString()+`\nwindow.ENGLANDMEDS_DATA_API=${JSON.stringify(mode==='missing'?'':'https://checkout-test.invalid/save')};`;
     const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'};
     await r.fulfill({body,contentType:types[path.extname(file)]||'application/octet-stream'});
    });
    await page.route('https://checkout-test.invalid/save',async r=>{
     if(mode==='timeout')return;
     if(mode==='network')return r.abort();
     await r.fulfill({status:mode==='quota'?429:200,contentType:'application/json',body:mode==='invalid'?'<html>Unavailable</html>':JSON.stringify({ok:mode==='success'})});
    });
    let destination;
    await page.route(/https:\/\/(wa\.me|t\.me)\//,r=>{destination=r.request().url();return r.fulfill({status:204});});
    await page.goto('http://localhost/englandmeds.co.uk/'+route,{waitUntil:'domcontentloaded'});
    await page.locator('[data-cart-open],[data-commerce-open]').first().click();
    await page.locator(route?`[data-checkout="${channel}"]`:`.checkout-buttons a[href*="${channel==='whatsapp'?'wa.me':'t.me'}"]`).click({noWaitAfter:true});
    const started=Date.now();while(!destination&&Date.now()-started<6500)await page.waitForTimeout(50);
    assert.ok(destination,`${route} ${channel} ${mode}: no redirect`);
    if(channel==='whatsapp')assert.match(new URL(destination).searchParams.get('text'),/Test medicine[\s\S]*Total: .52/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('englandmedsCart')!==null),mode!=='success');
    assert.deepEqual(errors,[]);
    console.log(`${route||'home'} ${channel} ${mode}: passed`);
    await page.close();
   }
  }
 }
 } finally {await browser.close()}
})();

