// Ẩn hiện các trường của người mua theo checkbox
document.getElementById("isGift").addEventListener("change", function () {
  const recipientForm = document.getElementById("recipient-form");
  if (this.checked) {
    recipientForm.classList.remove("d-none");
  } else {
    recipientForm.classList.add("d-none");
  }
});

// Js cho dropdown Section 1
// Hàm dùng chung để cập nhật giao diện khi chọn địa chỉ
function setupDropdownChange(dropdownId, hiddenInputId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  // Lắng nghe sự kiện click vào các item được tạo sau này (Event Delegation)
  dropdown
    .querySelector(".dropdown-menu")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("dropdown-item")) {
        e.preventDefault();
        const text = e.target.innerText;
        const code = e.target.getAttribute("data-code");

        // Đổi chữ trên nút
        dropdown.querySelector(".selected-label").innerText = text;
        // Lưu giá trị code vào input ẩn
        document.getElementById(hiddenInputId).value = code;
      }
    });
}

// Áp dụng cho 3 ô địa chỉ người mua
setupDropdownChange("drop-buyer-city", "buyer-city-code");
setupDropdownChange("drop-buyer-district", "buyer-district-code");
setupDropdownChange("drop-buyer-ward", "buyer-ward-code");

// Js cho dropdown Section 2
document
  .querySelectorAll(".custom-dropdown-time .dropdown-item")
  .forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const selectedText = this.innerText;
      const selectedValue = this.getAttribute("data-value");

      const buttonText = document.getElementById("selected-time");
      if (buttonText) {
        buttonText.innerText = selectedText;
      }

      const hiddenInput = document.getElementById("delivery-time-value");
      if (hiddenInput) {
        hiddenInput.value = selectedValue;
      }

      document.getElementById("dropdownTimeButton").style.borderColor =
        "var(--primary-color)";
    });
  });

//  API LẤY TỈNH THÀNH VIỆT NAM
const API_BASE = "https://provinces.open-api.vn/api";

// Hàm lấy tỉnh thành
async function initProvinces() {
  try {
    const response = await fetch(`${API_BASE}/p/`);
    const data = await response.json();

    // Đổ dữ liệu cho cả Buyer và Recipient
    renderList(
      data,
      "list-buyer-city",
      "drop-buyer-district",
      "buyer-city-code",
    );
    renderList(
      data,
      "list-recipient-city",
      "drop-recipient-district",
      "recipient-city-code",
    );
  } catch (error) {
    console.error("Lỗi lấy dữ liệu tỉnh thành:", error);
  }
}

//Hàm đổ dữ liệu vào danh sách <ul> và xử lý sự kiện click
function renderList(data, listId, nextDropId, hiddenId) {
  const listUl = document.getElementById(listId);
  if (!listUl) return;
  listUl.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<a class="dropdown-item" data-code="${item.code}">${item.name}</a>`;

    li.addEventListener("click", async function (e) {
      e.preventDefault();

      // Cập nhật giao diện nút hiện tại
      const parentDrop = listUl.closest(".dropdown");
      parentDrop.querySelector(".selected-label").innerText = item.name;
      document.getElementById(hiddenId).value = item.code;

      // Xóa các lỗi
      clearDropdownError(hiddenId);

      // Nếu có dropdown cấp kế tiếp (Quận hoặc Phường)
      if (nextDropId) {
        const nextBtn = document.querySelector(`#${nextDropId} button`);
        nextBtn.classList.remove("disabled");

        // Reset các cấp bên dưới nó
        resetChildren(nextDropId);

        // Gọi API lấy cấp con
        const type = nextDropId.includes("district") ? "p" : "d";
        const nextUrl = `${API_BASE}/${type}/${item.code}?depth=2`;
        const res = await fetch(nextUrl);
        const subData = await res.json();

        // Đổ dữ liệu vào dropdown kế tiếp
        const nextListId = `list-${nextDropId.split("-")[1]}-${nextDropId.split("-")[2]}`;
        const nextHiddenId = `${nextDropId.split("-")[1]}-${nextDropId.split("-")[2]}-code`;
        const nextChildId = nextDropId.includes("district")
          ? nextDropId.replace("district", "ward")
          : null;

        renderList(
          subData.districts || subData.wards,
          nextListId,
          nextChildId,
          nextHiddenId,
        );
      }
    });
    listUl.appendChild(li);
  });
}

// 3. Hàm reset khi chọn lại cấp trên
function resetChildren(parentId) {
  if (parentId.includes("district")) {
    const wardId = parentId.replace("district", "ward");
    document.querySelector(`#${wardId} .selected-label`).innerText =
      "Chọn Phường/Xã";
    document.querySelector(`#${wardId} button`).classList.add("disabled");
    document.getElementById(`${wardId.replace("drop-", "")}-code`).value = "";
  }
}

// Chạy khởi tạo
initProvinces();

