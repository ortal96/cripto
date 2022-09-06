
let divMain = document.querySelector(".main")
let divAbout;
const MINUTE = 1000 * 60;
let homeBtn = document.getElementById("home");
let aboutBtn = document.getElementById("about");
let divCard;
let arr = [];
let arrCards = [];
let li;
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", search)
homeBtn.addEventListener("click", home);
aboutBtn.addEventListener("click", about)

getCoine()

function search() {
    let find = arrCards.find(card => card == searchInput.value);
    console.log(find)
    if (!find) {

        alert("error")
    } else {
        let divOfSearch = document.querySelector(`#${searchInput.value}`).parentElement;
        let card = document.querySelectorAll(".card");
        for (let i = 0; i < card.length; i++) {
            card[i].style.display = "none"
        }

        divOfSearch.style.display = "block"
    }
}


function home() {

    let card = document.querySelectorAll(".card");
    for (let i = 0; i < card.length; i++) {
        card[i].style.display = "block"
    }

    divAbout.style.display = "none"
}

function about() {

    let card = document.querySelectorAll(".card");
    for (let i = 0; i < card.length; i++) {
        card[i].style.display = "none"
    }

    divAbout = document.createElement("div");
    document.body.appendChild(divAbout)
    divAbout.setAttribute("class", "divAbout");
    let h2 = document.createElement("h2");
    h2.innerHTML = "ortal dayan";
    divAbout.appendChild(h2)
    let p1 = document.createElement("p");
    p1.innerHTML = "This project presents virtual currencies, you can select only five currencies, and you also have a search box to search for a specific currency.";
    divAbout.appendChild(p1);
    let p2 = document.createElement("p");
    p2.innerHTML = "Each tab has a button for more information where you can see the price of the currencies in dollars, shekels and euros.";
    divAbout.appendChild(p2);
    let img = document.createElement("img");
    img.src = "img/dolarImogi.jpg";
    divAbout.appendChild(img);

}


function getCoine() {
    let gif = document.createElement("img");
    gif.src = "img/mony.gif"
    gif.setAttribute("class", "gifDoc")
    document.body.appendChild(gif)
    fetch("https://api.coingecko.com/api/v3/coins")
        .then(res => res.json())
        .then(function (data) {
            for (let i = 0; i < 20; i++) {
                arrCards.push(data[i].symbol)
                console.log(arrCards);
                divCard = document.createElement("div")
                divCard.setAttribute("class", "card")
                divMain.appendChild(divCard);

                let h2Symbol = document.createElement("h2")
                h2Symbol.innerHTML = data[i].symbol;
                h2Symbol.setAttribute("id", data[i].symbol)
                divCard.appendChild(h2Symbol);

                let pName = document.createElement("p")
                pName.innerHTML = data[i].name;
                divCard.appendChild(pName)

                let idCoin = document.createElement("span");
                idCoin.innerHTML = data[i].id;
                divCard.appendChild(idCoin)

                let checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", h2Symbol.innerHTML);
                checkbox.addEventListener("click", toggleBtnCheck);
                divCard.appendChild(checkbox);

                let moreInfoBtn = document.createElement("button");
                moreInfoBtn.innerHTML = "more info";
                moreInfoBtn.setAttribute("class", "moreInfo btn btn-outline-secondary");
                moreInfoBtn.setAttribute("type", "button")
                divCard.appendChild(moreInfoBtn)

                moreInfoBtn.addEventListener("click", onClickMoreInfo);

            }
            document.body.removeChild(gif);
        })
}

function toggleBtnCheck(event) {
    checkboxInput = event.target;

    if (checkboxInput.checked == true) {
        if (arr.length < 5) {
            arr.push(checkboxInput.parentElement.querySelector("h2").innerHTML)
            console.log(arr);

        } else {
            checkboxInput.checked = false
            createModal(checkboxInput.className)
        }
    } else {

        const index = arr.findIndex(coin => coin === checkboxInput.parentElement.querySelector("h2").innerHTML);
        arr.splice(index, 1);
        console.log(arr);

    }
}

