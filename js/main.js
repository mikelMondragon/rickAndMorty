//DOM elements
const cardsContainer = document.querySelector("#cardsContainer");
const nameFilter = document.querySelector("#nameFilter");
const nameFilterButton = document.querySelector("#nameFilterButton");
const statusFilter = document.querySelector("#statusFilter");
const speciesFilter = document.querySelector("#speciesFilter");
const typeFilter = document.querySelector("#typeFilter");
const genderFilter = document.querySelector("#genderFilter");

const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

const fragment = document.createDocumentFragment();

const URL_BASE = "https://rickandmortyapi.com/api/";

let next = "";
let prev = ""
let pages = 0;




document.addEventListener("click", (ev) => {
    if (ev.target.matches("#nameFilterButton")) {
        onFilterUpdate();
    }
    if (ev.target.matches("#firstButton") && prev) {
        const first = prev.replace(/(page=)(\d+)/, `$1${0}`);
        onPageChange(first)
    }
    if (ev.target.matches("#prevButton") && prev) {
        onPageChange(prev)
    }
    if (ev.target.matches("#nextButton") && next) {
        onPageChange(next)
    }
    if (ev.target.matches("#lastButton") && next) {
        const last = prev.replace(/(page=)(\d+)/, `$1${pages}`);
        console.log(last)
        onPageChange(last)
    }
})





/**
 * 
 * @param {*} url 
 * @returns 
 */
const apiCall = async (url) => {
    try {
        const response = await fetch(`${url}`);
        if (response) {
            const data = await response.json();
            if (data) {
                console.log(data)
                return data;
            } else {
                throw "Something go wrong gettin the data";
            }
        } else {
            throw "Something go wrong in the fetch";
        }
    } catch (error) {
        throw error;
    }
}


/**
 * 
 * @param {*} name 
 * @param {*} status 
 * @param {*} species 
 * @param {*} type 
 * @param {*} gender 
 * @returns 
 */
const characterFilterApiCall = async (name, status, species, type, gender) => {
    const queryParts = [];
    if (name) queryParts.push(`name=${name}`);
    if (status) queryParts.push(`status=${status}`);
    if (species) queryParts.push(`species=${species}`);
    if (type) queryParts.push(`type=${type}`);
    if (gender) queryParts.push(`gender=${gender}`);
    const url = `character?${queryParts.join("&")}`;
    return await apiCall(URL_BASE + url);
}

/**
 * 
 */
const onFilterUpdate = async () => {
    console.log("onfilterupdate")
    const name = nameFilter.value;
    const status = statusFilter.value;
    const species = speciesFilter.value;
    const type = typeFilter.value;
    const gender = genderFilter.value;
    try {
        const data = await characterFilterApiCall(name, status, species, type, gender);
        drawCardContainer(data);
        next = data.info.next;
        prev = data.info.prev;
        pages = data.info.pages;
    } catch (err) {
        cardsContainer.innerHTML = `<p>Erro: ${err}</p>`;
    }
}

/**
 * 
 * @param {*} url 
 */
const onPageChange = async (url) => {
    const data = await apiCall(url);
    next = data.info.next;
    prev = data.info.prev;
    pages = data.info.pages;
    drawCardContainer(data);
}


/**
 * 
 * @param {*} data 
 * @returns 
 */
const createCard = (data) => {
    const card = document.createElement("ARTICLE");
    const imageContainer = document.createElement("DIV");
    const image = document.createElement("IMG");
    const name = document.createElement("H3");
    const favoriteButton = document.createElement("BUTTON");
    card.classList.add("card");
    image.src = data.image;
    name.innerText = data.name;
    favoriteButton.innerText = "add favorite";
    imageContainer.append(image);
    card.append(imageContainer, name, favoriteButton);
    return card;
}


/**
 * 
 */
const drawCardContainer = ({ results = [] }) => {
    cardsContainer.innerHTML = "";
    results.forEach(element => {
        const newCard = createCard(element);
        fragment.append(newCard);
    });
    cardsContainer.append(fragment);
}



onFilterUpdate();
