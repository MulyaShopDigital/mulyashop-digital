const CONFIGURED=!/^ISI_/.test(CFG.URL)&&!/^ISI_/.test(CFG.KEY);
const sb=supabase.createClient(CONFIGURED?CFG.URL:'https://placeholder.supabase.co',CONFIGURED?CFG.KEY:'placeholder');
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp=n=>'Rp'+Number(n).toLocaleString('id-ID');
const cart={get(){try{return JSON.parse(localStorage.ms_cart||'[]')}catch{return[]}},set(a){localStorage.ms_cart=JSON.stringify(a);badge()},
 add(id){const a=this.get();if(a.includes(id))return toast('Produk sudah ada di keranjang');a.push(id);this.set(a);toast('Ditambahkan ke keranjang')},
 remove(id){this.set(this.get().filter(x=>x!==id))},clear(){this.set([])}};
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.append(t)}t.textContent=m;t.className='show';setTimeout(()=>t.className='',2200)}
function badge(){const b=$('#cb');if(b)b.textContent=cart.get().length}
const imgUrl=p=>p?sb.storage.from('product-images').getPublicUrl(p).data.publicUrl:'';
const session=async()=>(await sb.auth.getSession()).data.session;
const EMPTY='<div class="empty"><h3>Belum Ada Produk</h3><p>Produk digital Mulyashop akan segera hadir. Silakan kembali lagi nanti.</p></div>';
const card=p=>`<a class="card" href="product-detail.html?slug=${encodeURIComponent(p.slug)}"><div class="im">${p.image_path?`<img loading="lazy" src="${esc(imgUrl(p.image_path))}" alt="${esc(p.name)}">`:'🌸'}</div><div class="cb"><small>${esc(p.categories?.name||'')}</small><h3>${esc(p.name)}</h3><b>${rp(p.price)}</b></div></a>`;
const fnCall=async(name,body,method='POST')=>{const s=await session();const r=await fetch('/.netlify/functions/'+name,{method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+(s?.access_token||'')},body:method==='POST'?JSON.stringify(body):undefined});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Terjadi kesalahan.');return j};
function contactHtml(){const c=CFG.CONTACT||{},a=[];
 const wa=String(c.whatsapp||'').replace(/\D/g,'');if(wa)a.push(`<a href="https://wa.me/${wa}" rel="noopener">WhatsApp</a>`);
 if(/^\S+@\S+\.\S+$/.test(c.email||''))a.push(`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`);
 const ig=String(c.instagram||'').replace(/[^\w.]/g,'');if(ig)a.push(`<a href="https://instagram.com/${ig}" rel="noopener">Instagram</a>`);
 return a.length?`<p>${a.join(' · ')}</p>`:''}
async function mount(){
 document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="in"><a class="logo" href="index.html">🌸 Mulyashop Digital</a><nav id="nv"><a href="index.html">Home</a><a href="products.html">Produk</a><a href="index.html#kategori">Kategori</a><a href="index.html#tentang">Tentang Kami</a><a href="index.html#faq">FAQ</a><a href="#kontak">Kontak</a></nav><a class="ic" href="cart.html" aria-label="Keranjang">🛒<span id="cb">0</span></a><span id="acc"><a href="login.html">Masuk</a></span><button id="hb" aria-label="Menu">☰</button></div></header>`);
 document.body.insertAdjacentHTML('beforeend',`<footer id="kontak"><b>Mulyashop Digital</b><p>Digital Store for Students</p>${contactHtml()}<small>© Mulyashop Digital</small></footer>`);
 if(!CONFIGURED)document.body.insertAdjacentHTML('afterbegin','<div style="background:#fff3cd;padding:8px;text-align:center;font-size:.85rem">Setup belum selesai: isi js/config.js (lihat README).</div>');
 $('#hb').onclick=()=>$('#nv').classList.toggle('open');badge();
 const s=await session();if(s)$('#acc').innerHTML=`<a href="account.html">${esc((s.user.user_metadata?.full_name||'Akun').split(' ')[0])}</a>`;}
