class MyHeader extends HTMLElement {
  connectedCallback() {
    // 1. Logic tính toán đường dẫn (Giữ nguyên vì logic bạn làm rất tốt)
    const isSubFolder = window.location.pathname.includes("/occasions/");
    const basePath = isSubFolder ? "../" : "";

    // 2. Logic Active Menu (Bổ sung thêm trường hợp trang chủ)
    const currentFile = window.location.pathname.split("/").pop();
    const isActive = (fileName) => {
      // Nếu file hiện tại trùng tên HOẶC (đang ở trang chủ mà file là index.html)
      if (currentFile === fileName || (currentFile === "" && fileName === "index.html")) {
        return "active";
      }
      return "";
    };

    this.innerHTML = `
   <style>
      .nav-link { transition: all 0.3s ease; }
      .nav-link:hover, .nav-link.active { transform: scale(1.05); text-shadow: 0 0 1px currentColor; color: var(--primary-hover) !important; }
      
      /* Đồng bộ hiệu ứng nút Menu Mobile giống y hệt với các mục nav-link */
      .navbar-toggler {
        transition: all 0.3s ease;
        border: none !important;
        background: transparent !important;
      }
      
      /* Tắt triệt để cái viền màu đen xấu xí do Bootstrap tự tạo khi click */
      .navbar-toggler:focus, .navbar-toggler:active {
        box-shadow: none !important;
        outline: none !important;
      }
      
      /* Áp dụng hover và active y hệt ".nav-link" */
      .navbar-toggler:hover, .navbar-toggler[aria-expanded="true"] {
        transform: scale(1.1); /* Phóng to lên chút xíu */
      }
      
      /* Đổi màu icon bên trong y hệt chữ link khi hover */
      .navbar-toggler:hover i, .navbar-toggler[aria-expanded="true"] i {
        color: var(--primary-hover) !important;
        text-shadow: 0 0 1px currentColor;
        transition: all 0.3s ease;
      }

      /* Tùy chỉnh ô Search */
      .search-input-premium::placeholder {
        color: #bfaab3 !important;
        font-style: italic;
        font-size: 0.95rem;
      }
      .search-input-premium:focus {
        border-color: var(--primary-color) !important;
        box-shadow: 0 6px 20px rgba(100, 13, 51, 0.12) !important;
        outline: none;
      }
    </style>

    <header>
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: var(--bg-cream); padding: 12px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.31);">
        <div class="container-fluid align-items-center">

          <a class="navbar-brand me-0" href="${basePath}index.html" 
             style="font-family: 'Yeseva One', cursive; font-size: 1.8rem; color: var(--primary-color);">
             <!-- Ảnh logo thay thế cho icon hoa -->
             <img class="d-lg-none" src="${basePath}assets/images/Log.png" alt="Flower Shop" style="height: 35px; width: auto; object-fit: contain;"> 
             <span class="d-none d-lg-inline">Flower Shop</span> 
          </a>

          <div class="d-flex align-items-center gap-3 order-lg-last ms-auto">
            <!-- Form Tìm Kiếm -->
            <form action="${basePath}index.html" method="GET" class="position-relative d-flex align-items-center m-0" id="searchForm">
              <input type="text" name="search" id="searchInput" class="search-input-premium form-control rounded-pill" placeholder="Tìm hoa yêu thích..." 
                style="width: 0px; padding: 0px; opacity: 0; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); border: 1.5px solid var(--primary-color); background-color: #fff; box-shadow: 0 4px 15px rgba(100, 13, 51, 0.06); font-family: var(--font-body); font-size: 1rem; color: var(--primary-color); position: absolute; right: 0; z-index: 100; padding-right: 40px; outline: none; height: 40px;">
              <button type="button" id="searchBtnToggle" class="btn btn-link p-0 text-decoration-none shadow-none border-0 bg-transparent" style="z-index: 101; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; position: relative;">
                <i class="bi bi-search" style="font-size: 1.35rem; color: var(--primary-color); transition: all 0.3s ease;"></i>
              </button>
            </form>
            
            <a href="${basePath}cart.html" class="text-decoration-none position-relative">
                <i class="bi bi-bag-fill" style="font-size: 1.35rem; color: var(--primary-color);"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem; border: 2px solid var(--bg-cream);">0</span>
            </a>

            <a href="${basePath}login.html" class="text-decoration-none d-none d-sm-block">
                <i class="bi bi-person-circle" style="font-size: 1.45rem; color: var(--primary-color);"></i>
            </a>

            <!-- Nút hamburger menu đưa qua bên phải ngoài cùng rẽ bằng d-lg-none -->
            <button class="navbar-toggler border-0 px-1 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu" aria-controls="mobileMenu" aria-expanded="false" aria-label="Toggle navigation">
              <i class="bi bi-list" style="font-size: 1.8rem; color: var(--primary-color);"></i>
            </button>
          </div>

          <div class="collapse navbar-collapse justify-content-center" id="mobileMenu">
            <ul class="navbar-nav mb-2 mb-lg-0 gap-2 gap-lg-4 text-center mt-3 mt-lg-0" 
                style="font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 500; color: var(--primary-color);">
              
              <li class="nav-item">
                <a class="nav-link ${isActive("arragingPage.html")}" href="${basePath}arragingPage.html" style="color: #D81B60; font-weight: bold;">
                  <i class="bi bi-palette d-lg-none me-2"></i>Tự cắm hoa
                </a>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="bi bi-grid d-lg-none me-2"></i>Chủ đề
                </a>
                <ul class="dropdown-menu border-0 shadow-sm text-center text-lg-start" style="background-color: var(--bg-cream);">
                  <li><a class="dropdown-item" href="${basePath}occasions/birthday.html">Sinh nhật</a></li>
                  <li><a class="dropdown-item" href="${basePath}occasions/valentine.html">Valentine</a></li>
                  <li><a class="dropdown-item" href="${basePath}occasions/grand_opening.html">Khai trương</a></li>
                  <li><a class="dropdown-item" href="${basePath}occasions/sympathy.html">Lễ tang</a></li>
                </ul>
              </li>
              
              <li class="nav-item">
                <a class="nav-link ${isActive("wiki.html")}" href="${basePath}wiki.html">
                  <i class="bi bi-journal-text d-lg-none me-2"></i>Blog Hoa
                </a>
              </li>

              <li class="nav-item d-sm-none">
                <a class="nav-link ${isActive("login.html")}" href="${basePath}login.html">
                  <i class="bi bi-person-circle me-2"></i>Tài khoản
                </a>
              </li>

              <li class="nav-item d-none d-lg-block">
                <a class="nav-link ${isActive("about.html")} text-center px-1" href="${basePath}about.html">
                  Liên Hệ
                </a>
              </li>
              
            </ul>
          </div>

        </div>
      </nav>
    </header>
    `;

    // Khởi tạo Logic hiệu ứng Tìm Kiếm cho Form
    const searchBtn = this.querySelector("#searchBtnToggle");
    const searchInput = this.querySelector("#searchInput");
    const searchForm = this.querySelector("#searchForm");
    const searchIcon = searchBtn.querySelector("i");
    let searchOpen = false;

    if (searchBtn && searchInput) {
      // Mở sẵn search bar nếu đang có parameter search ở URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get("search");
      if (urlSearch) {
        searchInput.value = urlSearch;
        searchOpen = true;
        // Kích thước co giãn linh hoạt trên Mobile
        searchInput.style.width = window.innerWidth < 576 ? "160px" : "220px";
        searchInput.style.padding = "5px 35px 5px 15px";
        searchInput.style.opacity = "1";
        searchIcon.classList.remove("bi-search");
        searchIcon.classList.add("bi-x-lg");
      }

      searchBtn.addEventListener("click", (e) => {
        if (!searchOpen) {
          // Mở ô nhập liệu
          searchInput.style.width = window.innerWidth < 576 ? "160px" : "220px";
          searchInput.style.padding = "5px 35px 5px 15px";
          searchInput.style.opacity = "1";
          searchIcon.classList.remove("bi-search");
          searchIcon.classList.add("bi-x-lg");
          searchInput.focus();
          searchOpen = true;
        } else {
          // Nếu có nội dung thì Submit form để tìm kiếm
          if (searchInput.value.trim() !== "" && urlSearch !== searchInput.value.trim()) {
            searchForm.submit();
          } else {
            // Nếu ô trống (hoặc y nguyên) thì Đóng lại
            searchInput.style.width = "0px";
            searchInput.style.padding = "0px";
            searchInput.style.opacity = "0";
            searchIcon.classList.remove("bi-x-lg");
            searchIcon.classList.add("bi-search");
            if (!urlSearch) searchInput.value = "";
            searchOpen = false;

            // Tùy chọn: Nhấn X ở trang tìm kiếm để tự return về index gốc
            if (urlSearch) {
              window.location.href = `${basePath}index.html`;
            }
          }
        }
      });

      // Bắt sự kiện Enter (ngăn không submit nếu để trống)
      searchForm.addEventListener("submit", (e) => {
        if (searchInput.value.trim() === "") {
          e.preventDefault();
        }
      });
    }
  }
}

