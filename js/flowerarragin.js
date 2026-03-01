const fliterItem = document.querySelectorAll(".filter-box-item");
fliterItem[0].classList.add('seleted-filter-box')
const filterName = ['bouquet', 'flower', 'decorations']

let SelectedFlowerList = {}
const setSelectedList = (item, amountItem) => {
    const main = {
        ...SelectedFlowerList,
        [item.name]: {
            item,
            amountItem
        }
    }
    SelectedFlowerList = main
}

//filter selected
let itemSelected = filterName[0];

fliterItem.forEach((item, index) => {
    item.addEventListener('click', () => {
        fliterItem.forEach(it => it.classList.remove('seleted-filter-box'));
        item.classList.add('seleted-filter-box');
        renderListItem(filterName[index]);
        itemSelected = filterName[index];
    })
})

//get date
const getDataFlower = async () => {
    const data = await fetch('flower.json');
    const main = await data.json();
    console.log(main)
    return main
}

//
const ListItem = document.querySelector('.list-selection');
let handleIncrease;
let handleDescrease;
let currentData = [];

const itemFlower = (data, amount) => {
    let html = ''
    if (data) {
        html = data.map((item, index) => {
            return `
                <div class="itemFlower">
                    <div class="item-flower-img" style="background-image: url('${item.path}');"></div>
                    <div class="content-flower-item">
                        <span class="content-flower-name">${item.name}</span>
                        <span class="content-flower-price">
                            <span>Price: </span>
                            ${item.price} VND
                        </span>
                        <div class="button-flower-container">
                            <button onclick="handleDescrease(${index})" class="button-flower-item increase-btn">
                                -
                            </button>
                            <span class="amount-flower-item">${amount[index] || 0}</span>
                            <button onclick="handleIncrease(${index})" class="button-flower-item descrease-btn">
                                +
                            </button>
                        </div>
                    </div>
                </div>
            `
        }).join("");
    }
    return html
}

const renderBouquet = (data) => {
    let html = "";
    if (data) {
        html = data.map((item) => {
            return `
                <div class="itemFlower bouquet-item">
                    <div class="item-flower-img" style="background-image: url('${item.path}');"></div>
                    <div class="content-flower-item">
                        <span>${item.name}</span>
                        <span>${item.price}</span>
                    </div>
                </div>
            `
        }).join("");
    }
    return html;
}

//--------------
const amountFlo = [];
const amountDeco = [];

const renderListItem = async (selected) => {
    const data = await getDataFlower();

    //flowers
    if (selected === 'flower') {
        currentData = data.flower;
        ListItem.innerHTML = itemFlower(currentData, amountFlo);
        //--------
        const ListAmount = ListItem.querySelectorAll('.amount-flower-item');
        const ListAmountArr = Array.from(ListAmount);

        if (amountFlo.length < ListAmount.length) {
            ListAmount.forEach(() => {
                amountFlo.push(0);
            })
        }

        console.log(amountFlo)

        handleIncrease = (id) => {
            amountFlo[id]++;
            ListAmountArr[id].innerHTML = amountFlo[id];

            setSelectedList(currentData[id], amountFlo[id])
            console.log(SelectedFlowerList)

            priceContainerEle.innerHTML = renderPriceContainer()

            appendNode("flower", currentData[id], data, ListAmountArr, amountFlo);
        }

        handleDescrease = (id) => {
            if (amountFlo[id] > 0)
                amountFlo[id]--;
            else return;
            ListAmountArr[id].innerHTML = amountFlo[id];

            setSelectedList(currentData[id], amountFlo[id])
            if (amountFlo[id] == 0) {
                const temp = Object.fromEntries(Object.entries(SelectedFlowerList).filter(([key, value]) => {
                    return value.amountItem != 0;
                }))
                SelectedFlowerList = temp;
            }
            console.log(SelectedFlowerList)
            priceContainerEle.innerHTML = renderPriceContainer()

            deleteNode("flower", currentData[id].name, data, ListAmountArr, amountFlo);
        }
        //-----------

        // selected BOUQUET
    } else if (selected === 'bouquet') {
        ListItem.innerHTML = renderBouquet(data.bouquet);

        handleBoquetWorkSpace(data.bouquet);

        // decorations
    } else if (selected === 'decorations') {
        ListItem.innerHTML = itemFlower(data.decorations, amountDeco);
        //--------
        const ListAmount = ListItem.querySelectorAll('.amount-flower-item');
        const ListAmountArr = Array.from(ListAmount);

        if (amountDeco.length < ListAmount.length) {
            ListAmount.forEach(() => {
                amountDeco.push(0);
            })
        }

        console.log(amountDeco)

        handleIncrease = (id) => {
            amountDeco[id]++;
            ListAmountArr[id].innerHTML = amountDeco[id];

            setSelectedList(data.decorations[id], amountDeco[id])

            priceContainerEle.innerHTML = renderPriceContainer()

            appendNode("decorations", data.decorations[id], data, ListAmountArr, amountDeco);
        }

        handleDescrease = (id) => {
            if (amountDeco[id] > 0)
                amountDeco[id]--;
            else return;
            ListAmountArr[id].innerHTML = amountDeco[id];

            setSelectedList(data.decorations[id], amountDeco[id])
            if (amountDeco[id] == 0) {
                const temp = Object.fromEntries(Object.entries(SelectedFlowerList).filter(([key, value]) => {
                    return value.amountItem != 0;
                }))
                SelectedFlowerList = temp;
            }
            console.log(amountDeco)
            priceContainerEle.innerHTML = renderPriceContainer()

            deleteNode("decorations", DataStructure.decorations[id].name, data, ListAmountArr, amountDeco);
        }
    } else {
        ListItem.innerHTML = ""
    }
}

