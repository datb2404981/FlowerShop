
// Biến lưu trữ dữ liệu để tránh fetch nhiều lần
let flowerCache = null;

// Hàm tải dữ liệu khi click
function loadFlowerData(name) {
    if (!flowerCache) {
        fetch("wiki.json")
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
    const bodyContent = document.querySelector(".modal-content");

    modal.style.display = "flex";
    spinner.style.display = "block";

    const flowerData = flowerCache.find(item => item.name.toLowerCase() === name.toLowerCase().trim());
    if (flowerData) {
        setTimeout(() => {
            spinner.style.display = "none";
        document.getElementById("ten-hoa").textContent = flowerData.name;
        document.getElementById("mo-ta1").textContent = flowerData.description[0];
        document.getElementById("mo-ta2").textContent = flowerData.description[1];
        document.getElementById("mo-ta3").textContent = flowerData.description[2];
        document.getElementById("img1").src = flowerData.img[0];
        document.getElementById("img2").src = flowerData.img[1];
        document.getElementById("img3").src = flowerData.img[2];
        console.log(flowerData);
        document.getElementById("flowerModal").style.display = "flex";

        const modalBody = document.querySelector(".modal-body");
        modalBody.style.animation = 'none';
        modalBody.offsetHeight; // Lệnh này giúp trình duyệt "refresh" lại animation
        modalBody.style.animation = null;
        document.getElementById("ten-hoa").textContent = flowerData.name;
        /* reset thang */
        const selectElement = document.getElementById("hoacuathang");
            if (selectElement) {
                selectElement.value = "0"; 
            }
        }, 500);

    }
}

function closeModal() {
    document.getElementById("flowerModal").style.display = "none";
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
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    (function frame() {
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 3 : 5;
      //bắn bên trái
        confetti({
            particleCount: particleCount,
            angle: 60,            // Góc bắn 60 độ
            spread: 55,           // Độ lan tỏa
            origin: { x: 0, y: 0.6 },
            shapes: ['circle'], 
            colors: ['#FF69B4', '#FFC0CB', '#FFFFFF'] 
        });
        //bắn bên phải
        confetti({
            particleCount: particleCount,
            angle: 120,           // Góc bắn 120 độ
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
    const tenHoa = thangToHoa[value]; // Lấy tên hoa từ object thangToHoa

    if (tenHoa) {
        chayHieuUngHoa(); // Chạy hiệu ứng
    
        if (!flowerCache) {
            fetch("wiki.json")
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
        alert("Vui lòng nhập một tháng hợp lệ (từ 1 đến 12)!");
    }
}
document.getElementById("hoacuathang").addEventListener("change", function(e) {
            timHoaTheoThang(e.target.value);
        });