document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const priceCheckboxes = document.querySelectorAll(
    '.filter-group-price input[type="checkbox"]',
  );
  const colorCheckboxes = document.querySelectorAll(
    '.filter-group-color input[type="checkbox"]',
  );
  const resetButton = document.querySelector(".filter-reset");

  let allProducts = []; // toàn bộ sản phẩm Valentine
  let filteredProducts = []; // sản phẩm sau khi lọc

  // Format giá tiền
  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
  }

  // Render danh sách sản phẩm
  function renderProducts(data) {
    if (data.length === 0) {
      productList.innerHTML = `<p class="text-center text-muted py-5">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>`;
      return;
    }

    productList.innerHTML = data
      .map(
        (product) => `
      <div class="col">
        <a href="../detail.html?id=${product.id}">
          <div class="product-card">
            <div class="product-card-img">
              <img src="/${product.images[0]}" alt="${product.name}" />
            </div>
            <div class="product-card-info">
              <h5 class="product-card-info-name">${product.name}</h5>
              <p class="product-card-info-price">${formatPrice(product.price)}</p>
              <div class="product-card-info-rating">
                <img src="/assets/images/logo_rating.png" alt="rating" />
                <span>${product.rating}</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    `,
      )
      .join("");
  }

  // Lấy các bộ lọc đang chọn
  function getActiveFilters() {
    const selectedPrices = Array.from(priceCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.nextElementSibling.textContent.trim());

    const selectedColors = Array.from(colorCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    return { selectedPrices, selectedColors };
  }

  // Áp dụng lọc
  function applyFilters() {
    const { selectedPrices, selectedColors } = getActiveFilters();

    filteredProducts = allProducts.filter((product) => {
      let matchPrice = true;
      let matchColor = true;

      // Lọc theo giá
      if (selectedPrices.length > 0) {
        matchPrice = selectedPrices.some((range) => {
          if (range === "Dưới 500.000đ") return product.price < 500000;
          if (range === "1.000.000đ - 1.500.000đ")
            return product.price >= 1000000 && product.price <= 1500000;
          if (range === "1.500.000đ - 2.000.000đ")
            return product.price >= 1500000 && product.price <= 2000000;
          if (range === "Trên 2.000.000đ") return product.price > 2000000;
          return false;
        });
      }

      // Lọc theo màu (ít nhất 1 màu khớp)
      if (selectedColors.length > 0) {
        matchColor = selectedColors.some((color) => product.color.includes(color));
      }

      return matchPrice && matchColor;
    });

    renderProducts(filteredProducts);
  }

  // Reset filter
  function resetFilters() {
    priceCheckboxes.forEach((cb) => (cb.checked = false));
    colorCheckboxes.forEach((cb) => (cb.checked = false));
    filteredProducts = [...allProducts];
    renderProducts(filteredProducts);
  }

  // Load JSON và khởi tạo
  fetch("../products.json")
    .then((response) => response.json())
    .then((products) => {
      // Chỉ lấy sản phẩm thuộc "Hoa Tình Yêu" (Valentine)
      allProducts = products.filter((product) =>
        product.category.includes("Hoa Tình Yêu"),
      );
      filteredProducts = [...allProducts];
      renderProducts(filteredProducts);
    })
    .catch((error) => {
      console.error("Lỗi load JSON:", error);
      productList.innerHTML = `<p class="text-danger text-center">Không thể tải danh sách sản phẩm.</p>`;
    });

  // Gắn sự kiện thay đổi checkbox
  priceCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
  colorCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));

  // Gắn sự kiện nút Reset
  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }
});
