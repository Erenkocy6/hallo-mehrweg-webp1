/* Integer cents avoid floating point rounding errors in money calculations. */
(function (root) {
  function quantity(value) { const n = Number.parseInt(value, 10); return Number.isFinite(n) ? Math.min(99, Math.max(1, n)) : 1; }
  function totals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price * quantity(item.quantity), 0);
    const shipping = subtotal ? 690 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total, tax: Math.round(total * 19 / 119) };
  }
  const api = { quantity, totals };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ShopCore = api;
})(typeof window === 'undefined' ? globalThis : window);
