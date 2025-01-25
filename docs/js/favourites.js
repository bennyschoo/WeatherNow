var favourites = [];
let addToFavouritesButton = document.getElementById('add-favourite-btn');
let favouritesList = document.getElementById('favourites-list');
let cityTitle = document.querySelector("#city-title-container");
let favouritesImgButton = document.getElementById('favourites-img-button');

let observer = new MutationObserver(function() {
    for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].toLowerCase() == currentCity.toLowerCase()) {
            favouritesImgButton.src = './assets/img/white-check.png';
            return;
        }
    }
    favouritesImgButton.src = './assets/img/white-star.png';
});

observer.observe(cityTitle, {childList: true});

addToFavouritesButton.addEventListener('click', function() {
    let currentlyFavourite = false
    favouritesList.innerHTML = '';

    for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].toLowerCase() == currentCity.toLowerCase()) {
            currentlyFavourite = true;
            favourites.splice(i, 1);
            favouritesImgButton.src = './assets/img/white-star.png';
        }
    }
    if (!currentlyFavourite) {
        favourites.push(currentCity);
        favouritesImgButton.src = './assets/img/white-check.png';
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
    
});


