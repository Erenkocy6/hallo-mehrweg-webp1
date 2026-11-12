/* Ergänzt die HTML-Seiten um Suche, Merkliste, Warenkorb und Demo-Formulare. */
"use strict";
(() => {
  // Helfer zum Auswählen eines Elements oder mehrerer Elemente.
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const catalog = window.CATALOG;
  const byId = (id) => catalog.find((p) => p.id === id);
  const money = (cents) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  // Warenkorb und Merkliste werden lokal in diesem Browser gespeichert.
  const keys = { cart: "hallo-mehrweg-cart", wishes: "hallo-mehrweg-wishes" };
  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }
  let storedCart = read(keys.cart, []);
  let cart = Array.isArray(storedCart)
    ? storedCart
        .filter((x) => x && byId(x.id))
        .map((x) => ({ id: x.id, quantity: ShopCore.quantity(x.quantity) }))
    : [];
  let storedWishes = read(keys.wishes, []);
  let wishes = Array.isArray(storedWishes)
    ? storedWishes.filter((id) => byId(id))
    : [];
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      notify(
        "Dein Browser erlaubt keine Speicherung. Die Auswahl bleibt nur auf dieser Seite erhalten.",
      );
    }
  }
  // Sichtbare Rückmeldung nach einer Aktion ausgeben.
  function notify(message) {
    const status = $("#status");
    status.textContent = message;
    status.className =
      "container alert alert-success position-sticky bottom-0 mt-2";
    const feedback = $("#product-feedback");
    if (feedback) feedback.textContent = message;
  }
  // Zähler und Merklisten-Schaltflächen an die aktuelle Auswahl anpassen.
  function updateControls() {
    $$("[data-cart-count]").forEach(
      (el) =>
        (el.textContent = cart.length
          ? ` (${cart.reduce((n, p) => n + p.quantity, 0)})`
          : ""),
    );
    $$("[data-wish]").forEach((el) => {
      const active = wishes.includes(el.dataset.wish);
      el.setAttribute("aria-pressed", String(active));
      el.classList.toggle("bg-danger-subtle", active);
    });
    const grid = $("#wish-grid");
    if (grid) {
      $$(".product-card", grid).forEach((el) =>
        el.classList.toggle("d-none", !wishes.includes(el.dataset.id)),
      );
      $("#wish-empty").textContent = wishes.length
        ? "Deine gemerkten Produkte:"
        : "Deine Merkliste ist leer. Entdecke Produkte und merke sie mit dem Herz.";
    }
  }
  function cartItems() {
    return cart.map((x) => ({ ...byId(x.id), quantity: x.quantity }));
  }
  function summary() {
    const t = ShopCore.totals(cartItems());
    return `<table class="table"><caption class="visually-hidden">Bestellsumme inklusive Versand und Mehrwertsteuer</caption><tbody><tr><th scope="row" class="fw-normal">Zwischensumme</th><td class="text-end">${money(t.subtotal)}</td></tr><tr><th scope="row" class="fw-normal">Versand</th><td class="text-end">${money(t.shipping)}</td></tr><tr><th scope="row">Gesamtsumme</th><td class="text-end fw-bold">${money(t.total)}</td></tr><tr><th scope="row" class="fw-normal small">Darin enthalten: 19 % MwSt.</th><td class="text-end small">${money(t.tax)}</td></tr></tbody></table>`;
  }
  function renderCart() {
    const target = $("#cart-content");
    if (target)
      target.innerHTML = cart.length
        ? cartItems()
            .map(
              (p) =>
                `<article class="row align-items-center g-3 border-bottom py-3"><div class="col-3 col-md-2"><img src="assets/img/${p.image}.webp" alt="${p.name}" class="img-fluid" width="160" height="160"></div><div class="col-9 col-md-4"><h2 class="h4"><a href="produkt-${p.id}.html">${p.name}</a></h2><p class="mb-0">${money(p.price)} je Stück</p></div><div class="col-5 col-md-2"><label for="cart-${p.id}" class="small">Menge</label><input id="cart-${p.id}" type="number" min="1" max="99" value="${p.quantity}" data-cart-quantity="${p.id}" class="form-control"></div><div class="col-4 col-md-2">${money(p.price * p.quantity)}</div><div class="col-3 col-md-2"><button class="btn btn-outline-danger btn-sm" data-remove="${p.id}" aria-label="${p.name} entfernen">Entfernen</button></div></article>`,
            )
            .join("") +
          `<div class="col-md-6 ms-auto mt-4">${summary()}</div><button type="button" class="btn btn-outline-danger btn-sm" data-clear-cart>Warenkorb leeren</button>`
        : '<p class="alert alert-light border">Dein Warenkorb ist noch leer.</p>';
    const checkout = $("#checkout-summary");
    if (checkout) {
      checkout.innerHTML = cart.length
        ? '<ul class="list-unstyled small">' +
          cartItems()
            .map((p) => `<li>${p.quantity} × ${p.name}</li>`)
            .join("") +
          "</ul>" +
          summary()
        : '<p>Dein Warenkorb ist leer. <a href="produkte.html">Produkte auswählen</a></p>' +
          summary();
      $("#order-submit").disabled = !cart.length;
    }
  }
  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add;
      const product = byId(id);
      if (!product) return;
      const amount = add.hasAttribute("data-use-quantity")
        ? ShopCore.quantity($("#quantity").value)
        : 1;
      const existing = cart.find((p) => p.id === id);
      if (existing)
        existing.quantity = ShopCore.quantity(existing.quantity + amount);
      else cart.push({ id, quantity: amount });
      save(keys.cart, cart);
      updateControls();
      renderCart();
      notify(`${product.name} liegt jetzt im Warenkorb.`);
    }
    const wish = event.target.closest("[data-wish]");
    if (wish) {
      const id = wish.dataset.wish;
      wishes = wishes.includes(id)
        ? wishes.filter((x) => x !== id)
        : [...wishes, id];
      save(keys.wishes, wishes);
      updateControls();
      notify(
        wishes.includes(id)
          ? "Produkt in der Merkliste gespeichert."
          : "Produkt aus der Merkliste entfernt.",
      );
    }
    const quantity = event.target.closest("[data-quantity]");
    if (quantity) {
      const input = $("#quantity");
      input.value = ShopCore.quantity(
        Number(input.value) + Number(quantity.dataset.quantity),
      );
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      cart = cart.filter((p) => p.id !== remove.dataset.remove);
      save(keys.cart, cart);
      renderCart();
      updateControls();
      notify("Produkt entfernt.");
    }
    if (event.target.closest("[data-clear-cart]")) {
      cart = [];
      save(keys.cart, cart);
      renderCart();
      updateControls();
      notify("Warenkorb geleert.");
    }
    const gallery = event.target.closest("[data-gallery]");
    if (gallery) {
      const main = gallery.closest(".col-md-6").querySelector("img");
      main.classList.remove("photo-top", "photo-bottom");
      if (gallery.dataset.position !== "center")
        main.classList.add(
          gallery.dataset.position === "left" ? "photo-top" : "photo-bottom",
        );
      main.alt = gallery.getAttribute("aria-label");
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-cart-quantity]")) {
      const item = cart.find((p) => p.id === event.target.dataset.cartQuantity);
      item.quantity = ShopCore.quantity(event.target.value);
      save(keys.cart, cart);
      renderCart();
      updateControls();
    }
    if (event.target.id === "quantity")
      event.target.value = ShopCore.quantity(event.target.value);
  });
  const filter = $("#filter");
  if (filter) {
    const params = new URLSearchParams(location.search);
    const category = params.get("kategorie");
    if (
      category !== null &&
      ["", "schuesseln", "flaschen", "mikrowelle", "frischhalten"].includes(
        category,
      )
    )
      $("#category").value = category;
    const query = (params.get("q") || "").trim().toLocaleLowerCase("de");
    $("#suche").value = params.get("q") || "";
    if (query) $("#category").value = "";
    function applyFilters() {
      const values = Object.fromEntries(new FormData(filter));
      const cards = $$(".product-card", $("#product-grid"));
      let count = 0;
      cards.forEach((card) => {
        const d = card.dataset;
        const matches = ["category", "material", "color", "brand"].every(
          (k) => !values[k] || values[k] === d[k],
        );
        const price = Number(d.price);
        const size = Number(d.size);
        const priceOk =
          !values.price ||
          (values.price === "Bis 10 €"
            ? price <= 1000
            : values.price === "10–20 €"
              ? price > 1000 && price <= 2000
              : price > 2000);
        const sizeOk =
          !values.size ||
          (values.size === "Bis 15 cm"
            ? size <= 15
            : values.size === "16–20 cm"
              ? size > 15 && size <= 20
              : size > 20);
        const found =
          !query ||
          (d.name + " " + d.brand + " " + d.material)
            .toLocaleLowerCase("de")
            .includes(query);
        const visible = matches && priceOk && sizeOk && found;
        card.classList.toggle("d-none", !visible);
        if (visible) count++;
      });
      const sort = $("#sort").value;
      cards
        .sort((a, b) =>
          sort === "price-desc"
            ? b.dataset.price - a.dataset.price
            : sort === "name"
              ? a.dataset.name.localeCompare(b.dataset.name, "de")
              : sort === "new"
                ? catalog.findIndex((p) => p.id === b.dataset.id) -
                  catalog.findIndex((p) => p.id === a.dataset.id)
                : a.dataset.price - b.dataset.price,
        )
        .forEach((c) => $("#product-grid").append(c));
      $("#result-count").textContent =
        `${count} Produkte${query ? " für „" + query + "“" : ""}`;
      $("#no-results").classList.toggle("d-none", count !== 0);
    }
    filter.addEventListener("change", applyFilters);
    filter.addEventListener("reset", () => setTimeout(applyFilters, 0));
    applyFilters();
  }
  const login = $("#login");
  if (login)
    login.addEventListener("submit", (event) => {
      event.preventDefault();
      $("#login-status").textContent =
        "Demo: Die Eingaben wurden geprüft. Es wurde kein Konto angemeldet und nichts übertragen.";
      $("#password").value = "";
    });
  const contact = $("#contact");
  if (contact)
    contact.addEventListener("submit", (event) => {
      event.preventDefault();
      $("#contact-status").textContent =
        "Deine Eingaben sind vollständig. Dies ist eine Demo: Die Nachricht wurde nicht versendet.";
      contact.reset();
    });
  const comment = $("#comment-form");
  if (comment)
    comment.addEventListener("submit", (event) => {
      event.preventDefault();
      const article = document.createElement("article");
      article.className = "border-top border-primary py-3";
      const heading = document.createElement("h3");
      heading.className = "h6 text-danger";
      heading.textContent = $("#comment-name").value;
      const p = document.createElement("p");
      p.className = "small";
      p.textContent = $("#comment-text").value;
      article.append(heading, p);
      $("#comments").append(article);
      comment.reset();
      notify("Dein Demo-Kommentar wurde angezeigt, aber nicht gespeichert.");
    });
  const checkout = $("#checkout");
  if (checkout) {
    const postal = $("#postal-code");
    postal.pattern = "[0-9]{5}";
    postal.inputMode = "numeric";
    postal.maxLength = 5;
    postal.title = "Bitte eine fünfstellige deutsche Postleitzahl eingeben.";
    checkout.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!cart.length) {
        $("#checkout-status").textContent =
          "Bitte zuerst Produkte zum Warenkorb hinzufügen.";
        return;
      }
      const total = money(ShopCore.totals(cartItems()).total);
      $("#checkout-status").textContent =
        `Demo abgeschlossen: ${total}. Es wurde nichts bestellt, bezahlt oder übertragen. Dein Warenkorb bleibt zum Weiterüben erhalten.`;
      checkout.reset();
    });
  }
  const clear = $("#clear-data");
  if (clear)
    clear.addEventListener("click", () => {
      try {
        localStorage.removeItem(keys.cart);
        localStorage.removeItem(keys.wishes);
      } catch {}
      cart = [];
      wishes = [];
      updateControls();
      $("#clear-status").textContent =
        "Warenkorb und Merkliste wurden gelöscht.";
    });
  // Mark active navigation semantically without duplicating page-specific headers.
  $$(".navbar a[href]").forEach((a) => {
    if (a.getAttribute("href") === location.pathname.split("/").pop())
      a.setAttribute("aria-current", "page");
  });
  updateControls();
  renderCart();
})();
