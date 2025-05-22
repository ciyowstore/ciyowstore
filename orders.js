// Function to place an order
async function placeOrder(event) {
    event.preventDefault();

    const shippingAddress = document.getElementById('shippingAddress').value;
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        items: cartItems,
        shippingAddress,
        total,
        cardNumber: document.getElementById('cardNumber').value.replace(/\s+/g, ''),
        cardExpiry: document.getElementById('cardExpiry').value,
        cardCVV: document.getElementById('cardCVV').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (response.ok) {
            // Clear cart
            localStorage.setItem('cart', '[]');
            updateCartCount();
            
            // Show success message
            showNotification('Order placed successfully!');
            
            // Close checkout modal
            closeModal('checkoutModal');
            
            // Clear cart sidebar
            document.getElementById('cartItems').innerHTML = '';
            document.getElementById('cartTotal').textContent = '$0.00';
        } else {
            throw new Error('Failed to place order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to format card number with spaces
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '');
    if (value.length > 0) {
        value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    e.target.value = value;
});

// Function to format card expiry
document.getElementById('cardExpiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Show orders
const showOrders = () => {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }

    const ordersList = document.getElementById('ordersList');
    
    if (currentUser.orders && currentUser.orders.length > 0) {
        ordersList.innerHTML = currentUser.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-date">
                        ${new Date(order.date).toLocaleDateString()} at ${new Date(order.date).toLocaleTimeString()}
                    </div>
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-status">Status: ${order.status}</div>
                    <div class="order-address">
                        <strong>Shipping Address:</strong><br>
                        ${order.shippingAddress}
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        ordersList.innerHTML = '<p class="no-orders">No orders yet</p>';
    }

    openModal('ordersModal');
}; 