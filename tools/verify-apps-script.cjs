const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let stored={},locked=false;const sheet={getMaxColumns:()=>0};
const spreadsheet={getId:()=> 'test-englandmeds',getUrl:()=> 'https://example.invalid/sheet',getSheetByName:()=>({...sheet,getLastRow:()=>1})};
const context=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:k=>stored[k],setProperty:(k,v)=>stored[k]=v})},SpreadsheetApp:{getActiveSpreadsheet:()=>spreadsheet,openById:id=>{assert.equal(id,'test-englandmeds');return spreadsheet}},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})},LockService:{getScriptLock:()=>({waitLock:()=>locked=true,hasLock:()=>locked,releaseLock:()=>locked=false})}});
vm.runInContext(fs.readFileSync('google-apps-script/reviews.gs','utf8'),context);
assert.equal(context.doGet({parameter:{action:'health'}}).ok,false);
assert.equal(context.setup().ok,true);
assert.equal(context.doGet({parameter:{action:'health'}}).spreadsheetId,'test-englandmeds');
assert.equal(context.doPost({postData:{contents:'{"action":"unsupported"}'}}).ok,false);assert.equal(locked,false);
console.log('Apps Script setup, explicit spreadsheet access, health and lock release passed with mocks.');
const commerce=fs.readFileSync('assets/js/commerce.js','utf8');const mappingContext=vm.createContext({location:{pathname:'/shop/'},document:{querySelector:()=>null},window:{}});
vm.runInContext(commerce.slice(commerce.indexOf('var pricing='),commerce.indexOf('var cart=[]')),mappingContext);
for(const file of fs.readdirSync('shop/medicine')){if(file.endsWith('.html'))assert.ok(mappingContext.slugMap[file.slice(0,-5)],file)}
console.log('All 15 medicine URLs map to a pricing family.');