// SECTION 3: Thanh toán
// Lắng nghe sự kiện thay đổi phương thức thanh toán
document.querySelectorAll('input[name="payment-method"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    // 1. Ẩn tất cả các box chi tiết trước
    document.querySelectorAll(".payment-detail-box").forEach((box) => {
      box.classList.add("d-none");
    });

    // 2. Xác định box nào cần hiện dựa trên ID của radio được chọn
    const selectedId = this.id;
    if (selectedId === "bank-transfer") {
      document.getElementById("bank-detail").classList.remove("d-none");
    } else if (selectedId === "momo-pay") {
      document.getElementById("momo-detail").classList.remove("d-none");
    } else if (selectedId === "cod-pay") {
      document.getElementById("cod-detail").classList.remove("d-none");
    }
  });
});

// Set up cái dropdown cho cái ngân hàng
setupDropdownChange("drop-payment-bank", "bank-code-hidden");

// SUMMARY CART tay phải
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
// Hàm chuyển đổi số sang định dạng tiền
function formatPriceHTML(price) {
  return `
    ${price.toLocaleString("en-US")}<span class="vnd-unit">vnđ</span>
  `;
}

// ======= STORAGE
// Lấy cart từ Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem("shoppingCart")) || [];
}

// Lưu lại cart xuống Local Storage
function setCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Xườn để tạo item
function createSummaryItemHTML(item) {
  return `
    <div class="summary-item row">
      <div class="item-img col-3">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="item-info col-4">
        <h3 class="item-name">${item.name}</h3>
      </div>
      <div class="item-info col-5">
        <p class="item-amount">Số lượng: ${item.quantity}</p>
        <p class="item-price">
          Đơn giá: <b>${formatPriceHTML(item.price)}</b>
        </p>
      </div>
    </div>
  `;
}

// Lọc ra các item có checked = true
function renderSummaryItems() {
  const cart = getCart();
  const container = document.querySelector(".summary-items-list");

  if (!container) return;

  container.innerHTML = "";

  let subTotal = 0;

  const checkedItems = cart.filter((item) => item.checked);

  if (checkedItems.length === 0) {
    container.innerHTML = `
      <p class="text-muted text-center small">
        Không có sản phẩm nào được chọn để thanh toán.
      </p>
    `;
    updateSummaryTotal(0);
    return;
  }

  checkedItems.forEach((item) => {
    // Render item
    const html = createSummaryItemHTML(item);
    container.insertAdjacentHTML("beforeend", html);

    // TÍNH TẠM TÍNH (QUAN TRỌNG)
    subTotal += item.price * item.quantity;
  });

  // Cập nhật UI tạm tính & tổng cộng
  updateSummaryTotal(subTotal);
}

function updateSummaryTotal(amount) {
  const subTotalEl = document.querySelector(".summary-subtotal");
  const totalEl = document.querySelector(".summary-total");

  if (subTotalEl) {
    subTotalEl.innerHTML = formatPriceHTML(amount);
  }

  if (totalEl) {
    totalEl.innerHTML = formatPriceHTML(amount);
  }

  document.querySelector(".total-value").innerHTML = formatPriceHTML(amount);
}

renderSummaryItems();

// CÁC HÀM BẮT LỖI FORM

// Scroll
function scrollToFirstError() {
  const firstInputError = document.querySelector(".input-error");
  const firstDropdownError = document.querySelector(".dropdown-error");

  const firstError = firstInputError || firstDropdownError;

  if (firstError) {
    firstError.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const btn = firstError.querySelector("button");
    if (btn) btn.focus();
  }
}

// Gắn nút thanh toán
document.querySelector(".btn-checkout").addEventListener("click", function (e) {
  e.preventDefault();

  const isValid = validateCheckoutForm();
  if (!isValid) return;

  // OK hết → cho phép xử lý thanh toán
  showSuccessModal();
});

function showError(input, message) {
  if (!input) return;

  const errorDiv = document.getElementById("error-" + input.id);
  input.classList.add("input-error");

  if (errorDiv) {
    errorDiv.innerText = message;
  }
}

function clearError(input) {
  if (!input) return;

  const errorDiv = document.getElementById("error-" + input.id);
  input.classList.remove("input-error");

  if (errorDiv) {
    errorDiv.innerText = "";
  }
}

function showDropdownError(hiddenInputId, message) {
  const hiddenInput = document.getElementById(hiddenInputId);
  const errorDiv = document.getElementById("error-" + hiddenInputId);
  if (!hiddenInput) return;

  const wrapper = hiddenInput.closest(".custom-dropdown-addr");
  if (wrapper) wrapper.classList.add("dropdown-error");

  if (errorDiv) errorDiv.innerText = message;
}

function clearDropdownError(hiddenInputId) {
  const hiddenInput = document.getElementById(hiddenInputId);
  const errorDiv = document.getElementById("error-" + hiddenInputId);
  if (!hiddenInput) return;

  const wrapper = hiddenInput.closest(".custom-dropdown-addr");
  if (wrapper) wrapper.classList.remove("dropdown-error");

  if (errorDiv) errorDiv.innerText = "";
}