//init
renderListItem(filterName[0])

// button flower

const priceContainerEle = document.querySelector(".price-container")

const renderPriceContainer = () => {
    if (!priceContainerEle) return;

    let Total = 0;


    const html = Object.entries(SelectedFlowerList).map(([key, value]) => {
        Total += value.item.price * value.amountItem;
        return `
            ${value.amountItem !== 0 ? `<li class="item-price-selected">
                <span class="name-item">${key}</span>
                <span class="price-item">${value.amountItem !== 1 ? value.amountItem + " x" : ""} ${value.item.price}</span>
            </li>`: ""}
        `
    }).join("");

    const lengthList = Object.keys(SelectedFlowerList).length;
    const result_html = `
        ${lengthList !== 0 ? `<div class="price-total-container">
            <span class="amount-item-seleted">
                seleted item
                <p>${lengthList} items</p>
            </span>
            <span class="price-total-box">
                <span class="price-total">${Total} VND</span>
            </span>
        </div>
        
        <ul class="list-price">
            ${html}
        </ul>

        <button onclick="HandleSendDataLocal()" class="button-add-cart">
            Add to cart
        </button> ` : ""}
    `

    return result_html;
}

//handle Bouquet
const BouquetWSEle = document.querySelector(".bouquet-render")

const handleBoquetWorkSpace = (data) => {
    const BouquetItemEle = document.querySelectorAll(".bouquet-item")

    data.forEach((item, index) => {
        BouquetItemEle[index].addEventListener('click', () => {
            BouquetWSEle.style.backgroundImage = `url('${item.texture}')`;
            setSelectedList(item, 1);

            priceContainerEle.innerHTML = renderPriceContainer();
        })
    })

}

//Generate ID
const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}


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
    decorations: []
}

const WorkSpaceEle = document.querySelector(".canva");

let zindex = 0;

const appendNode = (type, itemObj, data, ListAmountArr, amount) => {
    const id = generateId();
    zindex++;
    DataStructure[type].push({
        id: id,
        path: itemObj.path,
        name: itemObj.name,
        state: {
            pos: {
                left: 10,
                top: 10
            },
            rotation: 0,
            zIndex: zindex
        }
    })


    WorkSpaceEle.innerHTML = renderNode();

    let NodeList = WorkSpaceEle.querySelectorAll(".node");

    //event
    SetEvent(type, NodeList, data, ListAmountArr, amount);
}

