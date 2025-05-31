//DOM elements
const cardsContainer = document.querySelector("#cardsContainer");
const nameFilter = document.querySelector("#nameFilter");
const nameFilterButton = document.querySelector("#nameFilterButton");
const statusFilter = document.querySelector("#statusFilter");
const speciesFilter = document.querySelector("#speciesFilter");
const typeFilter = document.querySelector("#typeFilter");
const genderFilter = document.querySelector("#genderFilter");

const fragment = document.createDocumentFragment();

const URL_BASE = "https://rickandmortyapi.com/api/";






document.addEventListener("click", (ev) => {
    if (ev.target.matches("#nameFilterButton")) {
        onFilterUpdate();
    }
})





/**
 * 
 * @param {*} url 
 * @returns 
 */
const apiCall = async (url) => {
    try {
        const response = await fetch(`${URL_BASE}${url}`);
        if (response) {
            const data = await response.json();
            if (data) {
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
    return await apiCall(url);
}


const onFilterUpdate = async () => {
    console.log("onfilterupdate")
    const name = nameFilter.value;
    const status = statusFilter.value;
    const species = speciesFilter.value;
    const type = typeFilter.value;
    const gender = genderFilter.value;
    try {
        const data = await characterFilterApiCall(name, status, species, type, gender);
        console.log(data)
        drawCardContainer(data);
    } catch (err) {
        cardsContainer.innerHTML = `<p>Erro: ${err}</p>`;
    }
}



/**
 * 
 * @param {*} data 
 * @returns 
 */
const createCard = (data) => {
    const image = document.createElement("IMG");
    image.src = data.image;
    return image;
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
