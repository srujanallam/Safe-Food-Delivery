let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function login(role){
  localStorage.setItem('role', role);
  if(role==='restaurant') location.href='restaurant.html';
  else location.href='index.html';
}

function addItem(name, price, btn){
  const pack = Number(btn.previousElementSibling.value);
  cart.push({name, price, pack});
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart');
}

function renderCart(){
  const el = document.getElementById('cartItems');
  if(!el) return;
  let total = 0;
  el.innerHTML='';
  cart.forEach(i=>{
    total += i.price + i.pack;
    el.innerHTML += `<p>${i.name} - ₹${i.price+i.pack}</p>`;
  });
  document.getElementById('total').innerText = total;
}

function placeOrder(){
  orders.push({items:cart, status:'Preparing'});
  localStorage.setItem('orders', JSON.stringify(orders));
  cart = [];
  localStorage.removeItem('cart');
  alert('Order placed');
  location.href='track.html';
}

function trackOrder(){
  const el = document.getElementById('status');
  if(!el) return;
  if(orders.length>0) el.innerText = orders[orders.length-1].status;
}

function restaurantView(){
  if(localStorage.getItem('role')!=='restaurant'){
    document.body.innerHTML='Access Denied';
    return;
  }
  const el = document.getElementById('orders');
  if(!el) return;
  el.innerHTML='';
  orders.forEach((o,i)=>{
    el.innerHTML += `<div>
      <p>Order #${i+1} - ${o.status}</p>
      <button onclick="updateStatus(${i})">Mark Ready</button>
    </div>`;
  });
}

function updateStatus(i){
  orders[i].status='Ready for Delivery';
  localStorage.setItem('orders', JSON.stringify(orders));
  location.reload();
}

renderCart();
trackOrder();
restaurantView();
