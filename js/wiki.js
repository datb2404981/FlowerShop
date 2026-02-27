const urlParams = new URLSearchParams(window.location.search);
const flower = urlParams.get('name');
fetch('wiki.json')
    .then(response => response.json())
    .then(data => {
        const flowerData = data.find(item => item.name.toLowerCase() === flower.toLowerCase().trim());
        if (flowerData) {
            document.title = flowerData.name;
            document.getElementById("ten-hoa").textContent = flowerData.name;
            document.getElementById("mo-ta1").textContent = flowerData.description[0];
            document.getElementById("mo-ta2").textContent = flowerData.description[1];
            document.getElementById("mo-ta3").textContent = flowerData.description[2];
            document.getElementById("img1").src = flowerData.img[0];
            document.getElementById("img2").src = flowerData.img[1];
            document.getElementById("img3").src = flowerData.img[2];
            console.log(flowerData);
        }
        else {
            document.getElementById("ten-hoa").textContent = "Không tìm thấy hoa";
        }
    })
        .catch(error => console.error("Lỗi tải file JSON:", error));
