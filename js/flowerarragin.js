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
updateHeaderBadge();

const fliterItem = document.querySelectorAll(".filter-box-item");
fliterItem[1].classList.add("selected-filter-box");
const filterName = ["bouquet", "flower", "decorations"];

let SelectedFlowerList = {};
const setSelectedList = (item, amountItem) => {
  const name = item.type == "bouquet" ? item.type : item.name;
  const main = {
    ...SelectedFlowerList,
    [name]: {
      item,
      amountItem,
    },
  };
  SelectedFlowerList = main;
};

//filter selected
let itemSelected = filterName[1];

const filterItemSignELe = document.querySelectorAll(".filter-item-sign");

fliterItem.forEach((item, index) => {
  item.addEventListener("click", () => {
    fliterItem.forEach((it) => it.classList.remove("selected-filter-box"));
    filterItemSignELe.forEach((it) => it.classList.add("hidden"));
    item.classList.add("selected-filter-box");
    filterItemSignELe[index].classList.remove("hidden");
    renderListItem(filterName[index]);
    itemSelected = filterName[index];
  });
});

//get date
const getDataFlower = async () => {
  const data = await fetch("data/flower.json");
  const main = await data.json();
  return main;
};

//
const ListItem = document.querySelector(".list-selection");
let handleIncrease;
let handleDescrease;
let handleDeleteAll;
let currentData = [];