function createModal(checkboxInputClass) {

    let wraperModal = document.createElement("div")
    wraperModal.setAttribute("class", "wraperModal")
    document.body.appendChild(wraperModal);

    let divModal = document.createElement("div");
    divModal.setAttribute("class", "divModal")
    wraperModal.appendChild(divModal);

    let h2Modal = document.createElement("h4");
    h2Modal.innerHTML = "chose coin to remove:"
    divModal.appendChild(h2Modal);

    let ul = document.createElement("ul")
    divModal.appendChild(ul);

    let closeBtn = document.createElement("span");
    closeBtn.innerHTML = "X"
    closeBtn.setAttribute("class", "close");
    divModal.appendChild(closeBtn)

    closeBtn.onclick = function () {
        wraperModal.remove();
        console.log(checkboxInputClass)

        let checkboxOpenModal = document.querySelector(`.${checkboxInputClass}`)
        if (arr.length < 5) {
            checkboxOpenModal.checked = true;
            arr.push(checkboxOpenModal.parentElement.querySelector("h2").innerHTML)
        }
        console.log(arr);
    }

    for (let i = 0; i < arr.length; i++) {
        li = document.createElement("li");
        li.innerHTML = arr[i];
        ul.appendChild(li)
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("checked", "true");
        checkbox.setAttribute("id", arr[i]);
        checkbox.setAttribute("class", "inputModal");
        li.appendChild(checkbox)
        checkbox.addEventListener("click", (e) => updateCheckbox(e, checkboxInputClass))

    }

}

function updateCheckbox(event, checkboxInputClass) {

    console.log("works")
    let checkboxInDoc = document.querySelector(`.${event.target.id}`)
    checkboxInDoc.checked = false;

    const index = arr.findIndex(coin => coin === checkboxInDoc.parentElement.querySelector("h2").innerHTML);
    arr.splice(index, 1);
    console.log(arr);

    let elementRemove = document.querySelector(".divModal");
    let ilRemove = elementRemove.querySelector(`#${event.target.id}`).parentElement;
    ilRemove.remove();

    if (!arr.length) {

        wraperModal = document.querySelector(".wraperModal")
        wraperModal.remove();
        let checkboxOpenModal = document.querySelector(`.${checkboxInputClass}`)
        checkboxOpenModal.checked = true;
        arr.push(checkboxOpenModal.parentElement.querySelector("h2").innerHTML)
    }

}


function getCoinDataFromStorage(coinId) {

    const storageDataStr = localStorage.getItem(coinId);

    if (!storageDataStr) {
        return;
    }

    const storageData = JSON.parse(storageDataStr);

    if (new Date(storageData.date + (MINUTE * 2)).getTime() < Date.now()) {
        return;
    }

    return storageData;
}

async function getDateFromApi(coinId, event) {

    const gif = document.createElement("img");
    gif.src = "img/mony.gif";
    gif.setAttribute("class", "moreInfoGif")
    event.target.parentElement.appendChild(gif);

    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const data = await res.json();

    data.date = Date.now();

    localStorage.setItem(coinId, JSON.stringify(data));

    event.target.parentElement.removeChild(gif);
    return data;
}

function renderMoreInfo(data, event) {

    moreInfoDiv = document.createElement("div")
    moreInfoDiv.setAttribute("class", "moreInfoDiv")
    event.target.parentElement.appendChild(moreInfoDiv)

    let imgCoin = document.createElement("img");
    imgCoin.src = data.image.small;
    moreInfoDiv.appendChild(imgCoin);

    let pDolar = document.createElement("p");
    pDolar.innerHTML = data.market_data.current_price.usd + "$"
    moreInfoDiv.appendChild(pDolar)

    let pEur = document.createElement("p");
    pEur.innerHTML = data.market_data.current_price.eur + "‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏‏×"
    moreInfoDiv.appendChild(pEur)

    let pIls = document.createElement("p");
    pIls.innerHTML = data.market_data.current_price.ils + "₪"
    moreInfoDiv.appendChild(pIls)
}

async function onClickMoreInfo(event) {

    if (event.target.nextElementSibling) {
        event.target.nextElementSibling.remove();
        return;
    }

    const coinId = event.target.parentElement.querySelector("span").innerHTML;
    const data = getCoinDataFromStorage(coinId) || await getDateFromApi(coinId, event);

    renderMoreInfo(data, event);
}

