const products = document.querySelector(".products");

const getData = async () => {

  const respone = await fetch("products.json"); //fetch là hàm yêu cầu trình duyệt đi đến đường dẫn để lấy data.
  const data = await respone.json();// đổi data về dạng json

  if (data) {
    products.innerHTML = data
      .map((item) => {
        //innerHTML là một hàm dùng để tiêm HTLM và một đối tượng. ' `${bien}`
        // dùng replace để thay đổi từ đường dẫn cũ "img" thành "assets/images/imgProduct/"
        return `
        <div class="card" style="width: 18rem;">
          <img src="${item.images[0]}" class="card-img-top" alt="Ảnh sản phẩm">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.description}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      `;
      })
      .join(""); // dùng này để gọp này lại thành một mảng và không bị dấu ","
  }
};

getData();