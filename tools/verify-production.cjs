const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Hp/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const base='http://localhost/englandmeds.co.uk',root=path.resolve(__dirname,'..');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name==='.git'?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
(async()=>{
const files=walk(root).filter(f=>f.endsWith('.html'));const errors=[],links=new Set();
for(const file of files){const relative=path.relative(root,file).replaceAll('\\','/'),url='/'+relative.replace(/index\.html$/,'').replace(/\.html$/,'');
 const direct=await fetch(base+'/'+relative+'?audit=1',{redirect:'manual'});if(direct.status!==301||!direct.headers.get('location')?.endsWith(url+'?audit=1'))errors.push({relative,status:direct.status,location:direct.headers.get('location')});
 const response=await fetch(base+url);if(response.status!==200)errors.push({url,status:response.status});
}
const browser=await chromium.launch({channel:'chrome'});
try{
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.route(/https:\/\/(?!localhost)/,r=>r.abort());
 page.on('pageerror',e=>errors.push(e.message));
 for(const file of files){const url='/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'').replace(/\.html$/,'');
 await page.goto(base+url,{waitUntil:'load'});
 const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,loading:document.documentElement.classList.contains('page-loading'),nav:!!document.querySelector('.desktop-nav,.page-nav'),basket:!!document.querySelector('[data-cart-open],[data-commerce-open]'),links:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>h.startsWith(location.origin)),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
 result.links.forEach(l=>links.add(l.split('#')[0]));delete result.links;
 if(result.overflow||result.loading||!result.nav||!result.basket||result.broken.length)errors.push({url,width,...result});
 }
 await page.close();console.log(`Rendered ${files.length} pages at ${width}px`);
}
const page=await browser.newPage();await page.route('**/assets/js/pages.js*',async r=>{await new Promise(resolve=>setTimeout(resolve,1500));await r.continue()});
const navigating=page.goto(base+'/shop/medicine/noctin-nitrazepam-5-mg-elm',{waitUntil:'load'});await page.waitForSelector('html.page-loading',{state:'attached'});assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).visibility),'hidden');await navigating;assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).visibility),'visible');await page.close();
}finally{await browser.close()}
for(const url of links){const response=await fetch(url);if(response.status!==200)errors.push({link:url,status:response.status});if(/\.html(?:\?|$)/.test(url))errors.push({htmlLink:url});}
for(const url of ['/.git/config','/tools/verify-layout.cjs','/google-apps-script/reviews.gs']){assert.equal((await fetch(base+url)).status,403)}
console.log(JSON.stringify({pages:files.length,links:links.size,errors},null,2));if(errors.length)process.exitCode=1;
})();