const SetEvent = (typeCurrent, NodeList, data, ListAmountArr, amount) => {

    Array.from(NodeList).forEach((item) => {

        //double click to delete
        item.addEventListener('dblclick', (event) => {
            const id = event.target.getAttribute("data");
            const type = event.target.getAttribute("type");
            const name = event.target.getAttribute("name");
            // console.log("hihi", SelectedFlowerList)

            const temp = DataStructure[type].filter((item) => {
                return item.id !== id;
            })
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
                if (itemSelected === "flower") list[index].innerHTML = kvalue = amountFlo[index]
            } else {
                amountDeco[index]--;
                DataStructure[type] = temp;

                SelectedFlowerList[name].amountItem = amountDeco[index];
                if (itemSelected === "decorations") { list[index].innerHTML = kvalue = amountDeco[index]; console.log(ListAmountArr[index]); }
            }



            if (SelectedFlowerList[name].amountItem === 0) {
                const temp = Object.fromEntries(Object.entries(SelectedFlowerList).filter(([key, value]) => {
                    return value.amountItem !== 0;
                }))
                SelectedFlowerList = temp;
            }

            priceContainerEle.innerHTML = renderPriceContainer();

            event.target.remove();
        })

        const id = item.getAttribute("data");
        const type = item.getAttribute("type");

        //draggable
        DraggableHanlde(item, id, type);

        //rotating
        const RotationArea = item.querySelector(".rotate-area");
        RotationNodeHandle(RotationArea, item, id, type);

        //menu
        HandMenuContext(item);
    })
}

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

    console.log("hahaha", SelectedFlowerList)


}

const renderNode = () => {
    const html = Object.entries(DataStructure).map(([key, value]) => {
        const html_child = value.map((item) => {
            return `
                <div class="node" data="${item.id}" type="${key}" name="${item.name}"
                    style="background-image: url(${item.path}); left: ${item.state.pos.left}px; top: ${item.state.pos.top}px; transform: rotate(${item.state.rotation}deg); z-index:${item.state.zIndex};" 
                >
                    <div class="rotate-area"></div>
                </div>
            `
        }).join("");
        return html_child
    }).join("");

    return html;
}

//render context menu
const renderMenu = () => {
    return `
        <div id="flip" class="menu-item">flip</div>
        <div id="sendbackward" class="menu-item">Send backward</div>
        <div id="sendforward" class="menu-item">Send forward</div>
        <div id="sendtoback" class="menu-item">Send to back</div>
        <div id="sendtofont" class="menu-item">Send to font</div>
    `
}

const contextMenuEle = document.querySelector(".menu-context")

