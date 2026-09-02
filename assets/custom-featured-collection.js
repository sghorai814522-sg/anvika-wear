document.addEventListener('DOMContentLoaded', function() {
  const addToCartForms = document.querySelectorAll('.cfc-add-to-cart-form');

  addToCartForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const btn = form.querySelector('.cfc-add-to-cart-btn');
      const originalText = btn.innerHTML;
      
      // Visual feedback
      btn.innerHTML = 'Adding...';
      btn.disabled = true;

      // Prepare form data
      const formData = new FormData(form);

      // Send AJAX request to Shopify
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        // Fetch the updated cart state to get the correct item count
        return fetch(window.Shopify.routes.root + 'cart.js').then(res => res.json());
      })
      .then(cartData => {
        // Success state
        btn.innerHTML = 'Added!';
        
        // 1. Dispatch Theme's Native Event (attempts to trigger cart drawer auto-open and update)
        const eventPayload = {
          action: 'add',
          promise: Promise.resolve({
            cart: {
              totalQuantity: cartData.item_count
            },
            detail: {
              itemCount: cartData.item_count
            }
          })
        };
        const cartEvent = new CustomEvent('shopify:cart:lines-update', { detail: eventPayload });
        Object.assign(cartEvent, eventPayload);
        document.dispatchEvent(cartEvent);
        
        // Directly call the cart-icon web component to update if it exists
        const cartIcon = document.querySelector('cart-icon');
        if (cartIcon && typeof cartIcon.renderCartBubble === 'function') {
          cartIcon.renderCartBubble(cartData.item_count);
        }
        
        // 2. Universal HTML Swap Fallback (guarantees header icon updates)
        fetch(window.location.pathname)
          .then(res => res.text())
          .then(html => {
             const parser = new DOMParser();
             const doc = parser.parseFromString(html, 'text/html');
             
             // Selectors for common Shopify cart icons and drawers
             const selectors = ['cart-icon-bubble', '#cart-icon-bubble', '.cart-count-bubble', '.header__icon--cart', 'cart-drawer-component', '.cart-drawer', '[data-cart-quantity]'];
             
             selectors.forEach(selector => {
                const newEls = doc.querySelectorAll(selector);
                const oldEls = document.querySelectorAll(selector);
                
                if(newEls.length && oldEls.length && newEls.length === oldEls.length) {
                   oldEls.forEach((oldEl, i) => {
                      // Swap the inner HTML safely
                      oldEl.innerHTML = newEls[i].innerHTML;
                      
                      // Keep custom attributes synced (like data-cart-quantity)
                      if(newEls[i].hasAttribute('data-cart-quantity')) {
                        oldEl.setAttribute('data-cart-quantity', newEls[i].getAttribute('data-cart-quantity'));
                      }
                   });
                }
             });
          });
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2000);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        btn.innerHTML = 'Error';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2000);
      });
    });
  });
});
