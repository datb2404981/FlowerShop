let currentImageIndex = 0;

// =========================== GALLERY & LIGHTBOX ===========================
function initGallery() {
  const mainImages = document.querySelectorAll(".default .main-img img");
  const thumbnails = document.querySelectorAll(".default .thumb-list div");
  const lightboxMainImages = document.querySelectorAll(
    ".lightbox .main-img img",
  );
  const lightboxThumbnails = document.querySelectorAll(
    ".lightbox .thumb-list div",
  );
  const lightbox = document.querySelector(".lightbox");
  // const iconClose = document.querySelector(".icon-close");
  const iconPrev = document.querySelector(".icon-prev");
  const iconNext = document.querySelector(".icon-next");

  currentImageIndex = 0;
  // hange the class to 'active' to display the corresponding img
  const changeImage = (index, listMainImages, listThumbnails) => {
    listMainImages.forEach((img) => img.classList.remove("active"));
    listThumbnails.forEach((thumb) => thumb.classList.remove("active"));
    if (listMainImages[index]) listMainImages[index].classList.add("active");
    if (listThumbnails[index]) listThumbnails[index].classList.add("active");
    currentImageIndex = index;
  };

  // assign a click event to the list of thumbnails
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () =>
      changeImage(index, mainImages, thumbnails),
    );
  });

  lightboxThumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () =>
      changeImage(index, lightboxMainImages, lightboxThumbnails),
    );
  });

  // click on the large image -> lightbox
  mainImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      lightbox.classList.add("active");
      changeImage(index, lightboxMainImages, lightboxThumbnails);
    });
  });

  if (iconPrev) {
    iconPrev.onclick = () => {
      if (currentImageIndex <= 0)
        changeImage(
          mainImages.length - 1,
          lightboxMainImages,
          lightboxThumbnails,
        );
      else
        changeImage(
          currentImageIndex - 1,
          lightboxMainImages,
          lightboxThumbnails,
        );
    };
  }

  if (iconNext) {
    iconNext.onclick = () => {
      if (currentImageIndex >= mainImages.length - 1)
        changeImage(0, lightboxMainImages, lightboxThumbnails);
      else
        changeImage(
          currentImageIndex + 1,
          lightboxMainImages,
          lightboxThumbnails,
        );
    };
  }

  // if (iconClose)
  //     iconClose.onclick = () => lightbox.classList.remove("active");

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });
}

// =========================== CART ===========================
// handle incr & decr in purchase quantities and save products to LocalStorage.
function initCartLogic(productInfo) {
  const countEl = document.getElementById("numberDisplay");
  const minus = document.querySelector(".counter button:first-child");
  const plus = document.querySelector(".counter button:last-child");
  const addToCartBtn = document.querySelector(".add-to-cart");

  let count = 1;

  const updateCount = (newCount) => {
    count = newCount;
    countEl.value = count;
  };

  //increase
  minus.addEventListener("click", () => {
    if (count > 1) updateCount(count - 1);
  });

  //decrease
  plus.addEventListener("click", () => {
    updateCount(count + 1);
  });

  countEl.addEventListener("change", (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;

    updateCount(val);
  });

  //add to cart
  addToCartBtn.addEventListener("click", () => {
    //get info from the interface
    const productName = document.querySelector(".product-name").innerText;
    const priceText = document.querySelector(".price h1")
      ? document.querySelector(".price h1").innerText
      : document.querySelector(".price").innerText;
    const productPrice = parseInt(priceText.replace(/\D/g, ""));
    const productImg = document.querySelector(
      ".default.gallery .main-img img.active",
    ).src;

    const newItem = {
      id: productInfo.id,
      name: productName,
      price: productPrice,
      image: productImg,
      quantity: count,
    };

    //get the old shopping cart from LocalStorage. if !exist => create an empty array
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === newItem.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += newItem.quantity;
    } else {
      cart.push(newItem);
    }

    //save back to browser
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateHeaderBadge();

    // alert(`Đã thêm ${count} sản phẩm vào giỏ!`);

    showToast(`Đã thêm ${count} sản phẩm vào giỏ!`);
  });
}
//upd the quantity of items on the shopping cart icon
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

