var favourites = [];
let addToFavouritesButton = document.getElementById('add-favourite-btn');
let favouritesList = document.getElementById('favourites-list');
let cityTitle = document.querySelector("#city-title-container");
let favouritesImgButton = document.getElementById('favourites-img-button');

//learned about MutationObserver from a post on stackoverflow
//Post can be found here: https://stackoverflow.com/questions/36561100/addeventlistener-detect-changes-in-div-elements
let observer = new MutationObserver(updateButtonIcon);

observer.observe(cityTitle, {childList: true});


addToFavouritesButton.addEventListener('click', function() {
    let currentlyFavourite = false
    favouritesList.innerHTML = '';

    for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].toLowerCase() == currentCity.toLowerCase()) {
            currentlyFavourite = true;
            favourites.splice(i, 1);
            favouritesImgButton.src = './assets/white-star.png';
        }
    }
    if (!currentlyFavourite) {
        favourites.push(currentCity);
        favouritesImgButton.src = './assets/white-check.png';
    }
    if(favourites.length == 0){
        let li = document.createElement('li');
        li.textContent = 'No favourites';
        li.classList = "m-2";
        favouritesList.appendChild(li);
    }
    for (let i = 0; i < favourites.length; i++) {
        let li = document.createElement('li');
        li.textContent = favourites[i];
        li.classList = "dropdown-item";
        li.addEventListener("click", ()=>{
            updatePage(favourites[i]);
        });
        favouritesList.appendChild(li);
    }
    setLocalStorage();
});


function setLocalStorage() {
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

function getLocalStorage() {
    if (localStorage.getItem('favourites')) {
        favourites = JSON.parse(localStorage.getItem('favourites'));
    }
}

function updateButtonIcon(){
    for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].toLowerCase() == currentCity.toLowerCase()) {
            favouritesImgButton.src = './assets/white-check.png';
            return;
        }
    }
    favouritesImgButton.src = './assets/white-star.png';
}

function fillFavouritesList(){
    favouritesList.innerHTML = '';
    if(favourites.length == 0){
        let li = document.createElement('li');
        li.textContent = 'No favourites';
        li.classList = "m-2";
        favouritesList.appendChild(li);
    }
    for (let i = 0; i < favourites.length; i++) {
        let li = document.createElement('li');
        li.textContent = favourites[i];
        li.classList = "dropdown-item";
        li.addEventListener("click", ()=>{
            updatePage(favourites[i]);
        });
        favouritesList.appendChild(li);
    }
}

window.addEventListener('load', getLocalStorage);
window.addEventListener('load', () => {setTimeout(updateButtonIcon, 100)});
window.addEventListener('load', () => {setTimeout(fillFavouritesList, 100)});