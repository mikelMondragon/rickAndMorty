
const cardsContainer = document.querySelector("#cardsContainer");
const fragment = document.createDocumentFragment();







const apiCall = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}



const drawCardContainer = ({ results }) => {
    cardsContainer.innerHTML = "";
    results.forEach(element => {
        const image = document.createElement("IMG");
        image.src = element.image;
        fragment.append(image);
    });
    cardsContainer.append(fragment);
}


const init = async () => {
    const data = await apiCall("https://rickandmortyapi.com/api/character");
    drawCardContainer(data);
}


init();
