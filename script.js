// Navbar Toggle Functionality
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

window.onload = function() {
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
    if (window.location.pathname.includes('checkout.html')) {
        loadPaymentAmount();
    }
};

// Function to add items to the cart
function addToCart(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.getAttribute('data-id');
    const product = button.getAttribute('data-product');
    const price = button.getAttribute('data-price');
    const image = button.getAttribute('data-image');

    if (!id) {
        console.error('No product ID found');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id,
            product,
            price: parseFloat(price),
            image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Added to cart:', { id, product, price }); // Debug line
    alert(`${product} added to cart!`);
}

// Function to load cart items on cart.html
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartSubtotal = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        cartSubtotal += subtotal;
        cartItemsContainer.innerHTML += `
            <tr>
                <td><button onclick="removeFromCart(${index})"><i class="far fa-times-circle"></i></button></td>
                <td><img src="${item.image}" width="50"></td>
                <td>${item.product}</td>
                <td>₱${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" 
                        onchange="updateQuantity(${index}, this.value)"
                        data-id="${item.id}"> <!-- Add this line -->
                </td>
                <td>₱${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById('cart-subtotal').textContent = `₱${cartSubtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `₱${(cartSubtotal + 100).toFixed(2)}`;
}

// Function to remove item from cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// Function to update quantity in cart
function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (newQuantity < 1) return;
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

// Function to auto-fill payment amount on checkout.html
function loadPaymentAmount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById('paymentAmount').value = (cartSubtotal + 100).toFixed(2);
}