// ================== RELATED PRODUCTS ==================
//find & display the 4 most relevant products based on category & color
function renderRelatedProducts(currentProduct, allProducts) {
  const container = document.querySelector(".related-products-list");
  if (!container) return;

  //scoring algorithm
  const related = allProducts
    .filter((p) => p.id !== currentProduct.id) //eliminate itself
    .map((p) => {
      let score = 0;

      if (p.category.some((cat) => currentProduct.category.includes(cat))) {
        score += 2;
      }

      if (
        p.color &&
        currentProduct.color &&
        p.color.some((c) => currentProduct.color.includes(c))
      ) {
        score += 1;
      }

      return { ...p, score };
    })
    .filter((p) => p.score > 0) //only select related products
    .sort((a, b) => b.score - a.score); //sort: highest -> lowest

  //select the 4 highestscoring products
  const displayList = related.slice(0, 4);

  if (displayList.length === 0) {
    document.querySelector(".related-products").style.display = "none";
    return;
  }

  //render html to a user interface
  let html = "";
  displayList.forEach((p) => {
    const formattedPrice = p.price.toLocaleString("vi-VN") + " VNĐ";
    html += `
            <div class="related-item">
                <a href="detail.html?id=${p.id}" class="text-decoration-none">
                    <div class="img-box">
                        <img src="${p.images[0]}" alt="${p.name}">
                    </div>
                    <h3>${p.name}</h3>
                    <p>${formattedPrice}</p>
                </a>
            </div>
        `;
  });

  container.innerHTML = html;
}

// ================== LOAD DATA & INIT ==================
// extract the ID from the URL, load the JSON file, populate the data
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateHeaderBadge, 100);

  //get the ID from the URL
  const params = new URLSearchParams(window.location.search); //get id
  const productId = parseInt(params.get("id"));

  if (!productId) return;

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        // Random
        let min = 500;
        let max = 5000;
        const sharedReviewCount =
          Math.floor(Math.random() * (max - min + 1)) + min; //the number of reviews

        // Pass this number to both functions
        renderProductDetails(product, sharedReviewCount);
        renderReviews(product.rating, sharedReviewCount);

        initCartLogic(product);
        renderRelatedProducts(product, products);
      }
    })
    .catch((error) => console.error("Lỗi load sản phẩm:", error));
});

//fill in the info in the html
function renderProductDetails(product, reviewCount) {
  document.querySelector(".product-name").innerText = product.name;
  document.querySelector(".product-desc").innerText = product.description;

  //VND
  const formattedPrice = product.price.toLocaleString("vi-VN") + " VNĐ";
  const priceContainer = document.querySelector(".price");
  if (priceContainer.querySelector("p")) {
    priceContainer.querySelector("p").innerText = formattedPrice;
  } else {
    priceContainer.innerHTML = `<p>${formattedPrice}</p>`;
  }

  //upd breadcrumb
  const breadName = document.getElementById("bread-name");
  const breadCategory = document.getElementById("bread-category");

  if (breadName) breadName.innerText = product.name;
  if (breadCategory && product.category && product.category.length > 0) {
    breadCategory.innerText = product.category[0];
  }

  const smallStars = document.getElementById("small-stars");
  const smallCount = document.getElementById("small-count");

  if (smallStars) smallStars.innerHTML = generateStars(product.rating);

  if (smallCount) smallCount.innerText = reviewCount;

  let mainHtml = "";
  let thumbHtml = "";
  product.images.forEach((imgSrc, index) => {
    const activeClass = index === 0 ? "active" : "";
    mainHtml += `<img class="${activeClass}" src="${imgSrc}" alt="${product.name}">`;
    thumbHtml += `<div class="${activeClass}"><img src="${imgSrc}"></div>`;
  });

  //assign html to the DOM
  const defaultGallery = document.querySelector(".default.gallery");
  if (defaultGallery) {
    defaultGallery.querySelector(".main-img").innerHTML = mainHtml;
    defaultGallery.querySelector(".thumb-list").innerHTML = thumbHtml;
  }

  //upd lightbox
  const lightboxMainImg = document.querySelector(".lightbox .main-img");
  if (lightboxMainImg) {
    const iconsHtml = `
            <span class="icon-prev"><i class="bi bi-chevron-compact-left"></i></span>
            <span class="icon-next"><i class="bi bi-chevron-compact-right"></i></span>
            // <span class="icon-close"><i class="bi bi-x-circle-fill"></i></span>
        `;
    lightboxMainImg.innerHTML = iconsHtml + mainHtml;
    document.querySelector(".lightbox .thumb-list").innerHTML = thumbHtml;
  }
  initGallery();
}

