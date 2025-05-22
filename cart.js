// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Cart functions
const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
};

const updateCartUI = () => {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `).join('');
    }

    // Update cart total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
};

const addToCart = (productId) => {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }

    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    showNotification('Item added to cart!');
};

const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
        showNotification('Not enough stock available!');
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        saveCart();
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showNotification('Item removed from cart!');
};

const toggleCart = () => {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
};

const checkout = () => {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Populate checkout modal
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = `$${total.toFixed(2)}`;

    // Show checkout modal
    toggleCart();
    openModal('checkoutModal');
};

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
}); 