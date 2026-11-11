const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const file=require('node:path').join(__dirname,'../assets/js/shop-core.js');
test('Shop-Rechenlogik ist vorhanden',()=>assert.ok(fs.existsSync(file),'Shop-Logik fehlt'));
if(fs.existsSync(file)){
 const shop=require(file);
 test('3 × 6,99 € plus 6,90 € Versand sind 27,87 €',()=>assert.deepEqual(shop.totals([{price:699,quantity:3}]),{subtotal:2097,shipping:690,total:2787,tax:445}));
 test('Leerer Warenkorb verursacht keine Versandkosten',()=>assert.equal(shop.totals([]).total,0));
 test('Ungültige Mengen werden auf 1 bis 99 begrenzt',()=>{assert.equal(shop.quantity(-2),1);assert.equal(shop.quantity('abc'),1);assert.equal(shop.quantity(1000),99);});
}
