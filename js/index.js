document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const priceCheckboxes = document.querySelectorAll(
    '.filter-group-price input[type="checkbox"]',
  );
  const occasionCheckboxes = document.querySelectorAll(
    '.filter-group-occasion input[type="checkbox"]',
  );
  const colorCheckboxes = document.querySelectorAll(
    '.filter-group-color input[type="checkbox"]',
  );
  const resetButton = document.querySelector(".filter-reset");

  // DOM mới cho Phân trang và Sắp xếp
  const sortSelect = document.getElementById("sort-select");
  const paginationContainer = document.getElementById("pagination");
  const productCountLabel = document.getElementById("product-count-label");

  let currentPage = 1;
  const itemsPerPage = 12; // Hiển thị 12 sản phẩm mỗi trang

  let allProducts = []; // toàn bộ sản phẩm
  let filteredProducts = []; // sản phẩm sau khi lọc
  let bestSellerProducts = []; //sản phẩm bán chạy nhất

  // Tính toán base path y như trên Navbar để load ảnh và link chuẩn ở mọi nơi
  const isSubFolder =
    window.location.pathname.includes("/occasions/") ||
    window.location.pathname.includes("/shop/");
  const basePath = isSubFolder ? "../" : "";

  // Format giá tiền theo dấu . tiếng anh và chữ vnđ cực nhỏ ở góc
  function formatPrice(price) {
    return (
      price.toLocaleString("en-US") +
      `<sup style="font-size: 0.65em; font-weight: 600; margin-left: 2px; text-transform: lowercase;">vnđ</sup>`
    );
  }

  // Render danh sách sản phẩm (An toàn khóa nếu không có container)
  function renderProducts(data) {
    if (!productList) return;

    if (data.length === 0) {
      productList.innerHTML = `
      <div class="col-12 d-flex justify-content-center align-items-center" style="min-height: 400px;">
        <p class="text-muted text-center m-0" style="font-size: 1.1rem;">Không tìm thấy sản phẩm phù hợp<br>với bộ lọc.</p>
      </div>`;
      return;
    }

    productList.innerHTML = data
      .map(
        (product) => `
      <div class="col">
        <a href="${basePath}detail.html?id=${product.id}">
          <div class="product-card">
            <div class="product-card-img">
              <img src="${basePath}${product.images[0]}" alt="${product.name}" />
            </div>
            <div class="product-card-info">
              <h5 class="product-card-info-name">${product.name}</h5>
              <p class="product-card-info-price" style="font-size: 1.15rem;">${formatPrice(product.price)}</p>
              <div class="product-card-info-rating">
                <img src="${basePath}assets/images/logo_rating.png" alt="rating" />
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

  // Render danh sách sản phẩm Best Seller
  const productBestSeller = document.getElementById("product-best-seller");

  function renderBestSellers(data) {
    if (!productBestSeller) return;
    productBestSeller.innerHTML = data
      .map(
        (product) => `
      <div class="col">
        <a href="${basePath}detail.html?id=${product.id}">
          <div class="product-card">
            <div class="product-card-img">
              <img src="${basePath}${product.images[0]}" alt="${product.name}" />
            </div>
            <div class="product-card-info">
              <h5 class="product-card-info-name">${product.name}</h5>
              <p class="product-card-info-price" style="font-size: 1.15rem;">${formatPrice(product.price)}</p>
              <div class="product-card-info-rating">
                <img src="${basePath}assets/images/logo_rating.png" alt="rating" />
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

    const selectedOccasions = Array.from(occasionCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const selectedColors = Array.from(colorCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    return { selectedPrices, selectedOccasions, selectedColors };
  }

  // Áp dụng lọc
  function applyFilters() {
    const { selectedPrices, selectedOccasions, selectedColors } = getActiveFilters();

    filteredProducts = allProducts.filter((product) => {
      let matchPrice = true;
      let matchOccasion = true;
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

      // Lọc theo chủ đề (Occasion)
      if (selectedOccasions.length > 0) {
        matchOccasion = selectedOccasions.some((occ) => product.category.includes(occ));
      }

      // Lọc theo màu
      if (selectedColors.length > 0) {
        matchColor = selectedColors.some((color) => product.color.includes(color));
      }

      return matchPrice && matchOccasion && matchColor;
    });

    currentPage = 1; // Reset trang về 1 mỗi khi lọc
    renderPaginatedProducts();
  }

  // Sắp xếp và Phân trang (Kết hợp với lọc)
  function renderPaginatedProducts() {
    if (!productList) return;

    // 1. Sắp xếp mảng filteredProducts
    let sortedProducts = [...filteredProducts];
    if (sortSelect) {
      const sortValue = sortSelect.value;
      if (sortValue === "price-asc") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortValue === "price-desc") {
        sortedProducts.sort((a, b) => b.price - a.price);
      } else if (sortValue === "rating") {
        sortedProducts.sort((a, b) => b.rating - a.rating);
      }
      // "featured" mặc định không đổi (hoặc tự thiết kế logic)
    }

    // Cập nhật nhãn đếm sản phẩm
    if (productCountLabel) {
      let showingEnd = Math.min(currentPage * itemsPerPage, sortedProducts.length);
      let showingStart =
        sortedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
      productCountLabel.textContent = `Hiển thị ${showingStart}-${showingEnd} trong số ${sortedProducts.length} sản phẩm`;
    }

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

    // Nút Trang (Giới hạn hiển thị để chống tràn trên Mobile)
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
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
            <span class="page-link" style="background:transparent; border:none; color:#999; pointer-events:none; width:auto; justify-content:flex-end; padding:0 2px; border-radius:0 !important; cursor:default;">...</span>
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

        let newPage = parseInt(this.getAttribute("data-page"));
        if (!isNaN(newPage)) {
          currentPage = newPage;
          renderPaginatedProducts();

          // Cuộn nhẹ lên đầu Danh sách sản phẩm (Tùy chọn cho xịn)
          const listTop = productList.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: listTop, behavior: "smooth" });
        }
      });
    });
  }

  // Reset filter
  function resetFilters() {
    priceCheckboxes.forEach((cb) => (cb.checked = false));
    occasionCheckboxes.forEach((cb) => (cb.checked = false));
    colorCheckboxes.forEach((cb) => (cb.checked = false));
    if (sortSelect) sortSelect.value = "featured"; // Reset sort
    filteredProducts = [...allProducts];
    currentPage = 1;
    renderPaginatedProducts();
  }

  // Load JSON và khởi tạo
  const jsonPath = isSubFolder ? "../products.json" : "products.json";

  fetch(jsonPath)
    .then((response) => response.json())
    .then((products) => {
      allProducts = products;
      filteredProducts = [...allProducts];

      // Đổ dữ liệu vào trang danh sách (nếu có productList)
      applyFilters(); // Bắt đầu từ applyFilters để khởi động sort & paginated render

      // -- LỌC BEST SELLER (Lấy chuẩn 4 sản phẩm đánh giá 5 sao giá cao nhất) --
      if (productBestSeller) {
        bestSellerProducts = [...products]
          .filter((product) => product.rating === 5) // Lọc sản phẩm 5 sao
          .sort((a, b) => b.price - a.price) // Sắp xếp giá giảm dần (mắc nhất nằm đầu)
          .slice(0, 4); // Vừa đúng lấy 4 sản phẩm

        renderBestSellers(bestSellerProducts); // Render ra HTML
      }
    })
    .catch((error) => {
      console.error("Lỗi load JSON:", error);
      if (productList)
        productList.innerHTML = `<p class="text-danger text-center">Không thể tải danh sách sản phẩm.</p>`;
    });

  // Gắn sự kiện thay đổi checkbox
  priceCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
  occasionCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
  colorCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));

  // Sự kiện khi Sort thay đổi
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentPage = 1; // Sắp xếp lại thì về trang đầu
      renderPaginatedProducts();
    });
  }

  // Gắn sự kiện cho Dropdown Menu Custom UI
  const sortItems = document.querySelectorAll(".custom-sort-menu .dropdown-item");
  const sortSelectedText = document.getElementById("sort-selected-text");

  if (sortItems.length > 0 && sortSelect) {
    sortItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active cũ
        sortItems.forEach((i) => {
          i.classList.remove("active");
        });

        // Set active mới
        this.classList.add("active");

        // Lấy text hiển thị bỏ đi icon
        const rawText = this.textContent.trim();
        sortSelectedText.textContent = rawText;

        // Cập nhật giá trị thẻ select thực & kích hoạt change
        const value = this.getAttribute("data-value");
        sortSelect.value = value;
        sortSelect.dispatchEvent(new Event("change"));
      });
    });
  }

  // Gắn sự kiện nút Reset
  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }
});
