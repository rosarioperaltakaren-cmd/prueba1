document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  updateCartBadge();

  setupHamburger();
  setupProductDetail();
  setupCatalog();
  setupFeatured();
  setupContactForm();
});

function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }
}

function setupFeatured() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;
  const featured = products.slice(0, 6);
  renderProducts(container, featured);
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

function setupCatalog() {
  const container = document.getElementById('catalogProducts');
  const filters = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if (!container) return;

  let activeCategory = 'todas';
  let searchQuery = '';

  function filterProducts() {
    let filtered = products;
    if (activeCategory !== 'todas') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    renderProducts(container, filtered);
    container.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
  }

  function onCategorySelect(cat) {
    activeCategory = cat;
    renderCategories(filters, activeCategory, onCategorySelect);
    filterProducts();
  }

  renderCategories(filters, activeCategory, onCategorySelect);
  filterProducts();

  if (searchInput && searchBtn) {
    function doSearch() {
      searchQuery = searchInput.value;
      filterProducts();
    }
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }
}

function setupProductDetail() {
  const container = document.getElementById('productDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = getProduct(id);

  if (!product) {
    container.innerHTML = `
      <div class="container">
        <p style="text-align:center;padding:80px 0;color:var(--gray-600);">
          Producto no encontrado. <a href="catalog.html">Ver catálogo</a>
        </p>
      </div>
    `;
    return;
  }

  const breadcrumb = document.getElementById('productBreadcrumb');
  if (breadcrumb) breadcrumb.textContent = product.name;

  container.innerHTML = `
    <div class="container product-detail">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info-detailed">
        <span class="category-tag">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="price-large">$${product.price} <span style="font-size:1rem;font-weight:400;color:var(--gray-600);">/ ${product.unit}</span></p>
        <div class="meta">
          <span>📦 ${product.unit === 'pieza' || product.unit === 'docena' || product.unit === 'manojo' ? 'Por ' + product.unit : 'Precio por ' + product.unit}</span>
          <span>🌱 Categoría: ${product.category}</span>
        </div>
        <p class="description-large">${product.description}</p>
        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
          Agregar al carrito
        </button>
        <a href="catalog.html" class="btn btn-secondary" style="margin-left:8px;">Seguir comprando</a>
      </div>
    </div>
  `;

  const addBtn = container.querySelector('.add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', () => addToCart(product.id));
  }
}

function setupContactForm() {
  const btn = document.getElementById('contactSubmit');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
      showNotification('Por favor completa los campos obligatorios.');
      return;
    }

    showNotification('Mensaje enviado. Te responderemos pronto.');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
  });
}

function showNotification(text) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.classList.remove('show'), 3000);
}
