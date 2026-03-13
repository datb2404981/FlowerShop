// Logic for tungloaihoa.html (Deep linking via URL params)
const urlParams = new URLSearchParams(window.location.search);
const flower = urlParams.get("name");

if (flower) {
  fetch("data/wiki.json")
    .then((response) => response.json())
    .then((data) => {
      const flowerData = data.find(
        (item) => item.name.toLowerCase() === flower.toLowerCase().trim(),
      );
      if (flowerData) {
        document.title = flowerData.name;
        // Check if elements exist before setting (since this script is shared)
        const tenHoa = document.getElementById("ten-hoa");
        if (tenHoa) tenHoa.textContent = flowerData.name;
        
        const moTa1 = document.getElementById("mo-ta1");
        if (moTa1) moTa1.textContent = flowerData.description[0];
        
        const moTa2 = document.getElementById("mo-ta2");
        if (moTa2) moTa2.textContent = flowerData.description[1];
        
        const moTa3 = document.getElementById("mo-ta3");
        if (moTa3) moTa3.textContent = flowerData.description[2];
        
        const img1 = document.getElementById("img1");
        if (img1) img1.src = flowerData.img[0];
        
        const img2 = document.getElementById("img2");
        if (img2) img2.src = flowerData.img[1];
        
        const img3 = document.getElementById("img3");
        if (img3) img3.src = flowerData.img[2];
        
        console.log("Loaded flower details for page:", flowerData.name);
      }
    })
    .catch(err => console.error("Error loading flower data for page:", err));
}

// Biến lưu trữ dữ liệu để tránh fetch nhiều lần cho Modal
let flowerCache = null;

// Hàm tải dữ liệu khi click (Dành cho Modal trên wiki.html)
function loadFlowerData(name) {
    if (!flowerCache) {
        fetch("data/wiki.json")
            .then(res => res.json())
            .then(data => {
                flowerCache = data;
                displayFlower(name);
            });
    } else {
        displayFlower(name);
    }
}

function displayFlower(name) {
    const modal = document.getElementById("flowerModal");
    const spinner = document.getElementById("loading-spinner");

    if (!modal) return;

    modal.style.display = "flex";
    if (spinner) spinner.style.display = "block";

    const flowerData = flowerCache.find(item => item.name.toLowerCase() === name.toLowerCase().trim());
    if (flowerData) {
        setTimeout(() => {
            if (spinner) spinner.style.display = "none";
            
            document.getElementById("ten-hoa").textContent = flowerData.name;
            document.getElementById("mo-ta1").textContent = flowerData.description[0];
            document.getElementById("mo-ta2").textContent = flowerData.description[1];
            document.getElementById("mo-ta3").textContent = flowerData.description[2];
            document.getElementById("img1").src = flowerData.img[0];
            document.getElementById("img2").src = flowerData.img[1];
            document.getElementById("img3").src = flowerData.img[2];
            
            console.log("Displayed in modal:", flowerData.name);

            const modalBody = document.querySelector(".modal-body");
            if (modalBody) {
                modalBody.style.animation = 'none';
                modalBody.offsetHeight; // Force reflow
                modalBody.style.animation = null;
            }

            /* reset thang */
            const selectElement = document.getElementById("hoacuathang");
            if (selectElement) {
                selectElement.value = "0"; 
            }
        }, 500);
    }
}

function closeModal() {
    const modal = document.getElementById("flowerModal");
    if (modal) modal.style.display = "none";
}

const thangToHoa = {
    "1": "Hoa Cát Tường",
    "2": "Hoa Linh Lan",
    "3": "Hoa Tulip",
    "4": "Hoa Hướng Dương",
    "5": "Hoa Lily",
    "6": "Hoa Sen",
    "7": "Hoa Cẩm Chướng",
    "8": "Hoa Cúc Họa Mi",
    "9": "Hoa Thạch Thảo",
    "10": "Hoa Hồng Trắng",
    "11": "Hoa Mẫu Đơn",
    "12": "Hoa Đinh Hương"
};

function chayHieuUngHoa() {
    if (typeof confetti !== "function") return;
    
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    (function frame() {
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 3 : 5;
        // Bắn bên trái
        confetti({
            particleCount: particleCount,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            shapes: ['circle'], 
            colors: ['#FF69B4', '#FFC0CB', '#FFFFFF'] 
        });
        // Bắn bên phải
        confetti({
            particleCount: particleCount,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            shapes: ['circle'], 
            colors: ['#FF69B4', '#FFC0CB', '#FFFFFF'] 
        });
        
        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    }());
}

function timHoaTheoThang(value) {
    const tenHoa = thangToHoa[value]; 

    if (tenHoa) {
        chayHieuUngHoa(); // Chạy hiệu ứng
    
        if (!flowerCache) {
            fetch("data/wiki.json")
                .then(res => res.json())
                .then(data => {
                    flowerCache = data;
                    setTimeout(() => {
                        displayFlower(tenHoa);
                    }, 2000);
                });
        } else {
            setTimeout(() =>{
                 displayFlower(tenHoa);
            }, 2000);
        }
    } else {
        alert("Vui lòng chọn một tháng hợp lệ!");
    }
}

// Event listener for birthday search
const searchSelect = document.getElementById("hoacuathang");
if (searchSelect) {
    searchSelect.addEventListener("change", function(e) {
        timHoaTheoThang(e.target.value);
    });
}