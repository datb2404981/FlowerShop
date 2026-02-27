// Hàm update icon trên giỏ hàng
function updateHeaderBadge() {
  const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  let totalQty = 0;
  cart.forEach((item) => (totalQty += item.quantity));
  const badge = document.querySelector("my-header .badge");
  if (badge) {
    badge.innerText = totalQty;
    badge.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}
updateHeaderBadge();

// Hàm thêm trường checked
function migrateCartForCheckbox() {
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  let changed = false;

  cart = cart.map((item) => {
    if (typeof item.checked === "undefined") {
      changed = true;
      return {
        ...item,
        checked: false, // mặc định chọn thanh toán
      };
    }
    return item;
  });

  if (changed) {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }
}

// Hàm chuyển đổi số sang định dạng tiền
function formatPriceHTML(price) {
  return `
    ${price.toLocaleString("en-US")}<span class="vnd-unit">vnđ</span>
  `;
}

migrateCartForCheckbox();

// ======= STORAGE
// Lấy cart từ Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem("shoppingCart")) || [];
}

// Lưu lại cart xuống Local Storage
function setCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// ======= NHÓM RENDER
// Sinh toàn bộ HTML cho toàn bộ LocalStorage để bơm vào trang chính
function renderCart() {
  const cart = getCart();
  // Trường hợp giỏ hàng trống
  if (cart.length === 0) {
    document.querySelector(".bigItem").innerHTML = `
      <div class="empty-cart-container text-center">
        
        <h2 class="empty-title">Giỏ hàng của bạn đang "đợi hoa"...</h2>
        <p class="empty-desc">Đừng để khu vườn nhỏ này trống không, hãy chọn ngay những bó hoa tươi thắm nhất để dành tặng người thân yêu nhé!</p>
        <a href="index.html" class="btn btn-go-home">
         <i class="bi bi-arrow-left"></i>
         Quay về trang chủ
      </a>
      <div class="empty-cart-icon">
            <i class="bi bi-flower1"></i> </div>
      </div>
    `;

    const summaryCard = document.querySelector(".summary");
    if (summaryCard) summaryCard.style.display = "none";

    return;
  }

  let fullHTML = "";
  cart.forEach((item) => {
    const id = item.id;
    const img = item.image;
    const name = item.name;
    const price = item.price;
    const quantity = item.quantity;
    const checked = item.checked;
    const checkedClass = item.checked ? "is-checked" : "not-checked";

    let currentItemHTML = `
<hr />
<!-- Sản phẩm -->
<div class="row">
  <div class="check-thanhtoan col-1">
        <input
          data-id="${id}"
          class="form-check-input item-checkbox"
          type="checkbox"
          ${item.checked ? "checked" : ""}
          value=""
          id="checkDefault${id}"
        />
      </div>
  <article class="item row ${checkedClass} col-11" data-id="${id}">
    <!-- Ảnh sản phẩm -->
    <div class="img-col col-12 col-lg-4">
      <img class="item-img" src="${img}" />
    </div>
    <!-- Thông tin sản phẩm -->
    <div class="item-info col-7 col-lg-4">
      <h2 class="in4-item-name">${name}</h2>
    </div>
  
    <!-- checkbox - Thành tiền-->
    <div class="item-price col-5 col-lg-4">
      <div class="price-total">
        <p class="total-text">Thành tiền:</p>
        <p class="total-money" data-id="${id}">${formatPriceHTML(price * quantity)}</p>
      </div>
      <div class="action-button">
        <div class="quantity-control fancy-qty d-flex align-items-center">
          <button class="qty-btn btn-minus" data-id="${id}" type="button">
            <i class="bi bi-dash"></i>
          </button>
          <input
            type="number"
            class="form-control text-center quantity-input"
            value="${quantity}"
            min="1"
            data-id="${id}"
          />
          <button class="qty-btn btn-plus" data-id="${id}" type="button">
            <i class="bi bi-plus"></i>
          </button>
        </div>
        <div class="remove-btn">
          <button class="btn-remove" data-id="${id}">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>
  </article>
</div>

    `;
    fullHTML += currentItemHTML;
  });

  document.querySelector(".items-list").innerHTML =
    `
<div class='check-all row'>
  <div class="col-1 checkbox-checkall">
    <input
      class="form-check-input"
      type="checkbox"
      value=""
      id="checkAll"
    />
  </div>
  <div class='col-11 label-checkall'>
    <label class="form-check-label" for="checkAll">
        Chọn tất cả sản phẩm</label
      >

      <div class="removeAll-btn">
        <button class="btn btn-remove-all">
            <i class="bi bi-trash3"></i>
            <span>Xóa giỏ hàng</span>
        </button>
    </div>
  </div>  
</div>
  ` + fullHTML;

  calculateSummary();
  syncCheckAll();
}

