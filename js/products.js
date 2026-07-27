let products = [];

async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    products = await res.json();
    return products;
  } catch (e) {
    return [];
  }
}

function getProduct(id) {
  return products.find(p => p.id === id);
}

function getCategories() {
  const cats = [...new Set(products.map(p => p.category))];
  return cats.sort();
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <a href="product-detail.html?id=${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </a>
    <div class="product-info">
      <span class="category-tag">${product.category}</span>
      <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
      <p class="price">$${product.price} <span class="unit">/ ${product.unit}</span></p>
      <p class="description">${product.description}</p>
      <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
        Agregar al carrito
      </button>
    </div>
  `;
  return card;
}

function renderProducts(container, productList) {
  container.innerHTML = '';
  if (productList.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray-600);padding:40px 0;">No se encontraron productos.</p>';
    return;
  }
  productList.forEach(p => {
    container.appendChild(createProductCard(p));
  });
}

function renderCategories(container, activeCategory, onSelect) {
  container.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = `category-btn${activeCategory === 'todas' ? ' active' : ''}`;
  allBtn.textContent = 'Todas';
  allBtn.addEventListener('click', () => onSelect('todas'));
  container.appendChild(allBtn);

  getCategories().forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn${activeCategory === cat ? ' active' : ''}`;
    btn.textContent = cat;
    btn.addEventListener('click', () => onSelect(cat));
    container.appendChild(btn);
  });
}
