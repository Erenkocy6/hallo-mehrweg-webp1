/* Run after npm start. Uses Playwright from npm or PLAYWRIGHT_MODULE. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();const errors=[];const remote=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8080/'))remote.push(r.url());});
 const base='http://127.0.0.1:8080/';
 const files=fs.readdirSync(path.join(__dirname,'..')).filter(x=>x.endsWith('.html'));
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  for(const file of files){
   await page.goto(base+file);await page.evaluate(()=>document.fonts.ready);await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${file}: horizontal overflow at ${width}`);
   assert.ok(await page.evaluate(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0)),`${file}: broken image`);
  }
 }
 console.log(`PASS: ${files.length} pages × 4 widths, images, overflow, console and network`);
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'produkte.html');
 assert.equal(await page.locator('.product-card:visible').count(),12);
 await page.selectOption('#filter-material','Holz');assert.equal(await page.locator('.product-card:visible').count(),4);
 await page.selectOption('#sort','price-desc');
 const prices=await page.locator('.product-card:visible').evaluateAll(xs=>xs.map(x=>+x.dataset.price));assert.deepEqual(prices,[...prices].sort((a,b)=>b-a));
 await page.selectOption('#filter-color','Weiß');assert.equal(await page.locator('.product-card:visible').count(),0);
 assert.ok(await page.locator('#no-results').isVisible());
 await page.goto(base+'produkte.html?q=Kokos');assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.goto(base+'produkte.html?kategorie=flaschen');assert.equal(await page.locator('.product-card:visible').count(),1);
 console.log('PASS: combined filters, empty result, sorting, search, category links');
 await page.goto(base+'produkt-kokos.html');
 await page.fill('#quantity','3');await page.click('[data-add="kokos"]');await page.click('[data-wish="kokos"]');
 await page.goto(base+'merkliste.html');assert.equal(await page.locator('.product-card:visible').count(),1);
 await page.goto(base+'warenkorb.html');assert.equal(await page.inputValue('#cart-kokos'),'3');assert.match(await page.locator('#cart-content').innerText(),/27,87/);
 await page.goto(base+'bestellung.html');assert.equal(await page.locator('#order-submit').isEnabled(),true);
 await page.click('#order-submit');assert.equal(await page.evaluate(()=>document.querySelector('#checkout').checkValidity()),false);
 for(const [id,val] of Object.entries({'first-name':'Demo','last-name':'Test','street':'Testweg','house-number':'1','postal-code':'12345','city':'Teststadt','email':'demo@example.test'}))await page.fill('#'+id,val);
 await page.check('#terms');await page.click('#order-submit');assert.match(await page.locator('#checkout-status').innerText(),/Demo abgeschlossen: 27,87/);
 assert.equal(await page.inputValue('#email'),'');
 console.log('PASS: quantity, cart persistence, wishlist, form validation and demo checkout');
 await page.goto(base+'produkt-kokos.html');await page.click('[data-bs-target="#comment-form"]');
 await page.fill('#comment-name','<script>demo</script>');await page.fill('#comment-text','<img src=x onerror=alert(1)>');await page.click('#comment-form button');
 assert.equal(await page.locator('#comments script').count(),0);assert.equal(await page.locator('#comments img').count(),0);assert.match(await page.locator('#comments').innerText(),/<img src=x/);
 await page.click('[data-gallery][data-position="left"]');assert.ok(await page.locator('main .ratio img').first().evaluate(img=>img.classList.contains('photo-top')));
 await page.goto(base+'kontakt.html');await page.fill('#contact-name','Demo');await page.fill('#contact-email','demo@example.test');await page.fill('#contact-message','Testnachricht');await page.click('#contact button');assert.match(await page.locator('#contact-status').innerText(),/nicht versendet/);
 await page.goto(base+'ueber-uns.html');await page.click('[data-bs-target="#faq-1"]');await page.locator('#faq-1.show').waitFor();
 await page.setViewportSize({width:390,height:844});await page.goto(base+'index.html');await page.click('.navbar-toggler');await page.locator('#navigation.show').waitFor();assert.ok(await page.locator('#navigation a[href="produkte.html"]').isVisible());
 console.log('PASS: safe comments, gallery, contact, FAQ and mobile navigation');
 await page.goto(base+'datenschutz.html');await page.click('#clear-data');assert.equal(await page.evaluate(()=>localStorage.length),0);
 await page.goto(base+'bestellung.html');assert.equal(await page.locator('#order-submit').isDisabled(),true);
 assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
 // Screenshots are local verification artifacts, excluded from the submission archive.
 fs.mkdirSync(path.join(__dirname,'../test-results'),{recursive:true});
 for(const [file,width] of [['index.html',1440],['index.html',390],['produkte.html',1440],['produkt-kokos.html',1440],['bestellung.html',390]]){
  await page.setViewportSize({width,height:1000});await page.goto(base+file);await page.evaluate(()=>document.fonts.ready);await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});await page.screenshot({path:path.join(__dirname,`../test-results/${file}-${width}.png`),fullPage:true});
 }
 // Offline-compatible direct opening of HTML files, without a dev server.
 const offline=await browser.newContext();await offline.setOffline(true);const local=await offline.newPage();
 await local.goto('file://'+path.join(__dirname,'../index.html'));await local.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});assert.equal(await local.locator('h1').count(),1);assert.ok(await local.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth)));
 await local.goto('file://'+path.join(__dirname,'../produkte.html'));assert.equal(await local.locator('.product-card:visible').count(),12);
 console.log('PASS: delete stored data, empty-cart guard, no external requests, file:// offline');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
