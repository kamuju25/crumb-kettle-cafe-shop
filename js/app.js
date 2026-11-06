(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const money = (c) => "$" + (c / 100).toFixed(2);
  const KEY = "ck-cart";

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  function renderMenu(filter = "all") {
    const list = $("#menu-list");
    list.innerHTML = "";
    MENU.filter((m) => filter === "all" || m.type === filter).forEach((m) => {
      const li = document.createElement("li");
      li.className = "item";
      li.innerHTML = `
        <div class="pic ${m.type}"><img src="assets/img/${m.type}.svg" alt="" loading="lazy"></div>
        <div class="body">
          <h3>${m.name}</h3><p>${m.desc}</p>
          <div class="row"><span class="price">${money(m.price)}</span>
          <button class="add" data-id="${m.id}" aria-label="Add ${m.name} to order">Add</button></div>
        </div>`;
      list.appendChild(li);
    });
  }

  function renderCart() {
    const ul = $("#cart-items");
    ul.innerHTML = "";
    let total = 0, count = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const m = MENU.find((x) => x.id === id);
      if (!m) return;
      total += m.price * qty; count += qty;
      const li = document.createElement("li");
      li.innerHTML = `<span>${m.name}</span>
        <span class="qty"><button data-dec="${id}" aria-label="Remove one ${m.name}">−</button>${qty}
        <button data-inc="${id}" aria-label="Add one ${m.name}">+</button></span>
        <span>${money(m.price * qty)}</span>`;
      ul.appendChild(li);
    });
    $("#cart-total").textContent = money(total);
    $("#cart-count").textContent = count;
    $("#cart-empty").hidden = count > 0;
    $("#checkout").disabled = count === 0;
  }
  const change = (id, d) => {
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id];
    save(); renderCart();
  };
  function toggleCart(open) {
    $("#cart").hidden = !open;
    $("#cart-toggle").setAttribute("aria-expanded", String(open));
    if (open) $("#cart-close").focus(); else $("#cart-toggle").focus();
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.matches(".add")) { change(t.dataset.id, 1); $("#cart-msg").textContent = ""; }
    else if (t.dataset.inc) change(t.dataset.inc, 1);
    else if (t.dataset.dec) change(t.dataset.dec, -1);
    else if (t.matches(".chip")) {
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === t));
      renderMenu(t.dataset.filter);
    }
  });
  $("#cart-toggle").addEventListener("click", () => toggleCart($("#cart").hidden));
  $("#cart-close").addEventListener("click", () => toggleCart(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#cart").hidden) toggleCart(false); });
  $("#checkout").addEventListener("click", () => {
    // Static site: no backend. Replace with an API Gateway/Lambda call to take real orders.
    cart = {}; save(); renderCart();
    $("#cart-msg").textContent = "Order placed. We'll have it ready in about 10 minutes.";
  });

  $("#year").textContent = new Date().getFullYear();
  renderMenu(); renderCart();
})();
