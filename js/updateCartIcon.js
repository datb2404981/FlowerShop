function updateHeaderBadge() {
  const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  let totalQty = 0;
  cart.forEach((item) => (totalQty += item.quantity));
  const badge = document.querySelector("my-header .badge");
  if (badge) {
    badge.innerText = totalQty > 99 ? "99+" : totalQty;
    badge.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}
updateHeaderBadge();
