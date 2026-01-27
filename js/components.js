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
      @media (min-width: 992px) {
        .nav-center-desktop {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: auto;
        }
      }
    </style>
    <header>
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: var(--bg-cream); padding: 5px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div class="container-fluid row align-items-center flex-nowrap g-2 position-relative justify-content-between">

          <!-- 1. Logo -->
          <div class="col-auto order-1" style="margin-left:10px;">
            <a class="navbar-brand me-0" href="${basePath}index.html" 
               style="font-family: 'Yeseva One', cursive; font-size: 2rem; color: var(--primary-color);">
               <img class="d-lg-none" src="${basePath}assets/images/Log.png" alt="Flower Shop" style="height: 35px; width: auto; object-fit: contain;">
               <span class="d-none d-lg-inline">Flower Shop</span>
            </a>
          </div>

          <!-- 2. Menu (Middle) -->
          <div class="col order-2 px-0 nav-center-desktop" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto mb-0 gap-1 gap-lg-3 flex-row justify-content-center" 
                style="font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 500; color: var(--primary-color);">
              
              <li class="nav-item">
                <a class="nav-link ${isActive("shop.html")} text-center px-1" href="${basePath}shop.html">
                  <span class="d-none d-lg-inline">Sản phẩm</span>
                  <i class="bi bi-shop d-lg-none" style="font-size: 1.2rem;" title="Sản phẩm"></i>
                </a>
              </li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-center px-1" href="#" role="button" data-bs-toggle="dropdown">
                  <span class="d-none d-lg-inline">Chủ đề</span>
                  <i class="bi bi-grid d-lg-none" style="font-size: 1.2rem;" title="Chủ đề"></i>
                </a>
                <ul class="dropdown-menu" style="font-family: 'Playfair Display', serif; --bs-dropdown-link-color: var(--primary-color); background-color: var(--bg-cream); border: 1px solid rgba(0,0,0,0.05);">
                  <li><a class="dropdown-item" href="${basePath}occasions/birthday.html">Sinh nhật</a></li>
                  <li><a class="dropdown-item" href="${basePath}occasions/valentine.html">Valentine</a></li>
                  <li><a class="dropdown-item" href="${basePath}occasions/grand_opening.html">Khai trương</a></li>
                  <li><a class="dropdown-item" href="${basePath}occasions/sympathy.html">Chia buồn</a></li>
                </ul>
              </li>
              
              <li class="nav-item">
                <a class="nav-link ${isActive("wiki.html")} text-center px-1" href="${basePath}wiki.html">
                  <span class="d-none d-lg-inline">Blog Hoa</span>
                  <i class="bi bi-journal-text d-lg-none" style="font-size: 1.2rem;" title="Blog Hoa"></i>
                </a>
              </li>
              
              <li class="nav-item">
                <a class="nav-link ${isActive("about.html")} text-center px-1" href="${basePath}about.html">
                  <span class="d-none d-lg-inline">About</span>
                  <i class="bi bi-info-circle d-lg-none" style="font-size: 1.2rem;" title="About"></i>
                </a>
              </li>
              
              <li class="nav-item">
                <a class="nav-link ${isActive("contact.html")} text-center px-1" href="${basePath}contact.html">
                  <span class="d-none d-lg-inline">Liên hệ</span>
                  <i class="bi bi-telephone d-lg-none" style="font-size: 1.2rem;" title="Liên hệ"></i>
                </a>
              </li>
            </ul>
          </div>

          <!-- 3. System Icons (Right) -->
          <div class="col-auto d-flex justify-content-end align-items-center gap-3 header-icons order-3" style="margin-right:10px;">
            <a href="#" class="text-decoration-none"><i class="bi bi-search" style="font-size: 1.1rem;"></i></a>
            
            <a href="${basePath}cart.html" class="text-decoration-none position-relative">
                <i class="bi bi-bag-fill" style="font-size: 1.1rem;"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.5rem;">0</span>
            </a>

            <a href="${basePath}setting.html" class="text-decoration-none"><i class="bi bi-person-circle" style="font-size: 1.2rem;"></i></a>
          </div>

        </div>
      </nav>
    </header>
    `;
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
