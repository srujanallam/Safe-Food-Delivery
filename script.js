/***********************
  GLOBAL STATE
************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/***********************
  AUTH & ROLE GUARD
************************/
const role = localStorage.getItem("role");
const page = window.location.pathname;

// Redirect to login if not logged in
if (!role && !page.includes("login.html")) {
  window.location.href = "login.html";
}

// Customer page protection
if (page.includes("index.html") && role && role !== "customer") {
  document.body.innerHTML = `
    <h2>Access Denied</h2>
    <p>Customer access only</p>
    <a href="login.html">Go to Login</a>
  `;
}

// Restaurant page protection
if (page.includes("restaurant.html") && role && role !== "restaurant") {
  document.body.innerHTML = `
    <h2>Access Denied</h2>
    <p>Restaurant access only</p>
    <a href="login.html">Go to Login</a>
  `;
}

/***********************
  LOGIN
************************/
function login(selectedRole) {
  localStorage.setItem("role", selectedRole);

  if (selectedRole === "restaurant") {
    window.location.href = "restaurant.html";
  } else {
    window.location.href = "index.html";
  }
}

/***********************
  LOGOUT
************************/
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

/***********************
  CART LOGIC
************************/
function addItem(name, price, btn) {
  const packCost = Number(btn.previousElementSibling.value);
  cart.push({ name, price, packCost });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart");
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  let total = 0;
  container.innerHTML = "";

  cart.forEach(item => {
    const cost = item.price + item.packCost;
    total += cost;
    container.innerHTML += `<p>${item.name} - ₹${cost}</p>`;
  });

  document.getElementById("total").innerText = total;
}

/***********************
  ORDER LOGIC
************************/
function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  orders.push({
    items: cart,
    status: "Preparing"
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  localStorage.removeItem("cart");

  alert("Order placed successfully!");
  window.location.href = "track.html";
}

function trackOrder() {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;

  if (orders.length === 0) {
    statusEl.innerText = "No active order";
  } else {
    statusEl.innerText = orders[orders.length - 1].status;
  }
}

/***********************
  RESTAURANT DASHBOARD
************************/
function restaurantView() {
  const container = document.getElementById("orders");
  if (!container) return;

  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet</p>";
    return;
  }

  orders.forEach((order, index) => {
    container.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;">
        <p><strong>Order #${index + 1}</strong></p>
        <p>Status: ${order.status}</p>
        <button onclick="updateStatus(${index})">Mark Ready</button>
      </div>
    `;
  });
}

function updateStatus(index) {
  orders[index].status = "Ready for Delivery";
  localStorage.setItem("orders", JSON.stringify(orders));
  alert("Order marked Ready");
  location.reload();
}

/***********************
  AUTO INIT
************************/
renderCart();
trackOrder();
restaurantView();
