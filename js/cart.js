function getCart() {
  try {
    return JSON.parse(localStorage.getItem('agroCart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('agroCart', JSON.stringify(cart));
}

function addToCart(productId) {
  let cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showNotification('Producto agregado al carrito');
}

function removeFromCart(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function updateQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
  }
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
}

function renderCartPage() {
  const container = document.getElementById('cartContent');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde nuestro catálogo</p>
        <a href="catalog.html" class="btn btn-primary">Ver catálogo</a>
      </div>
    `;
    return;
  }

  const itemsHtml = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <p class="cart-item-price">$${p.price} / ${p.unit}</p>
        </div>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${p.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${p.id}, 1)">+</button>
        </div>
        <p class="cart-item-price">$${(p.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" onclick="removeFromCart(${p.id})">✕</button>
      </div>
    `;
  }).join('');

  const total = getCartTotal();

  container.innerHTML = `
    <div class="cart-items">${itemsHtml}</div>
    <div class="cart-summary">
      <h3>Resumen</h3>
      <div class="summary-row">
        <span>Productos (${getCartCount()})</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Envío</span>
        <span>Por calcular</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <button class="btn btn-primary" onclick="checkout()">Procesar pedido</button>
      <a href="catalog.html" class="btn btn-secondary" style="display:block;text-align:center;margin-top:8px;">
        Seguir comprando
      </a>
    </div>
  `;
}

function checkout() {
  showNotification('Gracias por tu compra. Te contactaremos pronto.');
}
