 // Utilities
      const $ = (sel) => document.querySelector(sel);
      const $$ = (sel) => Array.from(document.querySelectorAll(sel));

      // Year auto-update
      document.getElementById("year").textContent = new Date().getFullYear();

      // Mobile menu toggle
      const mobileBtn = $("#mobileMenuBtn");
      const mobileMenu = $("#mobileMenu");
      if (mobileBtn) {
        mobileBtn.addEventListener("click", () =>
          mobileMenu.classList.toggle("hidden")
        );
      }

      // CART: LocalStorage backed
      const cartPanel = $("#cartPanel");
      const cartToggle = $("#cartToggle");
      const closeCart = $("#closeCart");
      const cartList = $("#cartList");
      const cartCounter = $("#cartCounter");
      const cartSubtotalEl = $("#cartSubtotal");
      const clearCartBtn = $("#clearCart");
      const checkoutBtn = $("#checkout");
      const checkoutModal = $("#checkoutModal");
      const cancelCheckout = $("#cancelCheckout");
      const confirmCheckout = $("#confirmCheckout");

      let cart = JSON.parse(localStorage.getItem("fm_cart") || "[]");

      function saveCart() {
        localStorage.setItem("fm_cart", JSON.stringify(cart));
        renderCart();
      }

      function renderCart() {
        cartList.innerHTML = "";
        if (cart.length === 0) {
          cartList.innerHTML =
            '<li class="text-slate-500">Your cart is empty.</li>';
        } else {
          cart.forEach((item, idx) => {
            const price = Number(item.price) || 0; // ✅ safe conversion
            const li = document.createElement("li");
            li.className = "flex items-center justify-between";
            li.innerHTML = `
          <div>
            <div class="font-medium">${item.name}</div>
            <div class="text-sm text-slate-500">$${price.toFixed(2)} x ${
              item.qty
            }</div>
          </div>
          <div class="flex items-center gap-2">
            <button data-idx="${idx}" class="dec px-2 py-1 rounded bg-slate-100">-</button>
            <button data-idx="${idx}" class="inc px-2 py-1 rounded bg-slate-100">+</button>
          </div>
        `;
            cartList.appendChild(li);
          });
        }
        const total = cart.reduce(
          (s, i) => s + (Number(i.price) || 0) * i.qty,
          0
        );
        cartSubtotalEl.textContent = `$${total.toFixed(2)}`;
        cartCounter.textContent = cart.reduce((s, i) => s + i.qty, 0);
      }

      // Add to cart buttons
      document.addEventListener("click", (e) => {
        if (e.target.matches(".addToCartBtn")) {
          const card = e.target.closest("article");
          const id = card.dataset.id;
          const name = card.dataset.name;
          const price = parseFloat(card.dataset.price) || 0; // ✅ ensures number
          addToCart({ id, name, price });
          console.log("added");
        }
        if (e.target.matches(".inc")) {
          const idx = parseInt(e.target.dataset.idx);
          if (!isNaN(idx) && cart[idx]) {
            cart[idx].qty += 1;
            saveCart();
          }
        }
        if (e.target.matches(".dec")) {
          const idx = parseInt(e.target.dataset.idx);
          if (!isNaN(idx) && cart[idx]) {
            cart[idx].qty -= 1;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
            saveCart();
          }
        }
      });

      function addToCart(item) {
        const existing = cart.find((c) => c.id === item.id);
        if (existing) existing.qty += 1;
        else cart.push({ ...item, qty: 1 });
        saveCart();
        openCart();
        setTimeout(closeCartPanel, 1600);
      }

      // Cart open/close
      function openCart() {
        cartPanel.classList.remove("translate-x-full");
        cartPanel.classList.add("translate-x-0");
      }
      function closeCartPanel() {
        cartPanel.classList.add("translate-x-full");
        cartPanel.classList.remove("translate-x-0");
      }

      if (cartToggle)
        cartToggle.addEventListener("click", () => {
          if (cartPanel.classList.contains("translate-x-full")) openCart();
          else closeCartPanel();
        });
      if (closeCart) closeCart.addEventListener("click", closeCartPanel);

      // Clear cart
      if (clearCartBtn)
        clearCartBtn.addEventListener("click", () => {
          cart = [];
          saveCart();
        });

      // Checkout
      if (checkoutBtn)
        checkoutBtn.addEventListener("click", () => {
          if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
          }
          checkoutModal.classList.remove("hidden");
          checkoutModal.classList.add("flex");
        });

      if (cancelCheckout)
        cancelCheckout.addEventListener("click", () => {
          checkoutModal.classList.add("hidden");
          checkoutModal.classList.remove("flex");
        });

      if (confirmCheckout)
        confirmCheckout.addEventListener("click", () => {
          const name = $("#custName").value || "Customer";
          cart = [];
          saveCart();
          checkoutModal.classList.add("hidden");
          checkoutModal.classList.remove("flex");
          closeCartPanel();
          alert(`Thanks ${name}! Your order has been placed (demo).`);
        });

      renderCart();
      cartPanel.classList.add("translate-x-full");