// =========================== EVALUATION CHART ===========================
function renderReviews(avgRating, totalCount) {
  let dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  switch (true) {
    case avgRating === 5.0:
      dist = { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 };
      break;
    case avgRating >= 4.9:
      dist = { 5: 90, 4: 10, 3: 0, 2: 0, 1: 0 };
      break;
    case avgRating >= 4.8:
      dist = { 5: 80, 4: 20, 3: 0, 2: 0, 1: 0 };
      break;
    case avgRating >= 4.7:
      dist = { 5: 75, 4: 20, 3: 5, 2: 0, 1: 0 };
      break;
    case avgRating >= 4.6:
      dist = { 5: 65, 4: 30, 3: 5, 2: 0, 1: 0 };
      break;
    case avgRating >= 4.0:
      dist = { 5: 40, 4: 35, 3: 15, 2: 5, 1: 5 };
      break;
    case avgRating >= 3.5:
      dist = { 5: 25, 4: 40, 3: 25, 2: 5, 1: 5 };
      break;
    case avgRating >= 3.0:
      dist = { 5: 15, 4: 20, 3: 40, 2: 15, 1: 10 };
      break;

    default:
      dist = { 5: 5, 4: 10, 3: 20, 2: 30, 1: 35 };
      break;
  }

  const avgEl = document.getElementById("avg-rating");
  const totalEl = document.getElementById("total-reviews");
  const starsEl = document.getElementById("avg-stars");
  const barsEl = document.getElementById("rating-bars");

  if (avgEl) avgEl.innerText = avgRating;

  if (totalEl) totalEl.innerText = totalCount.toLocaleString();

  if (starsEl) starsEl.innerHTML = generateStars(avgRating);

  if (barsEl) {
    barsEl.innerHTML = "";
    for (let i = 5; i >= 1; i--) {
      const percent = dist[i];
      const html = `
                <div class="rating-progress-value">
                    <span class="star-label">${i}</span> 
                    <div class="progress">
                        <div class="bar" style="width: ${percent}%"></div>
                    </div>
                    <span class="percentage-label">${percent}%</span>
                </div>
            `;
      barsEl.innerHTML += html;
    }
  }
}
// =========================== STAR ICON ===========================
function generateStars(rating) {
  let starsHtml = "";

  // Thuộc tính tạo viền: -webkit-text-stroke: 1px var(--text-accent);
  const strokeStyle = "-webkit-text-stroke: 1px var(--text-accent);";

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating))
      //full
      starsHtml += `<i class="bi bi-star-fill" style="color: var(--text-accent); ${strokeStyle}"></i>`;
    else if (i === Math.ceil(rating)) {
      //not full
      let percent = (rating - Math.floor(rating)) * 100;
      starsHtml += `
                <i class="bi bi-star-fill" style="
                    background: linear-gradient(90deg, var(--text-accent) ${percent}%, var(--bg-white) ${percent}%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: inline-block;
                    ${strokeStyle}
                "></i>`;
    } //empty
    else
      // color: transparent / white kết hợp với text-stroke sẽ tạo hiệu ứng chỉ có viền
      starsHtml += `<i class="bi bi-star-fill" style="color: white; ${strokeStyle}"></i>`;
  }
  return starsHtml;
}

// ================== CUSTOM TOAST ==================
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById("custom-toast");
  const toastMsg = document.getElementById("toast-message");

  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