renderCart();

// ============== QUANTITY

// Hiệu ứng cho chữ
function bumpItemTotalById(id) {
  const el = document.querySelector(`.total-money[data-id="${id}"]`);

  if (!el) return;

  el.classList.remove("bump");
  void el.offsetWidth; // reset animation
  el.classList.add("bump");
}

function bumpSummary() {
  const subEl = document.querySelector(".summary-subtotal .summary-money p");
  const totalEl = document.querySelector(".summary-total .summary-money p");

  if (subEl) {
    subEl.classList.remove("bump");
    void subEl.offsetWidth;
    subEl.classList.add("bump");
  }

  if (totalEl) {
    totalEl.classList.remove("bump");
    void totalEl.offsetWidth;
    totalEl.classList.add("bump");
  }
}

// Chức năng + - số lượng ở mỗi item
// Hàm tăng/ giảm số lượng
function updateQuantity(id, newQuantity) {
  const cart = getCart();

  const item = cart.find((item) => item.id == id);
  if (!item) return;

  if (newQuantity < 1) newQuantity = 1;

  item.quantity = newQuantity;

  setCart(cart);
  renderCart();
  updateHeaderBadge();
}
// Hàm bắt sự kiện cho nút + -
document.addEventListener("click", function (e) {
  // Nút +
  if (e.target.closest(".btn-plus")) {
    const btn = e.target.closest(".btn-plus");
    const id = btn.dataset.id;

    const cart = getCart();
    const item = cart.find((item) => item.id == id);
    if (!item) return;

    updateQuantity(id, item.quantity + 1);
    updateHeaderBadge();
    bumpItemTotalById(id);
  }

  // Nút -
  if (e.target.closest(".btn-minus")) {
    const btn = e.target.closest(".btn-minus");
    const id = btn.dataset.id;

    const cart = getCart();
    const item = cart.find((item) => item.id == id);
    if (!item) return;

    updateQuantity(id, item.quantity - 1);
    updateHeaderBadge();
    bumpItemTotalById(id);
  }
});

// Hàm bắt sự kiện cho nhập trực tiếp số lượng
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("quantity-input")) {
    const input = e.target;
    const id = input.dataset.id;
    let newQuantity = parseInt(input.value);

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    updateQuantity(id, newQuantity);
    updateHeaderBadge();
    bumpItemTotalById(id);
  }
});

// ============== REMOVE ITEM
// Hàm xóa item theo id
function removeItemById(id) {
  const itemEl = document.querySelector(`.item[data-id="${id}"]`);

  if (itemEl) {
    // Thêm class để chạy animation
    itemEl.classList.add("removing");

    // Đợi animation xong rồi mới xóa data + render
    setTimeout(() => {
      let cart = getCart();

      cart = cart.filter((item) => item.id != id);

      setCart(cart);
      renderCart();
      updateHeaderBadge();
    }, 300); // khớp với CSS transition
  }
}
// Bắt sự kiện click nút xóa
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-remove")) {
    const btn = e.target.closest(".btn-remove");
    const id = btn.dataset.id;

    removeItemById(id);
  }
});

// Xóa toàn bộ giỏ hàng

const clearCartModal = new bootstrap.Modal(
  document.getElementById("confirmClearCartModal"),
);
const btnConfirmAction = document.getElementById("btn-confirm-clear-action");

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-remove-all")) {
    // Thay vì confirm(), ta mở Modal
    clearCartModal.show();
  }
});