const handleFip = (item) => {
    item.style.transform = "scaleX(-1)";
    contextMenuEle.innerHTML = ""
}

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
                type: type
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
}

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
                type: type
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
        allElements.forEach(item => {
            if (item.element.id !== currentElement.element.id && item.element.state.zIndex < currentElement.element.state.zIndex) {
                item.element.state.zIndex++;
            }
        });
        currentElement.element.state.zIndex = minZIndex - 1;
    } else if (typeName === "font") {
        // push it to the top
        allElements.forEach(item => {
            if (item.element.id !== currentElement.element.id && item.element.state.zIndex > currentElement.element.state.zIndex) {
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
}

WorkSpaceEle.addEventListener("mousedown", () => {
    contextMenuEle.innerHTML = "";
})
//menu context
const HandMenuContext = (itemHtml) => {

    itemHtml.addEventListener('contextmenu', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const rect = WorkSpaceEle.getBoundingClientRect()

        const left = event.clientX - rect.x
        const top = event.clientY - rect.y
        console.log(event.offsetX)

        contextMenuEle.style.left = left + 'px';
        contextMenuEle.style.top = top + 'px';
        contextMenuEle.innerHTML = renderMenu();

        const flip = contextMenuEle.querySelector("#flip");
        const sendbackward = contextMenuEle.querySelector("#sendbackward");
        const sendforward = contextMenuEle.querySelector("#sendforward");
        const sendtoback = contextMenuEle.querySelector("#sendtoback");
        const sendtofont = contextMenuEle.querySelector("#sendtofont");

        flip.addEventListener('click', () => handleFip(itemHtml));
        sendbackward.addEventListener('click', () => handleSend(itemHtml, "backward"));
        sendforward.addEventListener('click', () => handleSend(itemHtml, "forward"));
        sendtoback.addEventListener('click', () => handleSendUPD(itemHtml, "back"));
        sendtofont.addEventListener('click', () => handleSendUPD(itemHtml, "font"));
    })
}
//------------------


let isDragging = false;
let isRotating = false;
const DraggableHanlde = (itemHtml, id, type) => {

    itemHtml.addEventListener('mousedown', (e) => {
        if (!isRotating) {
            isDragging = true;
            offsetX = e.clientX - itemHtml.offsetLeft;
            offsetY = e.clientY - itemHtml.offsetTop;

            const handleSetPOs = (event) => {
                itemHtml.style.left = event.clientX - offsetX + 'px';
                itemHtml.style.top = event.clientY - offsetY + 'px';
            }

            const handleMouseUp = () => {

                for (let i = 0; i < DataStructure[type].length; i++) {
                    if (DataStructure[type][i].id === id) {
                        DataStructure[type][i].state.pos = { left: itemHtml.offsetLeft, top: itemHtml.offsetTop }
                    }
                }

                isDragging = false;
                document.removeEventListener('mousemove', handleSetPOs);
                document.removeEventListener('mouseup', handleMouseUp);
            }

            document.addEventListener("mousemove", handleSetPOs);
            document.addEventListener('mouseup', handleMouseUp);
        }
        e.preventDefault();
    });
}


const getAngle = (event, item) => {

    const rect = item.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    return Math.atan2(dy, dx) * (180 / Math.PI);

}

const RotationNodeHandle = (rotateArea, item, id, type) => {
    let initialAngle = 0;
    let currentAngle = 0;

    rotateArea.addEventListener('mousedown', (e) => {
        isRotating = true;

        initialAngle = getAngle(e, item);

        const handleSetRotate = (event) => {
            const angle = getAngle(event, item);

            currentAngle = angle - initialAngle;
            item.style.transform = `rotate(${currentAngle}deg)`;
        }

        const handleMouseUp = () => {
            isRotating = false;

            for (let i = 0; i < DataStructure[type].length; i++) {
                if (DataStructure[type][i].id === id) {
                    DataStructure[type][i].state.rotation = currentAngle;
                }
            }

            console.log(DataStructure);

            document.removeEventListener('mousemove', handleSetRotate);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        document.addEventListener('mousemove', handleSetRotate);
        document.addEventListener('mouseup', handleMouseUp);

        e.preventDefault();
    });
}

//handle reset- clear node
const ResetButtonEle = document.querySelector(".reset-button");

ResetButtonEle.addEventListener('click', () => {
    DataStructure.flower = [];
    DataStructure.decorations = [];
    SelectedFlowerList = {};

    priceContainerEle.innerHTML = "";

    WorkSpaceEle.innerHTML = "";
    BouquetWSEle.style.backgroundImage = `url('')`
    console.log("maihfewugwueygeyug")

    const ListAmount = ListItem.querySelectorAll('.amount-flower-item');
    if (ListAmount.length > 0) {
        ListAmount.forEach((item, index) => {
            if (item.textContent !== "0") {
                item.innerHTML = 0;
            }
        })
    }
    for (let i = 0; i < amountFlo.length; i++) {
        if (amountFlo[i] !== 0) {
            amountFlo[i] = 0;
        }
    }

    for (let i = 0; i < amountDeco.length; i++) {
        if (amountDeco[i] !== 0) {
            amountDeco[i] = 0;
        }
    }

})


const HandleSendDataLocal = () => {
    let total = 0;
    const outputList = Object.entries(SelectedFlowerList).map(([key, value]) => {
        total += value.item.price;
        return {
            name: value.item.name,
            price: value.item.price,
            amount: value.amountItem
        }
    })

    const output = {
        total,
        item: outputList
    }

    localStorage.setItem('pay_list', JSON.stringify(output));
}

