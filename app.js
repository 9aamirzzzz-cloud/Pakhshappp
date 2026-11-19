const $=id=>document.getElementById(id);
const key='pakhshapp_v1';
let db=JSON.parse(localStorage.getItem(key)||'{"products":[],"orders":[]}');
const fa=n=>Number(n||0).toLocaleString('fa-IR');
const toman=n=>fa(n)+' تومان';
const save=()=>{localStorage.setItem(key,JSON.stringify(db));render()};
const totalStock=p=>p.cartons*p.per;
function render(){
 $('today').textContent=new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium'}).format(new Date());
 $('s-products').textContent=fa(db.products.length);$('s-orders').textContent=fa(db.orders.length);
 $('s-sales').textContent=toman(db.orders.reduce((s,o)=>s+o.total,0));
 $('product-list').innerHTML=db.products.map((p,i)=>`<div class="item"><div><b>${p.name}</b><small>موجودی: ${fa(p.cartons)} کارتن × ${fa(p.per)} = ${fa(totalStock(p))} عدد</small><small>خرید: ${toman(p.buy)} | فروش پیشنهادی: ${toman(p.sell)}</small></div><button class="secondary" onclick="removeProduct(${i})">حذف</button></div>`).join('')||'<p>هنوز کالایی ثبت نشده است.</p>';
 $('o-product').innerHTML=db.products.map((p,i)=>`<option value="${i}">${p.name} — موجودی ${fa(totalStock(p))} عدد</option>`).join('');
 $('order-list').innerHTML=db.orders.slice().reverse().map(o=>`<div class="item"><div><b>${o.customer}</b><small>${o.product} — ${fa(o.qty)} عدد × ${toman(o.price)}</small></div><b>${toman(o.total)}</b></div>`).join('')||'<p>هنوز سفارشی ثبت نشده است.</p>';
 const buy=db.products.reduce((s,p)=>s+totalStock(p)*p.buy,0),sales=db.orders.reduce((s,o)=>s+o.total,0),profit=db.orders.reduce((s,o)=>s+o.qty*(o.price-o.buy),0);
 $('r-buy').textContent=toman(buy);$('r-sales').textContent=toman(sales);$('r-profit').textContent=toman(profit);
}
window.removeProduct=i=>{if(confirm('این کالا حذف شود؟')){db.products.splice(i,1);save()}};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.view').forEach(x=>x.classList.add('hidden'));b.classList.add('active');$(b.dataset.view).classList.remove('hidden')});
$('product-form').onsubmit=e=>{e.preventDefault();db.products.push({name:$('p-name').value.trim(),cartons:+$('p-cartons').value,per:+$('p-per').value,buy:+$('p-buy').value,sell:+$('p-sell').value});e.target.reset();save()};
$('order-form').onsubmit=e=>{e.preventDefault();const p=db.products[+$('o-product').value];if(!p)return alert('ابتدا کالا ثبت کنید');const qty=+$('o-cartons').value*p.per+(+$('o-units').value);if(qty<=0)return alert('تعداد سفارش را وارد کنید');const available=totalStock(p);if(qty>available)return alert('موجودی انبار کافی نیست');let remain=available-qty;p.cartons=Math.floor(remain/p.per);const extra=remain%p.per;db.orders.push({customer:$('o-customer').value.trim(),product:p.name,qty,price:+$('o-price').value,buy:p.buy,total:qty*(+$('o-price').value),date:new Date().toISOString()});p.loose=extra;e.target.reset();save()};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