btnConfirmAction.addEventListener("click", function () {
  clearCart(); // Gọi hàm xóa đã viết sẵn của bạn
  clearCartModal.hide(); // Đóng modal sau khi xóa
});

function clearCart() {
  const items = document.querySelectorAll(".item");
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("removing");
    }, index * 50);
  });

  setTimeout(
    () => {
      setCart([]);
      renderCart();
      updateHeaderBadge();
    },
    300 + items.length * 50,
  );
}

// ============== CHECKBOX
// Hàm đổi trạng thái checked trên local storage
function toggleItemChecked(id, isChecked) {
  const cart = getCart();

  const item = cart.find((item) => item.id == id);
  if (!item) return;

  item.checked = isChecked;

  setCart(cart);
  syncCheckAll();
}

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("item-checkbox")) {
    const checkbox = e.target;
    const id = checkbox.dataset.id;
    const isChecked = checkbox.checked;

    toggleItemChecked(id, isChecked);

    const rowWrapper = checkbox.closest(".row");
    const article = rowWrapper.querySelector(".item");

    if (!article) return;

    article.classList.toggle("is-checked", isChecked);
    article.classList.toggle("not-checked", !isChecked);

    calculateSummary();
  }
});

// Hàm set tất cả thành checked
function setAllChecked(isChecked) {
  const cart = getCart();

  cart.forEach((item) => {
    item.checked = isChecked;
  });

  setCart(cart);
}

// Hàm bắt sự kiện checkAll
document.addEventListener("change", function (e) {
  if (e.target.id === "checkAll") {
    const isChecked = e.target.checked;

    setAllChecked(isChecked);

    // Render lại để sync toàn bộ UI
    renderCart();
    calculateSummary();
  }
});

// Hàm sync để đồng bộ nếu sau khi checkAll thì 1 thằng bị unchecked
function syncCheckAll() {
  const cart = getCart();

  if (cart.length === 0) {
    document.getElementById("checkAll").checked = false;
    return;
  }

  const allChecked = cart.every((item) => item.checked === true);

  document.getElementById("checkAll").checked = allChecked;
}

calculateSummary();
// ============== CALCULATE TOTAL
// Hàm tính tổng theo checked
function calculateSummary() {
  const cart = getCart();

  let subtotal = 0;

  cart.forEach((item) => {
    if (item.checked) {
      subtotal += item.price * item.quantity;
    }
  });

  // Update UI
  document.querySelector(".summary-subtotal .summary-money p").innerHTML =
    formatPriceHTML(subtotal);

  document.querySelector(".summary-total .summary-money p").innerHTML =
    formatPriceHTML(subtotal);

  updateCheckoutButtonStatus();
}

// Nút thanh toán
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-checkout")) window.location.href = "checkout.html";
});

// Hàm kiểm tra xem có ít nhất 1 sản phẩm được chọn không để bật/tắt nút thanh toán
function updateCheckoutButtonStatus() {
  const cart = getCart();
  // Kiểm tra xem có item nào có checked === true không
  const hasCheckedItem = cart.some((item) => item.checked === true);

  const checkoutBtn = document.querySelector(".btn-checkout");

  if (checkoutBtn) {
    if (hasCheckedItem) {
      checkoutBtn.disabled = false;
    } else {
      checkoutBtn.disabled = true;
    }
  }
}

document.addEventListener("click", function (e) {
  const itemEl = e.target.closest(".item");
  if (!itemEl) return;

  // Không toggle nếu click vào các control này
  if (
    e.target.closest(".btn-plus") ||
    e.target.closest(".btn-minus") ||
    e.target.closest(".btn-remove") ||
    e.target.closest(".quantity-input") ||
    e.target.closest(".item-checkbox")
  ) {
    return;
  }

  const id = itemEl.dataset.id;

  const checkbox = document.querySelector(`.item-checkbox[data-id="${id}"]`);

  if (!checkbox) return;

  // Click thật vào checkbox (trigger đầy đủ logic)
  checkbox.click();
});
