let searchInput = document.getElementById("search-bar");
let searchSuggestions = document.getElementById("search-suggestions");

//Make sure the search suggestions stay under the search bar
function updatePosition(){
    let results = document.getElementById("search-suggestions");
    let searchBarBottom = document.getElementById("search-bar").getBoundingClientRect().bottom;
    results.style = `top:${searchBarBottom + 5}px;` + "display:block;";
}

//Get the names of all the cities
var cityNames=[];
for(let i=0; i<cities.length; i++){
    cityNames.push(cities[i].name);
}

//Update the search suggestions based on the search bar value
function updateResults(){
    let searchValue = document.getElementById("search-bar").value;
    let resultsList = document.getElementById("results-list");
    resultsList.innerHTML = "";

    for(let i=0; i<cityNames.length; i++){
        

        if(cityNames[i].toLowerCase().substring(0,searchValue.length) == searchValue.toLowerCase() ||searchValue == "" ){
            let result = document.createElement("li");
            result.innerHTML = cityNames[i];
            result.classList = "nav-item text-secondary ms-1 my-2 result-item";
            result.addEventListener("click", () => {
                document.getElementById("search-bar").value = cityNames[i];
                updatePage(cityNames[i]);
                searchSuggestions.style.display = "none";
            });
            resultsList.appendChild(result);
        }
    }

    if(resultsList.innerHTML == ""){
        let result = document.createElement("li");
        result.innerHTML = "No results";
        result.classList = "nav-item text-secondary ms-1 my-2";
        resultsList.appendChild(result);
    }
    updatePosition();
}

//appropriate event listeners for each function
searchInput.addEventListener("input", updateResults);
searchInput.addEventListener("focus", updateResults);
window.addEventListener("resize", updatePosition);
//delay is added to ensure the rest of the page loads before the position is updated
window.addEventListener("load", () => {setTimeout(updatePosition, 200);});

//Make sure the search suggestions stop displaying when not focused on the search bar
searchInput.addEventListener("focus", () => {
    searchSuggestions.style.display = "block";
});

searchInput.addEventListener("focusout", () => {
    setTimeout(() => {
        searchSuggestions.style.display = "none";
    }, 100);
});

//when submitted, update the page and clear the search bar
document.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let results = document.getElementById("results-list").children;

    if(results[0] != undefined && results[0].innerHTML != "No results"){
        updatePage(results[0].innerHTML);
        searchInput.value = "";
        searchSuggestions.style.display = "none";
    }
});