function validateCheckoutForm() {
  // REGEX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

  let isValid = true;

  const buyerName = document.getElementById("buyer-name");
  const buyerPhone = document.getElementById("buyer-phone");
  const buyerEmail = document.getElementById("buyer-email");
  const buyerAddress = document.getElementById("buyer-address");
  const deliveryDate = document.getElementById("delivery-date");

  // Clear input errors
  [buyerName, buyerPhone, buyerEmail, buyerAddress, deliveryDate].forEach(
    clearError,
  );

  // Clear dropdown errors
  clearDropdownError("buyer-city-code");
  clearDropdownError("buyer-district-code");
  clearDropdownError("buyer-ward-code");

  // Validate input
  if (!buyerName.value.trim()) {
    showError(buyerName, "Vui lòng nhập họ tên");
    isValid = false;
  }

  if (!buyerPhone.value.trim()) {
    showError(buyerPhone, "Vui lòng nhập số điện thoại");
    isValid = false;
  } else if (!phoneRegex.test(buyerPhone.value.trim())) {
    showError(buyerPhone, "Số điện thoại không hợp lệ (VD: 090xxxxxxx)");
    isValid = false;
  }

  if (!buyerEmail.value.trim()) {
    showError(buyerEmail, "Vui lòng nhập email");
    isValid = false;
  } else if (!emailRegex.test(buyerEmail.value.trim())) {
    showError(buyerEmail, "Email không đúng định dạng (VD: abc@gmail.com)");
    isValid = false;
  }

  if (!buyerAddress.value.trim()) {
    showError(buyerAddress, "Vui lòng nhập địa chỉ cụ thể");
    isValid = false;
  }

  if (!deliveryDate.value) {
    showError(deliveryDate, "Vui lòng chọn ngày giao");
    isValid = false;
  }

  // Validate dropdown buyer
  if (!document.getElementById("buyer-city-code").value) {
    showDropdownError("buyer-city-code", "Vui lòng chọn Tỉnh / Thành phố");
    isValid = false;
  }

  if (!document.getElementById("buyer-district-code").value) {
    showDropdownError("buyer-district-code", "Vui lòng chọn Quận / Huyện");
    isValid = false;
  }

  if (!document.getElementById("buyer-ward-code").value) {
    showDropdownError("buyer-ward-code", "Vui lòng chọn Phường / Xã");
    isValid = false;
  }

  // Nếu là quà tặng
  if (document.getElementById("isGift").checked) {
    const rn = document.getElementById("recipient-name");
    const rp = document.getElementById("recipient-phone");
    const ra = document.getElementById("recipient-address-detail");

    [rn, rp, ra].forEach(clearError);

    clearDropdownError("recipient-city-code");
    clearDropdownError("recipient-district-code");
    clearDropdownError("recipient-ward-code");

    if (!rn.value.trim()) {
      showError(rn, "Vui lòng nhập tên người nhận");
      isValid = false;
    }

    if (!rp.value.trim()) {
      showError(rp, "Vui lòng nhập SĐT người nhận");
      isValid = false;
    } else if (!phoneRegex.test(rp.value.trim())) {
      showError(rp, "SĐT người nhận không hợp lệ");
      isValid = false;
    }

    if (!ra.value.trim()) {
      showError(ra, "Vui lòng nhập địa chỉ người nhận");
      isValid = false;
    }

    if (!document.getElementById("recipient-city-code").value) {
      showDropdownError(
        "recipient-city-code",
        "Vui lòng chọn Tỉnh / Thành phố",
      );
      isValid = false;
    }

    if (!document.getElementById("recipient-district-code").value) {
      showDropdownError(
        "recipient-district-code",
        "Vui lòng chọn Quận / Huyện",
      );
      isValid = false;
    }

    if (!document.getElementById("recipient-ward-code").value) {
      showDropdownError("recipient-ward-code", "Vui lòng chọn Phường / Xã");
      isValid = false;
    }
  }

  if (!isValid) scrollToFirstError();

  return isValid;
}

document.querySelectorAll(".custom-input").forEach((input) => {
  input.addEventListener("input", function () {
    clearError(this);
  });
});

// Hàm Modal
function showSuccessModal() {
  const modal = document.getElementById("success-modal");
  if (!modal) return;

  modal.classList.remove("modal-hidden");

  // ===== XÓA SẢN PHẨM ĐÃ ĐẶT KHỎI LOCALSTORAGE =====
  const cart = getCart();

  // Chỉ giữ lại item CHƯA check
  const remainingItems = cart.filter((item) => !item.checked);

  setCart(remainingItems);

  // Update lại UI badge
  updateHeaderBadge();
}

// Về giỏ hàng khi click nền mờ
document.addEventListener("click", function (e) {
  const modal = document.getElementById("success-modal");
  if (!modal) return;

  if (e.target === modal) {
    // Click nền mờ → về giỏ hàng
    window.location.href = "cart.html"; // đổi đúng tên file giỏ hàng
  }
});
