//DOM elements
const characterFilters = document.querySelector("#characterFilters");
const locationsFilters = document.querySelector("#locationsFilters");
const episodesFilters = document.querySelector("#episodesFilters");

const cardsContainer = document.querySelector("#cardsContainer");

const nameFilter = document.querySelector("#nameFilter");
const nameFilterButton = document.querySelector("#nameFilterButton");
const statusFilter = document.querySelector("#statusFilter");
const speciesFilter = document.querySelector("#speciesFilter");
const typeFilter = document.querySelector("#typeFilter");
const genderFilter = document.querySelector("#genderFilter");

const fragment = document.createDocumentFragment();

const URL_BASE = "https://rickandmortyapi.com/api/";

let next = "";
let prev = "";
let pages = 0;




document.addEventListener("click", (ev) => {

    //Sections.
    if (ev.target.matches(".sectionButton")) {
        const type = ev.target.dataset.filterType;
        handleFilterSectionVisibility(type);
    }


    //Filters.
    if (ev.target.matches("#nameFilterButton")) {
        onFilterUpdate();
    }
    //Pagination.
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
        onPageChange(last)
    }
    //Favotires.
    if (ev.target.matches(".favoriteButton")) {
        const characterId = String(ev.target.parentNode.dataset.characterId);
        let savedCharacters = getElementFromLocalStorage("favoriteCharacters");
        if (!savedCharacters.includes(characterId)) {
            savedCharacters.push(characterId);
            ev.target.innerText = "delete favorite"
        } else {
            savedCharacters = savedCharacters.filter(element => element != characterId);
            ev.target.innerText = "add favorite"
        }
        setElementFromLocalStorage("favoriteCharacters", savedCharacters)
    }
    if (ev.target.matches("#showFavorites")) {
        showFavorites();
    }
})


const getElementFromLocalStorage = (name) => {
    return JSON.parse(localStorage.getItem(name)) || [];
}

const setElementFromLocalStorage = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data))
}

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
 * @param  {...any} ids 
 * @returns 
 */
const characterIdApiCall = async (...ids) => {
    const url = `character/${ids.join(",")}`;
    return await apiCall(URL_BASE + url);
}


const handleFilterSectionVisibility = (type) => {
    const filterSections = document.querySelectorAll(".filterSection");

    filterSections.forEach(element => {
        if (element.dataset.filterType == type) {
            element.classList.remove("hidden");
            element.classList.add("visible");
        } else {
            element.classList.remove("visible");
            element.classList.add("hidden");
        }
    })
}



/**
 * 
 */
const showFavorites = async () => {
    const ids = getElementFromLocalStorage("favoriteCharacters");
    const data = await characterIdApiCall(ids);
    drawCardContainer(data);
}

/**
 * 
 */
const onFilterUpdate = async () => {
    const name = nameFilter.value;
    const status = statusFilter.value;
    const species = speciesFilter.value;
    const type = typeFilter.value;
    const gender = genderFilter.value;
    try {
        const data = await characterFilterApiCall(name, status, species, type, gender);
        drawCardContainer(data.results);
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
    drawCardContainer(data.results);
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
    card.dataset.characterId = data.id;
    image.src = data.image;
    image.alt = data.name;
    name.innerText = data.name;
    favoriteButton.innerText = !getElementFromLocalStorage("favoriteCharacters").includes(String(data.id)) ? "add favorite" : "delete favorite";
    favoriteButton.classList.add("favoriteButton");
    imageContainer.append(image);
    card.append(imageContainer, name, favoriteButton);
    return card;
}


/**
 * 
 */
const drawCardContainer = (results) => {
    cardsContainer.innerHTML = "";
    results.forEach(element => {
        const newCard = createCard(element);
        fragment.append(newCard);
    });
    cardsContainer.append(fragment);
}



onFilterUpdate();
