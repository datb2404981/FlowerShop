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

//Gọi các hàm khi reload
updateHeaderBadge();
initCard();

// Kiểm tra có card hay chưa
function initCard() {
  // Kiểm tra xem có flag vừa xóa hay không
  if (localStorage.getItem("delete_flag") === "true") {
    localStorage.removeItem("card");
    localStorage.removeItem("delete_flag");

    const canvas = document.querySelector(".card-canvas");
    if (canvas) canvas.innerHTML = "";

    return;
  }

  let card = JSON.parse(localStorage.getItem("card"));
  if (card && Object.keys(card).length > 0) {
    loadCard();
  }
}
function saveWidthCanvas() {
  const card = JSON.parse(localStorage.getItem("card")) || {};
  const canvas = document.querySelector(".card-canvas");
  card.canvasWidth = canvas.offsetWidth;
  localStorage.setItem("card", JSON.stringify(card));
}
saveWidthCanvas();
//  ========== Chức năng chọn tỉ lệ thiệp ==========
// Hàm lưu ratio bất kì
function saveRatio(ratio) {
  const card = JSON.parse(localStorage.getItem("card")) || {};
  const canvas = document.querySelector(".card-canvas");
  card.ratio = ratio;

  localStorage.setItem("card", JSON.stringify(card));
}

// Hàm thêm thao tác click cho từng nút
function addListener4RatioButton() {
  const buttons = document.querySelectorAll(".ratio-btn");
  const customBox = document.getElementById("custom-ratio-box");
  const btnGo = document.getElementById("btn-go");
  const canvas = document.querySelector(".card-canvas");
  const selector = document.querySelector(".ratio-selector");
  let ratio;

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      ratio = button.dataset.ratio;

      if (ratio !== "custom") {
        selector.classList.add("d-none");
        canvas.style.aspectRatio = ratio;
        canvas.classList.remove("d-none");
        //Lưu lại lên localStrorage
        saveRatio(ratio);
      } else {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        if (customBox) {
          customBox.classList.remove("d-none");
        }
      }
    });
  });

  if (btnGo) {
    btnGo.addEventListener("click", function () {
      const w = document.getElementById("w-input").value;
      const h = document.getElementById("h-input").value;

      if (w > 0 && h > 0) {
        selector.classList.add("d-none");
        canvas.style.aspectRatio = `${w}/${h}`;
        ratio = `${w}/${h}`;
        canvas.classList.remove("d-none");
        //Lưu lại lên localStrorage
        saveRatio(ratio);
      }
    });
  }
}

addListener4RatioButton();

// CHỨC NĂNG: CHỌN BACKGROUND
// Hàm hiển thị bộ chọn theo loại color / image
function addListener4BackgroundType() {
  const typeButtons = document.querySelectorAll(".bg-type-btn");
  const colorPanel = document.querySelector(".bg-color-panel");
  const imagePanel = document.querySelector(".bg-image-panel");

  typeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      typeButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const type = this.dataset.type;
      if (type === "color") {
        colorPanel.classList.remove("d-none");
        imagePanel.classList.add("d-none");
      } else {
        colorPanel.classList.add("d-none");
        imagePanel.classList.remove("d-none");
      }
    });
  });
}
addListener4BackgroundType();

// Hàm lưu lại lựa chọn màu
function saveBackground(type, value) {
  const card = JSON.parse(localStorage.getItem("card")) || {};
  card.background = {
    type: type,
    value: value,
  };
  localStorage.setItem("card", JSON.stringify(card));
}

// Hàm gắn sự kiện click cho các ô màu
function addListener4BackgroundColor() {
  const circles = document.querySelectorAll(".color-circle");
  const colorInput = document.getElementById("custom-color-input");
  const canvas = document.querySelector(".card-canvas");

  circles.forEach((circle) => {
    circle.addEventListener("click", function () {
      const color = this.dataset.color;
      if (!color) return;
      setActive4ColorCircle(color);
      canvas.style.background = color;
      saveBackground("color", color);
    });
  });

  if (colorInput) {
    colorInput.addEventListener("input", function () {
      const color = this.value;
      canvas.style.background = color;
      saveBackground("color", color);
      setActive4ColorInput();
    });
  }
}
addListener4BackgroundColor();

// Set active cho ô màu
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

