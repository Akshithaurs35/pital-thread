const products = [
  {id:1,name:"Rose Garden Midi Dress",category:"Floral",price:1899,oldPrice:2399,rating:4.9,badge:"BESTSELLER",description:"Soft florals for sunny afternoons.",image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85"},
  {id:2,name:"The Everyday Linen Dress",category:"Everyday",price:1599,oldPrice:1999,rating:4.8,badge:"EASY FAVOURITE",description:"Breezy comfort with a relaxed fit.",image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85"},
  {id:3,name:"Midnight Bloom Maxi",category:"Maxi",price:2299,oldPrice:2899,rating:4.9,badge:"NEW",description:"A flowing silhouette for any plan.",image:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85"},
  {id:4,name:"Blush Occasion Dress",category:"Occasion",price:2799,oldPrice:3399,rating:4.7,badge:"OCCASION",description:"A little extra magic for celebrations.",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85"},
  {id:5,name:"Sunday Cotton Midi",category:"Midi",price:1299,oldPrice:1699,rating:4.6,badge:"",description:"Your favourite easy, everyday shape.",image:"https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85"},
  {id:6,name:"Petal Pink Wrap Dress",category:"Floral",price:1999,oldPrice:2499,rating:4.8,badge:"LOVED",description:"A flattering wrap with a feminine finish.",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85"},
  {id:7,name:"Golden Hour Summer Dress",category:"Everyday",price:1499,oldPrice:1899,rating:4.7,badge:"",description:"Lightweight, cheerful, and easy to style.",image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85"},
  {id:8,name:"Evening Elegance Dress",category:"Occasion",price:3199,oldPrice:3799,rating:4.9,badge:"SPECIAL PICK",description:"A graceful look for your next event.",image:"https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=900&q=85"}
];
const state={cart:load("petal-cart",{}),wishlist:load("petal-wishlist",[])};
const $=id=>document.getElementById(id);
const rupees=value=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function save(){localStorage.setItem("petal-cart",JSON.stringify(state.cart));localStorage.setItem("petal-wishlist",JSON.stringify(state.wishlist))}
function productCard(p){
 const wished=state.wishlist.includes(p.id),qty=Number(state.cart[p.id]||0);
 return `<article class="product-card"><div class="product-image-wrap">
 <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x800/f4e5e4/7c3e4e?text=Pretty+Dress'"/>
 ${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
 <button class="wish-button ${wished?"active":""}" data-wish="${p.id}" aria-label="${wished?"Remove from":"Add to"} wishlist" title="Wishlist">${wished?"♥":"♡"}</button>
 ${qty===0?`<button class="quick-add" data-add="${p.id}">＋ Add to cart</button>`:`<div class="card-quantity" aria-label="Quantity in cart"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease ${p.name} quantity">−</button><span><b>${qty}</b> in bag</span><button data-qty="${p.id}" data-change="1" aria-label="Increase ${p.name} quantity">＋</button></div>`}
 </div><div class="product-info"><span class="product-category">${p.category} dress</span><div class="product-title-row"><span class="product-title">${p.name}</span><span class="rating">★ ${p.rating}</span></div><div class="product-description">${p.description}</div><div class="price-row"><span class="price">${rupees(p.price)}</span><span class="old-price">${rupees(p.oldPrice)}</span></div></div></article>`;
}
function renderProducts(){
 const search=$("searchInput").value.trim().toLowerCase(),category=$("categoryFilter").value,sort=$("sortFilter").value;
 let list=products.filter(p=>(category==="all"||p.category===category)&&`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search));
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
 $("productGrid").innerHTML=list.map(productCard).join("");$("emptyState").classList.toggle("hidden",list.length>0);
}
function cartItems(){return Object.entries(state.cart).map(([id,qty])=>({product:products.find(p=>p.id===Number(id)),qty:Number(qty)})).filter(x=>x.product&&x.qty>0)}
function totals(){const items=cartItems();return{count:items.reduce((n,x)=>n+x.qty,0),total:items.reduce((n,x)=>n+x.product.price*x.qty,0)}}
function renderCounts(){const t=totals();$("cartCount").textContent=t.count;$("drawerCount").textContent=`${t.count} ${t.count===1?"item":"items"}`;$("wishlistCount").textContent=state.wishlist.length}
function renderCart(){
 const items=cartItems(),t=totals();$("cartSubtotal").textContent=rupees(t.total);
 if(!items.length){$("drawerItems").innerHTML='<div class="empty-cart"><span>♡</span>Your bag is waiting for something lovely.<br/>Add a dress to get started.</div>';$("drawerBottom").classList.add("hidden")}
 else{$("drawerBottom").classList.remove("hidden");$("drawerItems").innerHTML=items.map(({product:p,qty})=>`<div class="cart-item"><img src="${p.image}" alt="${p.name}"/><div><h3>${p.name}</h3><div class="item-price">${rupees(p.price)} each</div><div class="quantity-control"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">＋</button></div><button class="remove-item" data-remove="${p.id}">Remove</button></div><b class="line-total">${rupees(p.price*qty)}</b></div>`).join("")}
 const remaining=Math.max(0,1999-t.total);$("shippingCopy").textContent=remaining?`You're ${rupees(remaining)} away from free shipping`:"You've unlocked free shipping!";$("shippingProgress").style.width=`${Math.min(100,t.total/1999*100)}%`;renderCounts();
}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2200)}
function addToCart(id){state.cart[id]=(Number(state.cart[id])||0)+1;save();renderProducts();renderCart();toast(`${products.find(p=>p.id===id).name} added to bag`)}
function changeQuantity(id,change){state.cart[id]=(Number(state.cart[id])||0)+change;if(state.cart[id]<=0)delete state.cart[id];save();renderProducts();renderCart()}
function toggleWishlist(id){const idx=state.wishlist.indexOf(id);if(idx>=0){state.wishlist.splice(idx,1);toast("Removed from wishlist")}else{state.wishlist.push(id);toast("Saved to your wishlist")}save();renderProducts();renderCounts()}
function openDrawer(){$("drawerBackdrop").classList.add("open");$("drawerBackdrop").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeDrawer(){$("drawerBackdrop").classList.remove("open");$("drawerBackdrop").setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
 const wish=e.target.closest("[data-wish]");if(wish)toggleWishlist(Number(wish.dataset.wish));
 const qty=e.target.closest("[data-qty]");if(qty)changeQuantity(Number(qty.dataset.qty),Number(qty.dataset.change));
 const remove=e.target.closest("[data-remove]");if(remove){delete state.cart[remove.dataset.remove];save();renderProducts();renderCart();toast("Dress removed from bag")}
});
$("searchInput").addEventListener("input",renderProducts);$("categoryFilter").addEventListener("change",renderProducts);$("sortFilter").addEventListener("change",renderProducts);
$("shopNow").addEventListener("click",()=>$("collection").scrollIntoView({behavior:"smooth"}));
$("cartNav").addEventListener("click",()=>{renderCart();openDrawer()});
$("wishlistNav").addEventListener("click",()=>{if(!state.wishlist.length){toast("Your wishlist is empty — tap ♡ on a dress");return}const names=state.wishlist.map(id=>products.find(p=>p.id===id)?.name).filter(Boolean);toast(`Wishlist: ${names.slice(0,2).join(", ")}${names.length>2?` +${names.length-2} more`:""}`)});
$("closeDrawer").addEventListener("click",closeDrawer);$("drawerBackdrop").addEventListener("click",e=>{if(e.target===$("drawerBackdrop"))closeDrawer()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer()});
$("checkoutButton").addEventListener("click",()=>toast("Demo checkout only — no payment was taken."));
renderProducts();renderCart();