class MyFooter extends HTMLElement {
  connectedCallback() {
    // 1. Logic tính toán đường dẫn (Giữ nguyên vì logic bạn làm rất tốt)
    const isSubFolder = window.location.pathname.includes("/occasions/");
    const basePath = isSubFolder ? "../" : "";

    this.innerHTML = `
    <footer class="text-center text-white mt-auto" style="background-color: var(--primary-color); font-family: var(--font-body)">
      <div class="container pt-4 pb-4 d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
                <section class="text-center text-lg-start">
                    <a class="navbar-brand me-0" href="${basePath}index.html" 
                style="font-family: 'Yeseva One', cursive; font-size: 2rem; color: #ffffff !important;">
                <img class="d-lg-none" src="${basePath}assets/images/Logo_footer.png" alt="Flower Shop" style="height: 100px; width: auto; object-fit: contain; filter: grayscale(100%);">
                <span class="d-none d-lg-inline">Flower Shop</span>
              </a>
              <p class="small text-white-50 m-0 d-none d-lg-inline">Trao gửi yêu thương qua từng cánh hoa.</p>
                </section>

                <section>
                    <a class="btn btn-outline-light btn-floating m-1 rounded-circle" href="#!" role="button"><i class="bi bi-facebook"></i></a>
                    <a class="btn btn-outline-light btn-floating m-1 rounded-circle" href="#!" role="button"><i class="bi bi-instagram"></i></a>
                    <a class="btn btn-outline-light btn-floating m-1 rounded-circle" href="#!" role="button"><i class="bi bi-tiktok"></i></a>
                    <a class="btn btn-outline-light btn-floating m-1 rounded-circle" href="#!" role="button"><i class="bi bi-google"></i></a>
                </section>

                <section class="text-center text-lg-end text-white-50">
                    <span class="small">© 2026 Copyright:</span>
                    <a class="text-white text-decoration-none fw-bold small" href="#">Nhóm 03_CT188 - CTU</a>
                </section>
      </div>
    </footer>
    `;
  }
}

customElements.define("my-header", MyHeader);
customElements.define("my-footer", MyFooter);