// Hàm load card từ localStrorage
function loadCard() {
  const card = JSON.parse(localStorage.getItem("card"));
  if (!card) return;

  const canvas = document.querySelector(".card-canvas");
  const selector = document.querySelector(".ratio-selector");

  // LOAD RATIO
  if (card.ratio) {
    canvas.style.aspectRatio = card.ratio;
    selector.classList.add("d-none");
    canvas.classList.remove("d-none");
  }

  // LOAD BACKGROUND
  if (card.background) {
    if (card.background.type === "color") {
      canvas.style.background = card.background.value;
    }
    if (card.background.type === "image") {
      canvas.style.background = `url("${card.background.value}") center/cover no-repeat`;
    }
  }

  // LOAD TEXT
  if (card.texts) {
    card.texts.forEach((data) => {
      const text = document.createElement("div");
      text.className = "card-text";
      text.innerText = data.content;
      text.style.position = "absolute";
      text.style.left = data.x;
      text.style.top = data.y;
      text.style.fontSize = data.fontSize;
      text.style.color = data.color;
      text.style.fontFamily = data.fontFamily;
      text.style.textAlign = data.align;
      text.style.fontWeight = data.fontWeight || "normal";
      text.style.fontStyle = data.fontStyle || "normal";
      text.style.textDecoration = data.textDecoration || "none";
      text.style.cursor = "move";
      text.setAttribute("contenteditable", "false");
      canvas.appendChild(text);
      enableDrag(text);
      enableEdit(text);
    });
  }
}

function setActive4ColorCircle(color) {
  const circles = document.querySelectorAll(".color-circle");
  circles.forEach((circle) => {
    if (circle.dataset.color === color) {
      circle.classList.add("active");
    } else {
      circle.classList.remove("active");
    }
  });
}

function setActive4ColorInput() {
  const circles = document.querySelectorAll(".color-circle");
  const customCircle = document.querySelector(".custom-color-circle");

  circles.forEach((circle) => {
    circle.classList.remove("active");
  });

  if (customCircle) {
    customCircle.classList.add("active");
  }
}

addListener4BackgroundColor();

// Hàm gắn sự kiện cho Image URL
function addListener4BackgroundImageURL() {
  const btnApply = document.getElementById("btn-apply-bg-image");
  const input = document.getElementById("bg-image-url");
  const canvas = document.querySelector(".card-canvas");

  if (!btnApply) return;

  btnApply.addEventListener("click", function () {
    const url = input.value.trim();
    if (!url) return;

    canvas.style.background = `url("${url}") center/cover no-repeat`;

    saveBackground("image", url);
  });
}

addListener4BackgroundImageURL();

// Hàm gắn sự kiện cho chọn mẫu ảnh làm background
function addListener4BackgroundImageSample() {
  const images = document.querySelectorAll(".bg-sample-img");
  const canvas = document.querySelector(".card-canvas");
  images.forEach((img) => {
    img.addEventListener("click", function () {
      const url = this.src;
      canvas.style.background = `url("${url}") center/cover no-repeat`;
      saveBackground("image", url);
    });
  });
}

addListener4BackgroundImageSample();

// ======== CHỨC NĂNG THÊM TEXT VÀ CHỈNH SỬA TEXT ========

// Hàm gắn sự kiện click cho nút thêm văn bản
function addListener4AddText() {
  const btn = document.getElementById("btn-add-text");
  const canvas = document.querySelector(".card-canvas");
  const panel = document.querySelector(".text-control-panel");

  if (!btn) return;

  btn.addEventListener("click", function () {
    const text = document.createElement("div");

    text.classList.add("card-text");
    text.innerText = "Nhập văn bản";
    text.style.position = "absolute";
    const canvasRect = canvas.getBoundingClientRect();
    text.style.left = canvasRect.width / 2 - 50 + "px";
    text.style.top = canvasRect.height / 2 - 20 + "px";
    text.style.fontSize = "32px";
    text.style.color = "#000000";
    text.style.fontFamily = "Arial";
    text.style.cursor = "move";
    text.setAttribute("contenteditable", "false");
    canvas.appendChild(text);

    // hiện panel chỉnh sửa
    panel.classList.remove("d-none");

    // set text này là đang được chọn
    setActiveText(text);
    enableDrag(text);
    enableEdit(text);
    saveCard();
  });
}

addListener4AddText();

let activeText = null;

