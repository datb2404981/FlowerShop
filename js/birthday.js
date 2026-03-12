// valentine.js

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort-select");
  const sortItems = document.querySelectorAll(
    ".custom-sort-menu .dropdown-item",
  );
  const sortSelectedText = document.getElementById("sort-selected-text");

  function applySorting(products) {
    if (!sortSelect) return products;
    let sorted = [...products];
    const sortValue = sortSelect.value;
    if (sortValue === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }

  const productList = document.getElementById("product-list");
  const priceCheckboxes = document.querySelectorAll(
    '.filter-group-price input[type="checkbox"]',
  );
  const colorCheckboxes = document.querySelectorAll(
    '.filter-group-color input[type="checkbox"]',
  );
  const resetButton = document.querySelector(".filter-reset");
  const paginationContainer = document.getElementById("pagination");

  let allProducts = []; // toàn bộ sản phẩm Birthday
  let filteredProducts = []; // sản phẩm sau khi lọc
  let currentPage = 1;
  const itemsPerPage = 8; // Số lượng sản phẩm mỗi trang

  // Format giá tiền
  function formatPrice(price) {
    return (
      price.toLocaleString("en-US") + '<sup class="price-currency">vnđ</sup>'
    );
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
              <div class="product-card-info-bottom">
                <div class="product-card-info-rating">
                  <i class="bi bi-star-fill" style="color: var(--text-accent); -webkit-text-stroke: 1px var(--text-accent);"></i>
                  <span>${product.rating}</span>
                </div>
                <p class="product-card-info-price">${formatPrice(product.price)}</p>
              </div>
            </div>
          </div>
        </a>
      </div>
    `,
      )
      .join("");
  }

  // Hàm render tổng quát bao gồm Sắp xếp và Phân trang
  function renderPaginatedProducts() {
    if (!productList) return;

    // 1. Sắp xếp mảng filteredProducts
    let sortedProducts = applySorting(filteredProducts);

    // 2. Chặt mảng phân trang
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSlice = sortedProducts.slice(startIndex, endIndex);

    // Render sản phẩm ra UI
    renderProducts(paginatedSlice);

    // 3. Render nút phân trang
    renderPagination(totalPages);
  }

  // Render nút Phân trang
  function renderPagination(totalPages) {
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let pageHtml = "";

    // Nút Previous
    pageHtml += `
      <li class="page-item ${currentPage === 1 ? "disabled opacity-50" : ""}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">
          <i class="bi bi-chevron-left" style="font-size: 0.8rem;"></i>
        </a>
      </li>
    `;

    // Nút Trang
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    pages.forEach((p) => {
      if (p === "...") {
        pageHtml += `
          <li class="page-item disabled">
            <span class="page-link" style="background:transparent; border:none; color:#999; pointer-events:none; width:auto; justify-content:center; padding:0 2px; border-radius:0 !important; cursor:default;">...</span>
          </li>
        `;
      } else {
        pageHtml += `
          <li class="page-item ${currentPage === p ? "active" : ""}">
            <a class="page-link" href="#" data-page="${p}">${p}</a>
          </li>
        `;
      }
    });

    // Nút Next
    pageHtml += `
      <li class="page-item ${currentPage === totalPages ? "disabled opacity-50" : ""}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">
          <i class="bi bi-chevron-right" style="font-size: 0.8rem;"></i>
        </a>
      </li>
    `;

    paginationContainer.innerHTML = pageHtml;

    // Gắn sự kiện click page
    const pageLinks = paginationContainer.querySelectorAll(".page-link");
    pageLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const parentLi = this.parentElement;
        if (
          parentLi.classList.contains("disabled") ||
          parentLi.classList.contains("active")
        )
          return;

        currentPage = parseInt(this.getAttribute("data-page"));
        renderPaginatedProducts();

        // Cuộn lên đầu danh sách sản phẩm
        productList.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
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

      // Lọc theo màu
      if (selectedColors.length > 0) {
        matchColor = selectedColors.some((color) =>
          product.color.includes(color),
        );
      }

      return matchPrice && matchColor;
    });

    currentPage = 1; // Reset về trang 1 khi lọc
    renderPaginatedProducts();
  }

  // Reset filter
  function resetFilters() {
    priceCheckboxes.forEach((cb) => (cb.checked = false));
    colorCheckboxes.forEach((cb) => (cb.checked = false));
    filteredProducts = [...allProducts];
    if (sortSelect) {
      sortSelect.value = "featured";
      sortItems.forEach((i) => i.classList.remove("active"));
      if (sortItems[0]) sortItems[0].classList.add("active");
      if (sortSelectedText) sortSelectedText.textContent = "Sắp xếp: Nổi bật";
    }
    currentPage = 1;
    renderPaginatedProducts();
  }

  // Load JSON và khởi tạo
  fetch("../products.json")
    .then((response) => response.json())
    .then((products) => {
      allProducts = products.filter((product) =>
        product.category.includes("Hoa Sinh Nhật"),
      );
      filteredProducts = [...allProducts];
      if (sortSelect) {
        sortSelect.value = "featured";
        sortItems.forEach((i) => i.classList.remove("active"));
        if (sortItems[0]) sortItems[0].classList.add("active");
        if (sortSelectedText) sortSelectedText.textContent = "Sắp xếp: Nổi bật";
      }
      currentPage = 1;
      renderPaginatedProducts();
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
  if (sortItems.length > 0 && sortSelect) {
    sortItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        sortItems.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");
        sortSelectedText.textContent = this.textContent.trim();
        sortSelect.value = this.getAttribute("data-value");
        sortSelect.dispatchEvent(new Event("change"));
      });
    });
    sortSelect.addEventListener("change", () => {
      currentPage = 1; // Reset về trang 1 khi đổi sắp xếp
      renderPaginatedProducts();
    });
  }
});
