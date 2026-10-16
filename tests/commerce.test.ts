import { test, before, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createClient, type Client } from '@libsql/client'
import { publicSettings, orderTotals, validateCheckout, type CheckoutData } from '../lib/commerce'
let client: Client
let saveOrder: typeof import('../lib/order-service').saveOrder
let changeOrderStatus: typeof import('../lib/order-service').changeOrderStatus
let saveProduct: typeof import('../lib/product-service').saveProduct
let createBrandRecord: typeof import('../lib/brand-service').createBrandRecord
let deleteBrandRecord: typeof import('../lib/brand-service').deleteBrandRecord
const directory=mkdtempSync(join(tmpdir(),'binary-unit-'))
const order=(extra:Partial<CheckoutData>={}):CheckoutData=>({requestId:crypto.randomUUID(),customerName:'Audit Customer',customerPhone:'01700000000',address:'Audit address',shippingCity:'Dhaka',paymentMethod:'cod',items:[{id:'p1',quantity:2,price:1}],total:270,...extra})
before(async()=>{
  process.env.TURSO_DATABASE_URL=`file:${directory}/test.db`;delete process.env.TURSO_AUTH_TOKEN
  client=createClient({url:process.env.TURSO_DATABASE_URL})
  await client.executeMultiple(readFileSync('drizzle/0000_careful_shiver_man.sql','utf8'))
  ;({saveOrder,changeOrderStatus}=await import('../lib/order-service'))
  ;({saveProduct}=await import('../lib/product-service'))
  ;({createBrandRecord,deleteBrandRecord}=await import('../lib/brand-service'))
})
beforeEach(async()=>{
  await client.batch(['DELETE FROM order_items','DELETE FROM orders','DELETE FROM product_images','DELETE FROM reviews','DELETE FROM products','DELETE FROM brands','DELETE FROM store_settings',"INSERT INTO products(id,name,slug,price,stock,created_at,updated_at) VALUES('p1','Audit component','audit-component',100,5,1,1)","INSERT INTO store_settings(key,value,updated_at) VALUES('shipping_inside_dhaka','60',1),('shipping_outside_dhaka','120',1),('vat_percentage','5',1)"],'write')
})
after(()=>{client.close();rmSync(directory,{recursive:true,force:true})})
const stock=async()=>Number((await client.execute("SELECT stock FROM products WHERE id='p1'")).rows[0].stock)
const count=async()=>Number((await client.execute('SELECT count(*) AS n FROM orders')).rows[0].n)
test('public settings use an allowlist, including for unknown future credentials',()=>{
  assert.deepEqual(publicSettings({storeName:'Store',steadfast_api_key:'secret',steadfast_secret_key:'secret',future_password:'secret'}),{storeName:'Store'})
})
test('shipping and VAT totals are shared and rounded to paisa',()=>{
  assert.deepEqual(orderTotals(200,'Dhaka',{shipping_inside_dhaka:'60',vat_percentage:'5'}),{subtotal:200,shipping:60,tax:10,total:270})
  assert.equal(orderTotals(199.99,'Outside Dhaka',{vat_percentage:'5'}).total,329.99)
  assert.throws(()=>orderTotals(100,'Dhaka',{vat_percentage:'NaN'}))
})
for(const quantity of [-2,0,1.5,Infinity,1000])test(`reject invalid quantity ${quantity} without writes`,async()=>{
  await assert.rejects(saveOrder(order({items:[{id:'p1',quantity}]}),null));assert.equal(await stock(),5);assert.equal(await count(),0)
})
test('duplicates and non-finite total fail validation',()=>{
  assert.throws(()=>validateCheckout(order({items:[{id:'p1',quantity:1},{id:'p1',quantity:1}]})))
  assert.throws(()=>validateCheckout(order({total:NaN})))
})
test('invalid payment, missing payment reference and unconfigured prepaid are rejected',async()=>{
  await assert.rejects(saveOrder(order({paymentMethod:'wire'}),null))
  await assert.rejects(saveOrder(order({paymentMethod:'bkash'}),null))
  await assert.rejects(saveOrder(order({paymentMethod:'bkash',transactionId:'TEST_ONLY'}),null))
  assert.equal(await count(),0)
})
test('server prices override client line prices and total/stock persist atomically',async()=>{
  const data=order();const result=await saveOrder(data,null)
  assert.equal(result.total,270);assert.equal(await stock(),3)
  assert.equal((await client.execute('SELECT price FROM order_items')).rows[0].price,100)
  assert.equal((await client.execute('SELECT total FROM orders')).rows[0].total,270)
})
test('wrong total is rejected and stock remains unchanged',async()=>{
  await assert.rejects(saveOrder(order({total:1}),null));assert.equal(await stock(),5)
})
test('insufficient stock never creates partial orders',async()=>{
  await assert.rejects(saveOrder(order({items:[{id:'p1',quantity:6}],total:690}),null));assert.equal(await count(),0);assert.equal(await stock(),5)
})
test('retry of the same request returns one order and decrements stock once',async()=>{
  const data=order();assert.deepEqual(await saveOrder(data,null),await saveOrder(data,null));assert.equal(await count(),1);assert.equal(await stock(),3)
  await assert.rejects(saveOrder({...data,address:'Different address'},null))
})
test('failure writing line items rolls back stock and order',async()=>{
  await client.execute("CREATE TRIGGER fail_items BEFORE INSERT ON order_items BEGIN SELECT RAISE(ABORT,'injected failure'); END")
  try {await assert.rejects(saveOrder(order(),null));assert.equal(await count(),0);assert.equal(await stock(),5)}finally{await client.execute('DROP TRIGGER fail_items')}
})
test('two checkouts cannot oversell the final stock',async()=>{
  await client.execute("UPDATE products SET stock=2 WHERE id='p1'")
  const results=await Promise.allSettled([saveOrder(order(),null),saveOrder(order(),null)])
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(await stock(),0);assert.equal(await count(),1)
})
test('cancellation restores inventory only once and cannot be reopened',async()=>{
  const result=await saveOrder(order(),null)
  await changeOrderStatus(result.orderId,'CANCELLED');await changeOrderStatus(result.orderId,'CANCELLED')
  assert.equal(await stock(),5);await assert.rejects(changeOrderStatus(result.orderId,'PROCESSING'))
})
test('prepaid shipping is blocked pending verification',async()=>{
  const result=await saveOrder(order(),null)
  await client.execute({sql:"UPDATE orders SET payment_method='bkash',payment_status='VERIFYING' WHERE id=?",args:[result.orderId]})
  await changeOrderStatus(result.orderId,'PROCESSING');await assert.rejects(changeOrderStatus(result.orderId,'SHIPPED'))
})
const form=()=>{const f=new FormData();for(const [key,value]of Object.entries({name:'New component',description:'Test part',price:'123',stock:'5',images:'["/logo.png"]',specs:'{"Voltage":"12V"}',warranty:'1 year'}))f.set(key,value);return f}
test('product save persists images, specs and warranty together',async()=>{
  const result=await saveProduct(form())
  const row=(await client.execute({sql:'SELECT specs,warranty FROM products WHERE id=?',args:[result.id]})).rows[0]
  assert.equal(row.specs,'{"Voltage":"12V"}');assert.equal(row.warranty,'1 year')
  assert.equal((await client.execute({sql:'SELECT count(*) AS n FROM product_images WHERE product_id=?',args:[result.id]})).rows[0].n,1)
})
test('malformed images cannot partially overwrite a product',async()=>{
  const f=form();f.set('images','["blob:expired"]')
  await assert.rejects(saveProduct(f,'p1'))
  assert.equal((await client.execute("SELECT name FROM products WHERE id='p1'")).rows[0].name,'Audit component')
})
test('missing product edits and negative pricing are rejected',async()=>{
  await assert.rejects(saveProduct(form(),'missing'))
  const f=form();f.set('price','-1');await assert.rejects(saveProduct(f))
})
for (const previous of ['', '0', '0.00', '   ']) test(`optional previous price ${JSON.stringify(previous)} saves without a discount`, async () => {
  const f = form(); f.set('comparePrice', previous)
  const result = await saveProduct(f)
  const row = (await client.execute({ sql: 'SELECT price,compare_price FROM products WHERE id=?', args: [result.id] })).rows[0]
  assert.equal(row.price, 123)
  assert.equal(row.compare_price, null)
})
test('editing can clear a previous price using zero or a blank value', async () => {
  const f = form(); f.set('comparePrice', '150')
  await saveProduct(f, 'p1')
  for (const value of ['0', '']) {
    f.set('comparePrice', value)
    await saveProduct(f, 'p1')
    assert.equal((await client.execute("SELECT compare_price FROM products WHERE id='p1'")).rows[0].compare_price, null)
  }
})
for (const previous of ['-1', 'not-a-price', 'Infinity', '10000001']) test(`invalid previous price ${previous} cannot partially save a product`, async () => {
  const f = form(); f.set('comparePrice', previous)
  await assert.rejects(saveProduct(f, 'p1'), /previous price/i)
  assert.equal((await client.execute("SELECT name FROM products WHERE id='p1'")).rows[0].name, 'Audit component')
})
test('brand creation normalizes whitespace and reuses existing names', async () => {
  const first = await createBrandRecord('  Mean   Well  ')
  const second = await createBrandRecord('mean well')
  assert.equal(first.brand.name, 'Mean Well')
  assert.equal(second.brand.id, first.brand.id)
  assert.equal(second.created, false)
  assert.equal((await client.execute('SELECT count(*) AS n FROM brands')).rows[0].n, 1)
})
test('brand names support Bangla and punctuation without conflating different brands', async () => {
  const bangla = await createBrandRecord('বাংলা ইলেকট্রনিক্স')
  assert.equal(bangla.brand.name, 'বাংলা ইলেকট্রনিক্স')
  const plain = await createBrandRecord('ACME')
  const punctuated = await createBrandRecord('ACME+')
  assert.notEqual(plain.brand.id, punctuated.brand.id)
  assert.equal((await createBrandRecord('acme+')).brand.id, punctuated.brand.id)
})
test('concurrent creation of the same brand does not create duplicates', async () => {
  const results = await Promise.allSettled([createBrandRecord('Concurrent brand'), createBrandRecord('Concurrent brand')])
  for (const result of results) assert.equal(result.status, 'fulfilled')
  if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') assert.equal(results[0].value.brand.id, results[1].value.brand.id)
  assert.equal((await client.execute('SELECT count(*) AS n FROM brands')).rows[0].n, 1)
})
test('a newly added brand is saved with the product and is protected from deletion', async () => {
  const { brand } = await createBrandRecord('New brand')
  const f = form(); f.set('brandId', brand.id); f.set('comparePrice', '0')
  const saved = await saveProduct(f)
  assert.equal((await client.execute({ sql: 'SELECT brand_id FROM products WHERE id=?', args: [saved.id] })).rows[0].brand_id, brand.id)
  await assert.rejects(deleteBrandRecord(brand.id), /used by products/)
  assert.equal((await client.execute('SELECT count(*) AS n FROM brands')).rows[0].n, 1)
})
test('unused brands can be deleted, while missing brands cannot be assigned', async () => {
  const { brand } = await createBrandRecord('Unused brand')
  await deleteBrandRecord(brand.id)
  const f = form(); f.set('brandId', brand.id)
  await assert.rejects(saveProduct(f), /existing brand/)
  assert.equal((await client.execute('SELECT count(*) AS n FROM products')).rows[0].n, 1)
})
test('invalid brand names never create records', async () => {
  for (const name of ['', '   ', '!!!', 'x'.repeat(151)]) await assert.rejects(createBrandRecord(name))
  assert.equal((await client.execute('SELECT count(*) AS n FROM brands')).rows[0].n, 0)
})