function setActiveText(element) {
  document
    .querySelectorAll(".card-text")
    .forEach((el) => el.classList.remove("active"));
  element.classList.add("active");
  activeText = element;

  const panel = document.querySelector(".text-control-panel");
  if (panel) panel.classList.remove("d-none");

  // Đồng bộ UI
  document.getElementById("text-content-input").value = element.innerText;

  const fontSize = parseInt(element.style.fontSize) || 32;
  document.getElementById("font-size-slider").value = fontSize;
  document.getElementById("font-size-label").innerText = fontSize;
  document.getElementById("text-color-input").value = rgbToHex(
    element.style.color,
  );

  // Cập nhật Font Dropdown
  const currentFontSpan = document.getElementById("current-font");
  if (currentFontSpan) {
    const fontValue = element.style.fontFamily
      .replace(/['"]/g, "")
      .split(",")[0];
    currentFontSpan.innerText = fontValue;
  }

  // Cập nhật Style & Align
  document.querySelectorAll(".text-style-btn").forEach((btn) => {
    const s = btn.dataset.style;
    if (s === "bold")
      btn.classList.toggle("active", element.style.fontWeight === "bold");
    if (s === "italic")
      btn.classList.toggle("active", element.style.fontStyle === "italic");
    if (s === "underline")
      btn.classList.toggle(
        "active",
        element.style.textDecoration.includes("underline"),
      );
  });

  document.querySelectorAll(".text-align-btn").forEach((btn) => {
    btn.classList.toggle(
      "active",
      element.style.textAlign === btn.dataset.align,
    );
  });

  const designToolPanel = document.querySelector(".design-tool-panel");
  const textSection = document.querySelector(".text-section");
  if (designToolPanel && textSection) {
    designToolPanel.scrollTo({
      top: textSection.offsetTop - 20,
      behavior: "smooth",
    });
  }
}

// Hàm gắn sự kiện chọn font
function addListener4FontSize() {
  const slider = document.getElementById("font-size-slider");
  const label = document.getElementById("font-size-label");
  if (!slider) return;

  slider.addEventListener("input", function () {
    const size = this.value;
    if (label) label.innerText = size;
    if (activeText) {
      activeText.style.fontSize = size + "px";
      saveCard();
    }
  });
}
addListener4FontSize();
// Hàm mở khóa kéo thả
function enableDrag(element) {
  const canvas = document.querySelector(".card-canvas");
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  element.addEventListener("mousedown", function (e) {
    e.preventDefault();
    setActiveText(element);
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    isDragging = true;
    element.style.transform = "none";
  });
  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    const canvasRect = canvas.getBoundingClientRect();
    let x = e.clientX - canvasRect.left - offsetX;
    let y = e.clientY - canvasRect.top - offsetY;
    // giới hạn trong canvas
    x = Math.max(0, Math.min(x, canvasRect.width - element.offsetWidth));
    y = Math.max(0, Math.min(y, canvasRect.height - element.offsetHeight));
    element.style.left = x + "px";
    element.style.top = y + "px";
  });
  document.addEventListener("mouseup", function () {
    if (!isDragging) return;
    isDragging = false;
    saveCard();
  });
}

// Hàm mở khóa edit text
function enableEdit(element) {
  element.addEventListener("dblclick", function (e) {
    element.setAttribute("contenteditable", "true");
    element.style.cursor = "text";

    element.focus();

    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false);

    sel.removeAllRanges();
    sel.addRange(range);

    e.stopPropagation();
  });

  document.addEventListener("click", function (e) {
    if (e.target !== element) {
      element.setAttribute("contenteditable", "false");
      element.style.cursor = "move";

      saveCard();
    }
  });
}

// Hàm gắn sự kiện nhập cho ô Content
function addListener4TextContent() {
  const input = document.getElementById("text-content-input");
  input.addEventListener("input", function () {
    if (!activeText) return;
    activeText.innerText = this.value;
    saveCard();
  });
}
addListener4TextContent();

// Hàm gắn sự kiện cho ô chọn font

// Hàm gắn sự kiện cho ô chọn màu
function addListener4TextColor() {
  const picker = document.getElementById("text-color-input");
  picker.addEventListener("input", function () {
    if (!activeText) return;
    activeText.style.color = this.value;
    saveCard();
  });
}
addListener4TextColor();

// Canvas clear cái khung
function enableCanvasClick() {
  const canvas = document.querySelector(".card-canvas");
  const panel = document.querySelector(".text-control-panel");

  canvas.addEventListener("click", function (e) {
    // Nếu click thẳng vào canvas (vùng trống)
    if (e.target === canvas) {
      document.querySelectorAll(".card-text").forEach((el) => {
        el.classList.remove("active");
        el.setAttribute("contenteditable", "false");
      });
      activeText = null;
      // ẨN PANEL ĐI
      if (panel) panel.classList.add("d-none");
    }
  });
}
enableCanvasClick();

// Hàm lưu card lên LocalStorage
function saveCard() {
  const card = JSON.parse(localStorage.getItem("card")) || {};
  const canvas = document.querySelector(".card-canvas");
  // SAVE TEXT
  const texts = canvas.querySelectorAll(".card-text");
  card.texts = [];

  texts.forEach((text) => {
    card.texts.push({
      content: text.innerText,
      x: text.style.left,
      y: text.style.top,
      fontSize: text.style.fontSize,
      color: text.style.color,
      fontFamily: text.style.fontFamily,
      align: text.style.textAlign || "left",
      fontWeight: text.style.fontWeight || "normal",
      fontStyle: text.style.fontStyle || "normal",
      textDecoration: text.style.textDecoration || "none",
    });
  });
  localStorage.setItem("card", JSON.stringify(card));
}