const itemFlower = (data, amount) => {
  let html = "";
  if (data) {
    html = data
      .map((item, index) => {
        const isSelected = amount[index] > 0;
        return `
                <div class="itemFlower ${isSelected ? "is-checked" : ""}" onclick="handleIncrease(${index})">
                    <div class="item-flower-img" style="background-image: url('${item.path}');"></div>
                    <div class="content-flower-item">
                        <span class="content-flower-name ellipsis">${item.name}</span>
                        <span class="content-flower-price">
                            <span>Giá: </span>
                            <span>${formatNumber(item.price)}</span>
                        </span>
                        <div class="action-button w-100" onclick="event.stopPropagation()">
                            <div class="quantity-control fancy-qty d-flex align-items-center">
                                <button onclick="handleDescrease(${index})" class="qty-btn btn-minus" type="button">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <input
                                    type="text"
                                    class="form-control text-center quantity-input amount-flower-item"
                                    value="${amount[index] || 0}"
                                    readonly
                                />
                                <button onclick="handleIncrease(${index})" class="qty-btn btn-plus" type="button">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            <div class="remove-btn">
                                <button onclick="handleDeleteAll(${index})" class="btn-remove">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }
  return html;
};

const renderBouquet = (data) => {
  let html = "";
  if (data) {
    html = data
      .map((item) => {
        return `
                <div class="itemFlower bouquet-item">
                    <div class="item-flower-img" style="background-image: url('${item.path}');"></div>
                    <div class="content-flower-item">
                        <span class="content-flower-name">${item.name}</span>
                        <span class="content-flower-price">
                            <span>Giá: </span>
                            <span>${formatNumber(item.price)}</span>
                        </span>
                        <div class="action-button w-100" onclick="event.stopPropagation()">
                            <div></div> <!-- Spacer -->
                            <div class="remove-btn">
                                <button onclick="deleteBouquet()" class="btn-remove">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }
  return html;
};

const deleteBouquet = () => {
  const BouquetWSEle = document.querySelector(".bouquet-render");
  BouquetWSEle.style.backgroundImage = `url('')`;

  const temp = Object.fromEntries(
    Object.entries(SelectedFlowerList).filter(([key, value]) => {
      return value.item.type != "bouquet";
    }),
  );
  SelectedFlowerList = temp;

  renderPriceContainer();
};

//--------------
const amountFlo = [];
const amountDeco = [];

const renderListItem = async (selected) => {
  const data = await getDataFlower();

  //flowers
  if (selected === "flower") {
    currentData = data.flower;
    ListItem.innerHTML = itemFlower(currentData, amountFlo);
    //--------
    const ListAmount = ListItem.querySelectorAll(".amount-flower-item");
    const ListAmountArr = Array.from(ListAmount);

    if (amountFlo.length < ListAmount.length) {
      ListAmount.forEach(() => {
        amountFlo.push(0);
      });
    }

    console.log(amountFlo);

    handleIncrease = (id) => {
      amountFlo[id]++;

      // Update amount
      ListAmountArr[id].value = amountFlo[id];
      // Update checked style
      const flowerItem = ListAmountArr[id].closest(".itemFlower");
      if (amountFlo[id] > 0) {
        flowerItem.classList.add("is-checked");
      }

      setSelectedList(currentData[id], amountFlo[id]);
      console.log(SelectedFlowerList);

      renderPriceContainer();

      appendNode("flower", currentData[id], data, ListAmountArr, amountFlo);
    };

    handleDescrease = (id) => {
      if (amountFlo[id] > 0) amountFlo[id]--;
      else return;
      ListAmountArr[id].value = amountFlo[id];

      const flowerItem = ListAmountArr[id].closest(".itemFlower");
      if (amountFlo[id] === 0) {
        flowerItem.classList.remove("is-checked");
      }

      setSelectedList(currentData[id], amountFlo[id]);
      if (amountFlo[id] == 0) {
        const temp = Object.fromEntries(
          Object.entries(SelectedFlowerList).filter(([key, value]) => {
            return value.amountItem != 0;
          }),
        );
        SelectedFlowerList = temp;
      }
      console.log(SelectedFlowerList);
      renderPriceContainer();

      deleteNode(
        "flower",
        currentData[id].name,
        data,
        ListAmountArr,
        amountFlo,
      );
    };

    handleDeleteAll = (id) => {
      if (amountFlo[id] === 0) return;
      amountFlo[id] = 0;
      ListAmountArr[id].value = amountFlo[id];

      const flowerItem = ListAmountArr[id].closest(".itemFlower");
      flowerItem.classList.remove("is-checked");

      setSelectedList(currentData[id], amountFlo[id]);
      const temp = Object.fromEntries(
        Object.entries(SelectedFlowerList).filter(([key, value]) => {
          return value.amountItem != 0;
        }),
      );
      SelectedFlowerList = temp;

      renderPriceContainer();
      const newarr = DataStructure["flower"].filter((item) => {
        return item.name != currentData[id].name;
      });
      DataStructure["flower"] = newarr;
      WorkSpaceEle.innerHTML = renderNode();
    };
    //-----------

    // selected BOUQUET
  } else if (selected === "bouquet") {
    ListItem.innerHTML = renderBouquet(data.bouquet);

    handleBoquetWorkSpace(data.bouquet);

    // decorations
  } else if (selected === "decorations") {
    ListItem.innerHTML = itemFlower(data.decorations, amountDeco);
    //--------
    const ListAmount = ListItem.querySelectorAll(".amount-flower-item");
    const ListAmountArr = Array.from(ListAmount);

    if (amountDeco.length < ListAmount.length) {
      ListAmount.forEach(() => {
        amountDeco.push(0);
      });
    }

    console.log(amountDeco);

    handleIncrease = (id) => {
      amountDeco[id]++;

      // Update amount
      ListAmountArr[id].value = amountDeco[id];
      // Update checked style
      const flowerItem = ListAmountArr[id].closest(".itemFlower");
      if (amountDeco[id] > 0) {
        flowerItem.classList.add("is-checked");
      }

      setSelectedList(data.decorations[id], amountDeco[id]);

      renderPriceContainer();

      appendNode(
        "decorations",
        data.decorations[id],
        data,
        ListAmountArr,
        amountDeco,
      );
    };

    handleDescrease = (id) => {
      if (amountDeco[id] > 0) amountDeco[id]--;
      else return;
      ListAmountArr[id].value = amountDeco[id];

      const flowerItem = ListAmountArr[id].closest(".itemFlower");
      if (amountDeco[id] === 0) {
        flowerItem.classList.remove("is-checked");
      }

      setSelectedList(data.decorations[id], amountDeco[id]);
      if (amountDeco[id] == 0) {
        const temp = Object.fromEntries(
          Object.entries(SelectedFlowerList).filter(([key, value]) => {
            return value.amountItem != 0;
          }),
        );
        SelectedFlowerList = temp;
      }
      console.log(amountDeco);
      renderPriceContainer();

      deleteNode(
        "decorations",
        data.decorations[id].name,
        data,
        ListAmountArr,
        amountDeco,
      );
    };

    handleDeleteAll = (id) => {
      if (amountDeco[id] === 0) return;
      amountDeco[id] = 0;
      ListAmountArr[id].value = amountDeco[id];

      const flowerItem = ListAmountArr[id].closest(".itemFlower");
      flowerItem.classList.remove("is-checked");

      setSelectedList(data.decorations[id], amountDeco[id]);
      const temp = Object.fromEntries(
        Object.entries(SelectedFlowerList).filter(([key, value]) => {
          return value.amountItem != 0;
        }),
      );
      SelectedFlowerList = temp;

      renderPriceContainer();
      const newarr = DataStructure["decorations"].filter((item) => {
        return item.name != data.decorations[id].name;
      });
      DataStructure["decorations"] = newarr;
      WorkSpaceEle.innerHTML = renderNode();
    };
  } else {
    ListItem.innerHTML = "";
  }
};

//init
renderListItem(filterName[1]);

// button flower

const priceContainerEles = document.querySelectorAll(".price-container");

const renderPriceContainer = () => {
  if (priceContainerEles.length === 0) return "";

  let Total = 0;

  const html = Object.entries(SelectedFlowerList)
    .map(([key, value]) => {
      Total += value.item.price * value.amountItem;
      return `
            ${
              value.amountItem !== 0
                ? `<li class="item-price-selected"> 
                <span class="name-item">${value.item.name}</span>
                <span class="price-item">${value.amountItem !== 1 ? value.amountItem + " x" : ""} ${formatNumber(value.item.price)}</span>
            </li>`
                : ""
            }
        `;
    })
    .join("");

  const lengthList = Object.keys(SelectedFlowerList).length;
  const result_html = `
        ${
          lengthList !== 0
            ? `<div class="summary-card">
            <div class="summary-header-box d-flex justify-content-between align-items-center">
                <div class="summary-title-col">
                    <h4>Tổng tiền: </h4>
                </div>
                <div class="summary-price-col">
                    <span class="summary-total-price">${formatNumber(Total)}</span>
                </div>
            </div>
            
            <hr class="summary-divider"/>
            
            <ul class="list-price">
                ${html}
            </ul>

            <button onclick="HandleSendDataLocal()" class="btn-checkout w-100 mt-3">
                Thêm vào giỏ hàng
            </button>
        </div>`
            : ""
        }
    `;

  // Update All Price Containers (Desktop & Mobile)
  priceContainerEles.forEach((ele) => {
    ele.innerHTML = result_html;
  });

  // Update Mobile Sticky Bar Total
  const mobileTotalEle = document.getElementById("mobile-total-amount");
  if (mobileTotalEle) {
    mobileTotalEle.textContent = Total.toLocaleString("en-US");
  }

  return result_html;
};

//handle Bouquet
const BouquetWSEle = document.querySelector(".bouquet-render");

const handleBoquetWorkSpace = (data) => {
  const BouquetItemEle = document.querySelectorAll(".bouquet-item");

  data.forEach((item, index) => {
    BouquetItemEle[index].addEventListener("click", () => {
      BouquetWSEle.style.backgroundImage = `url('${item.texture}')`;
      setSelectedList(item, 1);

      renderPriceContainer();
    });
  });
};

//Generate ID
const generateId = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const DataStructure = {
  flower: [
    // {
    //     id: "",
    //     path: "",
    //     name: "",
    //     state: {
    //         pos: {
    //             left: 0,
    //             top: 0
    //         },
    //         rotation: 0,
    //         zIndex: 0
    //     }
    // }
  ],
  decorations: [],
};

const getNextNodePos = () => {
  const nodeList = WorkSpaceEle.querySelectorAll(".node");
  const rectCanva = WorkSpaceEle.getBoundingClientRect();
  let result = {
    left: rectCanva.width / 2 - 100,
    top: rectCanva.height / 2 - 100,
  };

  if (nodeList.length > 0) {
    const rect = nodeList[nodeList.length - 1].getBoundingClientRect();
    const x = rectCanva.x;
    const y = rectCanva.y;
    result = {
      left: rect.x - rectCanva.x + rect.width / 2 - 25,
      top: rect.y - rectCanva.y,
    };
  }
  return result;
};
const WorkSpaceEle = document.querySelector(".canva");

let zindex = 0;

const appendNode = (type, itemObj, data, ListAmountArr, amount) => {
  const id = generateId();
  zindex++;
  const pos = getNextNodePos();
  DataStructure[type].push({
    id: id,
    path: itemObj.texture,
    name: itemObj.name,
    state: {
      pos: {
        left: pos.left,
        top: pos.top,
      },
      rotation: 0,
      zIndex: zindex,
    },
  });

  WorkSpaceEle.innerHTML = renderNode();

  let NodeList = WorkSpaceEle.querySelectorAll(".node");

  //event
  SetEvent(type, NodeList, data, ListAmountArr, amount);
};

const SetEvent = (typeCurrent, NodeList, data, ListAmountArr, amount) => {
  Array.from(NodeList).forEach((item) => {
    const deletenode = (event) => {
      const id = event.target.getAttribute("data");
      const type = event.target.getAttribute("type");
      const name = event.target.getAttribute("name");
      // console.log("hihi", SelectedFlowerList)

      const temp = DataStructure[type].filter((item) => {
        return item.id !== id;
      });
      let index = 0;
      for (let i = 0; i < data[type].length; i++) {
        if (name === data[type][i].name) {
          index = i;
          break;
        }
      }

      const list = ListItem.querySelectorAll(".amount-flower-item");

      let kvalue = 0;
      if (type === "flower") {
        amountFlo[index]--;

        DataStructure[type] = temp;

        SelectedFlowerList[name].amountItem = amountFlo[index];
        if (itemSelected === "flower")
          list[index].value = kvalue = amountFlo[index];
      } else {
        amountDeco[index]--;
        DataStructure[type] = temp;

        SelectedFlowerList[name].amountItem = amountDeco[index];
        if (itemSelected === "decorations") {
          list[index].value = kvalue = amountDeco[index];
          console.log(ListAmountArr[index]);
        }
      }

      if (SelectedFlowerList[name].amountItem === 0) {
        const temp = Object.fromEntries(
          Object.entries(SelectedFlowerList).filter(([key, value]) => {
            return value.amountItem !== 0;
          }),
        );
        SelectedFlowerList = temp;
      }

      renderPriceContainer();

      event.target.remove();
    };

    //double click to delete
    item.addEventListener("dblclick", deletenode);
    item.addEventListener("click", () => {
      item.classList.add("selected-node");
    });

    item.addEventListener("mouseout", () => {
      item.classList.remove("selected-node");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        const selectedNodes = document.querySelector(".selected-node");
        if (selectedNodes) {
          console.log(selectedNodes);
          const id = selectedNodes.getAttribute("data");
          const type = selectedNodes.getAttribute("type");
          const name = selectedNodes.getAttribute("name");
          // console.log("hihi", SelectedFlowerList)

          const temp = DataStructure[type].filter((item) => {
            return item.id !== id;
          });
          let index = 0;
          for (let i = 0; i < data[type].length; i++) {
            if (name === data[type][i].name) {
              index = i;
              break;
            }
          }

          const list = ListItem.querySelectorAll(".amount-flower-item");

          let kvalue = 0;
          if (type === "flower") {
            amountFlo[index]--;

            DataStructure[type] = temp;

            SelectedFlowerList[name].amountItem = amountFlo[index];
            if (itemSelected === "flower")
              list[index].value = kvalue = amountFlo[index];
          } else {
            amountDeco[index]--;
            DataStructure[type] = temp;

            SelectedFlowerList[name].amountItem = amountDeco[index];
            if (itemSelected === "decorations") {
              list[index].value = kvalue = amountDeco[index];
              console.log(ListAmountArr[index]);
            }
          }

          if (SelectedFlowerList[name].amountItem === 0) {
            const temp = Object.fromEntries(
              Object.entries(SelectedFlowerList).filter(([key, value]) => {
                return value.amountItem !== 0;
              }),
            );
            SelectedFlowerList = temp;
          }

          renderPriceContainer();

          selectedNodes.remove();
        }
      }
    });

    const id = item.getAttribute("data");
    const type = item.getAttribute("type");

    //draggable
    DraggableHanlde(item, id, type);

    //rotating
    const RotationArea = item.querySelector(".rotate-area");
    RotationNodeHandle(RotationArea, item, id, type);

    //menu
    HandMenuContext(item);
  });
};

//delete node-- press the descrease button
const deleteNode = (type, ItemName, data, ListAmountArr, amount) => {
  let index = 0;
  for (let i = DataStructure[type].length - 1; i >= 0; i--) {
    if (DataStructure[type][i].name === ItemName) {
      index = i;
      break;
    }
  }
  DataStructure[type].splice(index, 1);

  WorkSpaceEle.innerHTML = renderNode();

  let NodeList = WorkSpaceEle.querySelectorAll(".node");
  //event
  SetEvent(type, NodeList, data, ListAmountArr, amount);

  console.log("hahaha", SelectedFlowerList);
};

const renderNode = () => {
  const html = Object.entries(DataStructure)
    .map(([key, value]) => {
      const html_child = value
        .map((item) => {
          return `
                <div class="node" data="${item.id}" type="${key}" name="${item.name}"
                    style="background-image: url(${item.path}); left: ${item.state.pos.left}px; top: ${item.state.pos.top}px; transform: rotate(${item.state.rotation}deg); z-index:${item.state.zIndex};" 
                >
                    <div class="rotate-area">
                        <i class="rotate-icon bi bi-arrow-clockwise"></i>
                    </div>
                </div>
            `;
        })
        .join("");
      return html_child;
    })
    .join("");

  return html;
};

//render context menu
const renderMenu = () => {
  return `
        <div id="sendbackward" class="menu-item">Đưa ra sau 1 lớp</div>
        <div id="sendforward" class="menu-item">Đưa lên trước 1 lớp</div>
        <div id="sendtoback" class="menu-item">Đưa ra sau cùng</div>
        <div id="sendtofont" class="menu-item">Đưa lên trên cùng</div>
    `;
};

const contextMenuEle = document.querySelector(".menu-context");

const handleSend = (item, typeName) => {
  const id = item.getAttribute("data");
  const currentType = item.getAttribute("type");

  let allElements = [];
  let currentElement = null;
  let currentZIndex = 0;

  Object.entries(DataStructure).forEach(([type, items]) => {
    items.forEach((element) => {
      allElements.push({
        element: element,
        type: type,
      });
      if (element.id === id) {
        currentElement = { element: element, type: type };
        currentZIndex = element.state.zIndex;
      }
    });
  });

  if (!currentElement) {
    contextMenuEle.innerHTML = "";
    return;
  }

  // sort m
  allElements.sort((a, b) => a.element.state.zIndex - b.element.state.zIndex);

  let targetElement = null;

  if (typeName === "forward") {
    // finding nearest smaller zindex
    for (let item of allElements) {
      if (item.element.state.zIndex > currentZIndex) {
        targetElement = item;
        break;
      }
    }
  } else if (typeName === "backward") {
    // finding nearest bigger zindex
    for (let i = allElements.length - 1; i >= 0; i--) {
      if (allElements[i].element.state.zIndex < currentZIndex) {
        targetElement = allElements[i];
        break;
      }
    }
  }

  if (targetElement) {
    let temp = currentElement.element.state.zIndex;
    currentElement.element.state.zIndex = targetElement.element.state.zIndex;
    targetElement.element.state.zIndex = temp;

    WorkSpaceEle.innerHTML = renderNode();
    let NodeList = WorkSpaceEle.querySelectorAll(".node");
    SetEvent(currentType, NodeList, {}, [], []);
  }

  contextMenuEle.innerHTML = "";
};

const handleSendUPD = (item, typeName) => {
  const id = item.getAttribute("data");
  const currentType = item.getAttribute("type");

  //init
  let allElements = [];
  let currentElement = null;
  let maxZIndex = 0;
  let minZIndex = Infinity;

  Object.entries(DataStructure).forEach(([type, items]) => {
    items.forEach((element) => {
      allElements.push({
        element: element,
        type: type,
      });
      if (element.id === id) {
        currentElement = { element: element, type: type };
      }
      maxZIndex = Math.max(maxZIndex, element.state.zIndex);
      minZIndex = Math.min(minZIndex, element.state.zIndex);
    });
  });

  if (!currentElement) {
    contextMenuEle.innerHTML = "";
    return;
  }

  if (typeName === "back") {
    // push it in the back
    allElements.forEach((item) => {
      if (
        item.element.id !== currentElement.element.id &&
        item.element.state.zIndex < currentElement.element.state.zIndex
      ) {
        item.element.state.zIndex++;
      }
    });
    currentElement.element.state.zIndex = minZIndex - 1;
  } else if (typeName === "font") {
    // push it to the top
    allElements.forEach((item) => {
      if (
        item.element.id !== currentElement.element.id &&
        item.element.state.zIndex > currentElement.element.state.zIndex
      ) {
        item.element.state.zIndex--;
      }
    });
    currentElement.element.state.zIndex = maxZIndex + 1;
  }

  // Rerender canvas
  WorkSpaceEle.innerHTML = renderNode();
  let NodeList = WorkSpaceEle.querySelectorAll(".node");
  SetEvent(currentType, NodeList, {}, [], []);

  contextMenuEle.innerHTML = "";
};

WorkSpaceEle.addEventListener("mousedown", () => {
  contextMenuEle.innerHTML = "";
});
//menu context
const HandMenuContext = (itemHtml) => {
  itemHtml.addEventListener("contextmenu", (event) => {
    event.stopPropagation();
    event.preventDefault();
    const rect = WorkSpaceEle.getBoundingClientRect();

    const left = event.clientX - rect.x;
    const top = event.clientY - rect.y;
    console.log(event.offsetX);

    contextMenuEle.style.left = left + "px";
    contextMenuEle.style.top = top + "px";
    contextMenuEle.innerHTML = renderMenu();

    const sendbackward = contextMenuEle.querySelector("#sendbackward");
    const sendforward = contextMenuEle.querySelector("#sendforward");
    const sendtoback = contextMenuEle.querySelector("#sendtoback");
    const sendtofont = contextMenuEle.querySelector("#sendtofont");

    sendbackward.addEventListener("click", () =>
      handleSend(itemHtml, "backward"),
    );
    sendforward.addEventListener("click", () =>
      handleSend(itemHtml, "forward"),
    );
    sendtoback.addEventListener("click", () => handleSendUPD(itemHtml, "back"));
    sendtofont.addEventListener("click", () => handleSendUPD(itemHtml, "font"));
  });
};
//------------------

let isDragging = false;
let isRotating = false;
const DraggableHanlde = (itemHtml, id, type) => {
  itemHtml.addEventListener("mousedown", (e) => {
    if (!isRotating) {
      isDragging = true;
      offsetX = e.clientX - itemHtml.offsetLeft;
      offsetY = e.clientY - itemHtml.offsetTop;

      const handleSetPOs = (event) => {
        itemHtml.style.left = event.clientX - offsetX + "px";
        itemHtml.style.top = event.clientY - offsetY + "px";
      };

      const handleMouseUp = () => {
        for (let i = 0; i < DataStructure[type].length; i++) {
          if (DataStructure[type][i].id === id) {
            DataStructure[type][i].state.pos = {
              left: itemHtml.offsetLeft,
              top: itemHtml.offsetTop,
            };
          }
        }

        isDragging = false;
        document.removeEventListener("mousemove", handleSetPOs);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleSetPOs);
      document.addEventListener("mouseup", handleMouseUp);
    }
    e.preventDefault();
  });
};

const getAngle = (event, item) => {
  const rect = item.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;

  return Math.atan2(dy, dx) * (180 / Math.PI);
};

const RotationNodeHandle = (rotateArea, item, id, type) => {
  let initialAngle = 0;
  let currentAngle = 0;

  rotateArea.addEventListener("mousedown", (e) => {
    isRotating = true;

    initialAngle = getAngle(e, item);

    const handleSetRotate = (event) => {
      const angle = getAngle(event, item);

      currentAngle = angle - initialAngle;
      item.style.transform = `rotate(${currentAngle}deg)`;
    };

    const handleMouseUp = () => {
      isRotating = false;

      for (let i = 0; i < DataStructure[type].length; i++) {
        if (DataStructure[type][i].id === id) {
          DataStructure[type][i].state.rotation = currentAngle;
        }
      }

      console.log(DataStructure);

      document.removeEventListener("mousemove", handleSetRotate);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleSetRotate);
    document.addEventListener("mouseup", handleMouseUp);

    e.preventDefault();
  });
};

//handle reset- clear node
const ResetButtonEles = document.querySelectorAll(".reset-button");

ResetButtonEles.forEach((btn) => {
  btn.addEventListener("click", () => {
    DataStructure.flower = [];
    DataStructure.decorations = [];
    SelectedFlowerList = {};

    // Clear Price UI
    renderPriceContainer();

    // Reset Sidebar Amounts and Styles
    const ListAmount = ListItem.querySelectorAll(".amount-flower-item");
    if (ListAmount.length > 0) {
      ListAmount.forEach((item) => {
        item.value = 0; // It's an input field
      });
    }

    const FlowerItems = ListItem.querySelectorAll(".itemFlower");
    FlowerItems.forEach((item) => {
      item.classList.remove("is-checked");
    });

    amountFlo.fill(0);
    amountDeco.fill(0);

    // Clear Workspace
    WorkSpaceEle.innerHTML = "";
    BouquetWSEle.style.backgroundImage = `url('')`;

    console.log("Canvas has been reset");
  });
});

const HandleSendDataLocal = async () => {
  let total = 0;
  Object.entries(SelectedFlowerList).forEach(([key, value]) => {
    total += value.item.price * value.amountItem;
  });

  const Localdata = localStorage.getItem("shoppingCart");
  let data = JSON.parse(Localdata) || [];

  const captureNode = document.getElementById("capture");
  const scale = 0.3; // Thu nhỏ đi 3 lần để nhẹ bộ nhớ

  await domtoimage
    .toJpeg(captureNode, {
      quality: 0.5,
      width: captureNode.offsetWidth * scale,
      height: captureNode.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${captureNode.offsetWidth}px`,
        height: `${captureNode.offsetHeight}px`,
      },
    })
    .then(function (dataUrl) {
      // Tạo thẻ img và gán ảnh vừa chụp
      data = [
        ...data,
        {
          id: generateId(5), // Lưu ý: Nếu muốn có nhiều hoa tự thiết kế thì bạn nên dùng generateId() thay vì id: 3 cố định nhé
          name: "Your design",
          price: total,
          image: dataUrl,
          quantity: 1,
          checked: false,
        },
      ];
      console.log("Đã chụp và nén ảnh thành công!");
    })
    .catch(function (error) {
      console.error("Lỗi khi chụp ảnh:", error);
    });

  try {
    localStorage.setItem("shoppingCart", JSON.stringify(data));
    window.location.href = "cart.html";
  } catch (e) {
    console.error(
      "Lỗi khi lưu vào LocalStorage (có thể do ảnh vẫn quá lớn):",
      e,
    );
    alert(
      "Thiết kế của bạn quá phức tạp, không đủ bộ nhớ để lưu vào giỏ hàng!",
    );
  }
  window.location.href = "cart.html";
};

const formatNumber = (num) => {
  return num.toLocaleString("en-US") + '<sup class="price-currency">vnđ</sup>';
};

// Remove or fix broken price-app-btn logic if not needed
// const priceAppearanceBtnEle = document.querySelector(".price-app-btn");
// if(priceAppearanceBtnEle) { ... }

const page = document.querySelector(".arraging");
window.addEventListener("resize", () => {});
