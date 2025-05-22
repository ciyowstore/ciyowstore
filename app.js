// Initialize cart
let cart = [];

// Function to display products
function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onclick="showProductDetails(${product.id})">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Function to add items to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        updateCartCount();
        // Optional: Show a quick feedback to the user
        showNotification('Item added to cart!');
    }
}

// Function to update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show product details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <div class="product-details">
            <div class="product-image-large">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info-details">
                <h2>${product.name}</h2>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Stock:</strong> ${product.stock} units</p>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    openModal('productModal');
}

// Show notification
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
}); 