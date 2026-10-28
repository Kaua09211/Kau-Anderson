const products = [
 {id:1,name:'Fone Bluetooth Pulse',category:'Tecnologia',emoji:'🎧',price:189.90,old:249.90,badge:'-24%',rating:'4,8',reviews:128,color:'#edf0e8'},
 {id:2,name:'Smartwatch Active',category:'Tecnologia',emoji:'⌚',price:279.90,old:349.90,badge:'MAIS VENDIDO',rating:'4,7',reviews:96,color:'#f0eee7'},
 {id:3,name:'Luminária Minimal',category:'Casa',emoji:'💡',price:89.90,old:119.90,badge:'-25%',rating:'4,9',reviews:74,color:'#f5eee5'},
 {id:4,name:'Mochila Urban',category:'Moda',emoji:'🎒',price:159.90,old:199.90,badge:'-20%',rating:'4,6',reviews:83,color:'#edf0e9'},
 {id:5,name:'Garrafa Térmica',category:'Casa',emoji:'🧴',price:69.90,old:89.90,badge:'OFERTA',rating:'4,8',reviews:211,color:'#e9f1ee'},
 {id:6,name:'Tênis Move',category:'Esportes',emoji:'👟',price:229.90,old:299.90,badge:'-23%',rating:'4,7',reviews:57,color:'#f4ece4'},
 {id:7,name:'Caixa de Som Mini',category:'Tecnologia',emoji:'🔊',price:119.90,old:159.90,badge:'-25%',rating:'4,5',reviews:142,color:'#eceef4'},
 {id:8,name:'Kit de Vasos',category:'Casa',emoji:'🪴',price:99.90,old:129.90,badge:'NOVO',rating:'4,9',reviews:38,color:'#eaf0e5'}
];
const money = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let activeCategory='Todos', query='', cart={};
const grid=document.getElementById('productGrid'), empty=document.getElementById('emptyState');
function renderProducts(){
 let list=products.filter(p=>(activeCategory==='Todos'||p.category===activeCategory)&&p.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
 const sort=document.getElementById('sortSelect').value;
 if(sort==='low')list.sort((a,b)=>a.price-b.price); if(sort==='high')list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image" style="background:${p.color}"><span class="product-badge">${p.badge}</span><span class="emoji" aria-hidden="true">${p.emoji}</span></div><p class="product-category">${p.category}</p><h3>${p.name}</h3><div class="rating">★★★★★ <span>${p.rating} (${p.reviews})</span></div><div class="price-line"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div><p class="installments">ou 3x de ${money(p.price/3)} sem juros</p><button class="add-button" data-add="${p.id}">Adicionar ao carrinho +</button></article>`).join('');
 empty.classList.toggle('hidden',list.length!==0);
}
function setCategory(cat){activeCategory=cat;document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('active',b.dataset.filter===cat));document.getElementById('categorySelect').value=cat;renderProducts()}
document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();setCategory(el.dataset.filter);document.getElementById('products').scrollIntoView({behavior:'smooth'})}));
document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();query=document.getElementById('searchInput').value.trim();setCategory(document.getElementById('categorySelect').value);document.getElementById('products').scrollIntoView({behavior:'smooth'})});
document.getElementById('categorySelect').addEventListener('change',e=>setCategory(e.target.value));
document.getElementById('sortSelect').addEventListener('change',renderProducts);
grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const id=Number(b.dataset.add);cart[id]=(cart[id]||0)+1;renderCart();showToast('Produto adicionado ao carrinho!')});
const drawer=document.getElementById('cartDrawer'),overlay=document.getElementById('overlay');
function openCart(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');overlay.classList.remove('hidden');document.body.style.overflow='hidden'}
function closeCart(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');overlay.classList.add('hidden');document.body.style.overflow=''}
document.getElementById('cartToggle').addEventListener('click',openCart);document.getElementById('closeCart').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
function renderCart(){
 const count=Object.values(cart).reduce((a,b)=>a+b,0);document.getElementById('cartCount').textContent=count;
 const items=Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>({p:products.find(p=>p.id===Number(id)),q}));
 document.getElementById('cartItems').innerHTML=items.length?items.map(({p,q})=>`<div class="cart-item"><div class="cart-thumb">${p.emoji}</div><div><h3>${p.name}</h3><small>${money(p.price)}</small><div class="qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${q}</span><button data-qty="${p.id}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div><div><strong style="font-size:12px">${money(p.price*q)}</strong><br><button class="remove" data-remove="${p.id}">Remover</button></div></div>`).join(''):'<div class="cart-empty"><div style="font-size:40px;margin-bottom:12px">🛍️</div>Seu carrinho está vazio.<br>Explore os produtos e adicione seus favoritos!</div>';
 document.getElementById('subtotal').textContent=money(items.reduce((sum,{p,q})=>sum+p.price*q,0));
}
document.getElementById('cartItems').addEventListener('click',e=>{const qty=e.target.closest('[data-qty]'),remove=e.target.closest('[data-remove]');if(qty){const id=Number(qty.dataset.qty);cart[id]=(cart[id]||0)+Number(qty.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart()}if(remove){delete cart[Number(remove.dataset.remove)];renderCart()}});
document.getElementById('checkoutBtn').addEventListener('click',()=>{if(!Object.keys(cart).length){showToast('Adicione produtos antes de continuar.');return}showToast('Demonstração: checkout não realiza pagamentos.');});
let toastTimer;function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('emailInput').value;showToast('Obrigado! Cadastro demonstrativo recebido.');e.target.reset()});
document.getElementById('accountBtn').addEventListener('click',()=>showToast('Área de conta demonstrativa.'));
document.getElementById('ordersBtn').addEventListener('click',()=>showToast('Você ainda não possui pedidos nesta demonstração.'));
document.getElementById('allCategories').addEventListener('click',()=>{setCategory('Todos');document.getElementById('products').scrollIntoView({behavior:'smooth'})});
document.getElementById('backTop').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})});
renderProducts();renderCart();