// Hàm chuyển rgb sang Hex
function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) return rgb;
  const result = rgb.match(/\d+/g);
  if (!result) return "#000000";
  return (
    "#" + result.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
  );
}

// Chức năng căn chỉnh text
function addListener4AlignButtons() {
  const buttons = document.querySelectorAll(".text-align-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!activeText) return;
      const align = this.dataset.align;
      activeText.style.textAlign = align;
      buttons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      saveCard();
    });
  });
}
addListener4AlignButtons();

// Chức năng xóa text bằng phím Delete hoặc Backspace
function enableDeleteText() {
  document.addEventListener("keydown", function (e) {
    // Nếu đang focus vào textarea hoặc input thì không xóa
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "Delete" && activeText) {
      activeText.remove();
      activeText = null;
      document.querySelector(".text-control-panel").classList.add("d-none");
      saveCard();
    }
  });
}
enableDeleteText();

// Gán sự kiện lắng nghe cho các nút chỉnh in đậm, in nghiêng ...
function addListener4TextStyleButtons() {
  const buttons = document.querySelectorAll(".text-style-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!activeText) return;
      const style = this.dataset.style;
      if (style === "bold") {
        activeText.style.fontWeight =
          activeText.style.fontWeight === "bold" ? "normal" : "bold";
      } else if (style === "italic") {
        activeText.style.fontStyle =
          activeText.style.fontStyle === "italic" ? "normal" : "italic";
      } else if (style === "underline") {
        activeText.style.textDecoration =
          activeText.style.textDecoration === "underline"
            ? "none"
            : "underline";
      }
      this.classList.toggle("active");
      saveCard();
    });
  });
}

addListener4TextStyleButtons();

// CẬP NHẬT DROPDOWN CHỌN FONT
function addListener4CustomFontDropdown() {
  const dropdown = document.getElementById("font-dropdown");
  const selected = dropdown.querySelector(".dropdown-selected");
  const listItems = dropdown.querySelectorAll(".dropdown-list li");
  const currentFontSpan = document.getElementById("current-font");

  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  listItems.forEach((item) => {
    item.addEventListener("click", function () {
      const fontValue = this.dataset.value;
      const fontText = this.innerText;

      currentFontSpan.innerText = fontText;
      dropdown.classList.remove("active");

      if (activeText) {
        activeText.style.fontFamily = fontValue;
        saveCard();
      }
    });
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("active");
  });
}

addListener4CustomFontDropdown();

// Hàm gắn sự kiện cho thanh kéo kích thước chữ
function addListener4FontSize() {
  const slider = document.getElementById("font-size-slider");
  const label = document.getElementById("font-size-label");
  if (!slider) return;
  slider.addEventListener("input", function () {
    const size = this.value;
    if (label) label.innerText = size;
    if (activeText) {
      activeText.style.fontSize = size + "px";
      saveCard();
    }
  });
}

addListener4FontSize();

// CÁC NÚT ĐÍNH KÈM VÀ XÓA THIẾT KẾ
//XỬ LÝ ĐÍNH KÈM VÀ CHUYỂN TRANG
function addListener4AddToCart() {
  const btnAdd = document.getElementById("btn-add-to-cart");
  const errorMsg = document.getElementById("card-error-msg");
  if (!btnAdd) return;
  btnAdd.addEventListener("click", function () {
    const cardData = JSON.parse(localStorage.getItem("card")) || {};
    // Kiểm tra đã chọn tỉ lệ và background chưa
    const hasRatio = cardData.ratio && cardData.ratio !== "";
    const hasBackground = cardData.background && cardData.background.value;
    if (!hasRatio || !hasBackground) {
      // Hiện dòng chữ đỏ nếu chưa hoàn thành
      if (errorMsg) {
        errorMsg.innerText =
          "Vui lòng hoàn thành thiết kế của bạn (Tỉ lệ & Màu nền)!";
        errorMsg.classList.remove("d-none");
      }
      return;
    }

    if (errorMsg) errorMsg.classList.add("d-none");
    cardData.price = 20000;
    cardData.isAttached = true;
    localStorage.setItem("card", JSON.stringify(cardData));
    window.location.href = "checkout.html";
  });
}

//XỬ LÝ XÓA THIẾT KẾ
function addListener4DeleteCard() {
  const btnDelete = document.getElementById("btn-delete-card");
  if (!btnDelete) return;

  btnDelete.addEventListener("click", function () {
    localStorage.setItem("delete_flag", "true");
    localStorage.removeItem("card");
    location.reload();
  });
}

// Gọi thực thi các hàm
addListener4AddToCart();
addListener4DeleteCard();
