// SkillForge Inventory Management App

class InventoryApp {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentProductId = null;
    this.deleteProductId = null;
    
    this.init();
  }

  init() {
    this.cacheDOMElements();
    this.attachEventListeners();
    this.loadProducts();
  }

  cacheDOMElements() {
    // Main elements
    this.productsGrid = document.getElementById('products-grid');
    this.searchInput = document.getElementById('search-input');
    this.categoryFilter = document.getElementById('category-filter');
    
    // Statistics
    this.totalProductsEl = document.getElementById('total-products');
    this.totalQuantityEl = document.getElementById('total-quantity');
    this.categoriesCountEl = document.getElementById('categories-count');
    
    // Modals
    this.productModal = document.getElementById('product-modal');
    this.deleteModal = document.getElementById('delete-modal');
    this.modalTitle = document.getElementById('modal-title');
    
    // Form elements
    this.productForm = document.getElementById('product-form');
    this.productIdInput = document.getElementById('product-id');
    this.productNameInput = document.getElementById('product-name');
    this.productCategoryInput = document.getElementById('product-category');
    this.productDescriptionInput = document.getElementById('product-description');
    this.productPriceInput = document.getElementById('product-price');
    this.productQuantityInput = document.getElementById('product-quantity');
    this.productImageInput = document.getElementById('product-image');
    
    // Buttons
    this.addProductBtn = document.getElementById('add-product-btn');
    this.closeModalBtn = document.getElementById('close-modal');
    this.cancelBtn = document.getElementById('cancel-btn');
    this.closeDeleteModalBtn = document.getElementById('close-delete-modal');
    this.cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    this.confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // Notifications
    this.toast = document.getElementById('toast');
    this.loading = document.getElementById('loading');
  }

  attachEventListeners() {
    // Add product
    this.addProductBtn.addEventListener('click', () => this.openProductModal());
    
    // Close modals
    this.closeModalBtn.addEventListener('click', () => this.closeProductModal());
    this.cancelBtn.addEventListener('click', () => this.closeProductModal());
    this.closeDeleteModalBtn.addEventListener('click', () => this.closeDeleteModal());
    this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    
    // Form submission
    this.productForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    
    // Delete confirmation
    this.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
    
    // Search and filter
    this.searchInput.addEventListener('input', () => this.filterProducts());
    this.categoryFilter.addEventListener('change', () => this.filterProducts());
    
    // Close modal on backdrop click
    this.productModal.addEventListener('click', (e) => {
      if (e.target === this.productModal) this.closeProductModal();
    });
    this.deleteModal.addEventListener('click', (e) => {
      if (e.target === this.deleteModal) this.closeDeleteModal();
    });
  }

  // API Methods
  async loadProducts() {
    try {
      this.showLoading();
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (response.ok) {
        this.products = data.products;
        this.filteredProducts = [...this.products];
        this.renderProducts();
        this.updateStatistics();
        this.populateCategoryFilter();
      } else {
        this.showToast('Error loading products', 'error');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.showToast('Failed to load products', 'error');
    } finally {
      this.hideLoading();
    }
  }

  async saveProduct(productData) {
    try {
      this.showLoading();
      const isEdit = !!this.currentProductId;
      const url = isEdit ? `/api/products/${this.currentProductId}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.showToast(isEdit ? 'Course updated successfully' : 'Course added successfully', 'success');
        this.closeProductModal();
        this.loadProducts();
      } else {
        this.showToast(data.error || 'Error saving product', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      this.showToast('Failed to save product', 'error');
    } finally {
      this.hideLoading();
    }
  }

  async updateQuantity(id, quantity) {
    try {
      const response = await fetch(`/api/products/${id}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: parseInt(quantity) })
      });
      
      if (response.ok) {
        this.showToast('Quantity updated', 'success');
        this.loadProducts();
      } else {
        this.showToast('Error updating quantity', 'error');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      this.showToast('Failed to update quantity', 'error');
    }
  }

  async deleteProduct(id) {
    try {
      this.showLoading();
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        this.showToast('Course deleted successfully', 'success');
        this.closeDeleteModal();
        this.loadProducts();
      } else {
        this.showToast('Error deleting product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      this.showToast('Failed to delete product', 'error');
    } finally {
      this.hideLoading();
    }
  }

  // UI Methods
  renderProducts() {
    if (this.filteredProducts.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }

    this.productsGrid.innerHTML = this.filteredProducts.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-header">
          <div class="product-icon">${product.image || '📦'}</div>
          <div class="product-info">
            <div class="product-name">${this.escapeHtml(product.name)}</div>
            <span class="product-category">${this.escapeHtml(product.category)}</span>
          </div>
        </div>
        <p class="product-description">${this.escapeHtml(product.description || '')}</p>
        <div class="product-details">
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-quantity">
            <span class="quantity-label">Stock:</span>
            <input 
              type="number" 
              class="quantity-input" 
              value="${product.quantity}" 
              min="0"
              data-id="${product.id}"
              data-original="${product.quantity}"
            />
          </div>
        </div>
        <div class="product-actions">
          <button class="btn btn-edit" data-id="${product.id}">
            ✏️ Edit
          </button>
          <button class="btn btn-delete" data-id="${product.id}">
            🗑️ Delete
          </button>
        </div>
      </div>
    `).join('');

    // Attach event listeners to product cards
    this.attachProductEventListeners();
  }

  attachProductEventListeners() {
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openEditModal(id);
      });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openDeleteModal(id);
      });
    });

    // Quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const newQuantity = e.target.value;
        const originalQuantity = e.target.dataset.original;
        
        if (newQuantity !== originalQuantity) {
          this.updateQuantity(id, newQuantity);
        }
      });
    });
  }

  filterProducts() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const selectedCategory = this.categoryFilter.value;

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);
      
      const matchesCategory = 
        !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    this.renderProducts();
  }

  updateStatistics() {
    // Total products
    this.totalProductsEl.textContent = this.products.length;

    // Total quantity
    const totalQuantity = this.products.reduce((sum, product) => sum + product.quantity, 0);
    this.totalQuantityEl.textContent = totalQuantity;

    // Categories count
    const categories = new Set(this.products.map(p => p.category));
    this.categoriesCountEl.textContent = categories.size;
  }

  populateCategoryFilter() {
    const categories = new Set(this.products.map(p => p.category));
    const currentValue = this.categoryFilter.value;
    
    this.categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    Array.from(categories).sort().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      this.categoryFilter.appendChild(option);
    });

    if (currentValue) {
      this.categoryFilter.value = currentValue;
    }
  }

  // Modal Methods
  openProductModal(productData = null) {
    this.currentProductId = productData?.id || null;
    this.modalTitle.textContent = productData ? 'Edit Course' : 'Add New Course';
    
    if (productData) {
      this.productIdInput.value = productData.id;
      this.productNameInput.value = productData.name;
      this.productCategoryInput.value = productData.category;
      this.productDescriptionInput.value = productData.description || '';
      this.productPriceInput.value = productData.price;
      this.productQuantityInput.value = productData.quantity;
      this.productImageInput.value = productData.image || '';
    } else {
      this.productForm.reset();
      this.productIdInput.value = '';
    }
    
    this.productModal.classList.add('active');
  }

  closeProductModal() {
    this.productModal.classList.remove('active');
    this.productForm.reset();
    this.currentProductId = null;
  }

  openEditModal(id) {
    const product = this.products.find(p => p.id == id);
    if (product) {
      this.openProductModal(product);
    }
  }

  openDeleteModal(id) {
    this.deleteProductId = id;
    this.deleteModal.classList.add('active');
  }

  closeDeleteModal() {
    this.deleteModal.classList.remove('active');
    this.deleteProductId = null;
  }

  confirmDelete() {
    if (this.deleteProductId) {
      this.deleteProduct(this.deleteProductId);
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const productData = {
      name: this.productNameInput.value.trim(),
      category: this.productCategoryInput.value.trim(),
      description: this.productDescriptionInput.value.trim(),
      price: parseFloat(this.productPriceInput.value),
      quantity: parseInt(this.productQuantityInput.value),
      image: this.productImageInput.value.trim() || '📦'
    };

    this.saveProduct(productData);
  }

  // Utility Methods
  showLoading() {
    this.loading.classList.add('active');
  }

  hideLoading() {
    this.loading.classList.remove('active');
  }

  showToast(message, type = 'success') {
    this.toast.textContent = message;
    this.toast.className = `toast ${type} active`;
    
    setTimeout(() => {
      this.toast.classList.remove('active');
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new InventoryApp();
});
