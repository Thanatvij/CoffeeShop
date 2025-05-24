document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
  
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
  
        cart.push({ name, price });
        updateCart();
      });
    });
  
    function updateCart() {
      cartList.innerHTML = '';
      let total = 0;
      cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.textContent = `${item.name} - ฿${item.price}`;
        cartList.appendChild(li);
      });
      cartTotal.textContent = total.toFixed(2);
    }
  
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
  
      const confirmPayment = confirm("Proceed to payment?");
      if (confirmPayment) {
        alert("Payment successful. Thank you!");
        cart.length = 0;
        updateCart();
      }
    });
  });
  