const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store orders in memory
let orders = [];

// Save orders to file
function saveOrders() {
    fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
}

// Load orders from file
try {
    if (fs.existsSync('orders.json')) {
        orders = JSON.parse(fs.readFileSync('orders.json'));
    }
} catch (error) {
    console.error('Error loading orders:', error);
}

// POST endpoint to receive orders
app.post('/api/orders', (req, res) => {
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...req.body
    };
    orders.push(order);
    saveOrders();
    res.status(201).json(order);
});

// GET endpoint to retrieve all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 