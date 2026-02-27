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
    </style>

    <header>
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: var(--bg-cream); padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div class="container-fluid align-items-center">

          <button class="navbar-toggler border-0 px-1" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu" aria-controls="mobileMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <a class="navbar-brand me-0 mx-auto mx-lg-0" href="${basePath}index.html" 
             style="font-family: 'Yeseva One', cursive; font-size: 1.8rem; color: var(--primary-color);">
             <i class="bi bi-flower1 d-lg-none"></i> <span class="d-none d-lg-inline">Flower Shop</span> </a>

          <div class="d-flex align-items-center gap-3 order-lg-last">
            <a href="#" class="text-decoration-none"><i class="bi bi-search" style="font-size: 1.2rem; color: var(--primary-color);"></i></a>
            
            <a href="${basePath}cart.html" class="text-decoration-none position-relative">
                <i class="bi bi-bag-fill" style="font-size: 1.2rem; color: var(--primary-color);"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">0</span>
            </a>

            <a href="${basePath}setting.html" class="text-decoration-none d-none d-sm-block">
                <i class="bi bi-person-circle" style="font-size: 1.3rem; color: var(--primary-color);"></i>
            </a>
          </div>

          <div class="collapse navbar-collapse justify-content-center" id="mobileMenu">
            <ul class="navbar-nav mb-2 mb-lg-0 gap-2 gap-lg-4 text-center mt-3 mt-lg-0" 
                style="font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 500; color: var(--primary-color);">
              
              <li class="nav-item">
                <a class="nav-link ${isActive("builder.html")}" href="${basePath}builder.html" style="color: #D81B60; font-weight: bold;">
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
                </ul>
              </li>
              
              <li class="nav-item">
                <a class="nav-link ${isActive("wiki.html")}" href="${basePath}wiki.html">
                  <i class="bi bi-journal-text d-lg-none me-2"></i>Blog Hoa
                </a>
              </li>

              <li class="nav-item d-sm-none">
                <a class="nav-link ${isActive("setting.html")}" href="${basePath}setting.html">
                  <i class="bi bi-person-circle me-2"></i>Tài khoản
                </a>
              </li>

              <li class="nav-item d-none d-lg-block">
                <a class="nav-link ${isActive("about.html")} text-center px-1" href="${basePath}about.html">
                  About
                </a>
              </li>
              
            </ul>
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
