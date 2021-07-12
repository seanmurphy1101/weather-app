import {key} from '/apiKey.js';
let container = document.getElementById("container");
let city = document.getElementById("city");
let search = document.getElementById("search");
let errorAlert = document.getElementById("error");
let isFarenheit = true;
let curTemp;
let curRealFeel;


search.addEventListener('click', accessAPI);
async function accessAPI(){
    let input = city.value;
    let result = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=${key()}`, {mode: 'cors'})
    result.then(response => response.json()).then(data => {
        console.log(data);
        if (data.cod==="404"){
            errorAlert.innerHTML = "City Not Found";
        }
        else if (data.cod==="400"){
            errorAlert.innerHTML = "Please enter a City";
        }
        else {
            errorAlert.innerHTML = "";
            appendWeatherData(data);
        }
    }).catch(error => {
        console.log(error);
    });
}

function appendWeatherData(json){
    clearContainer();

    let place = document.createElement("div");
    place.id = "place";
    place.innerHTML = `${json.name.toUpperCase()}, ${json.sys.country}`;
    container.appendChild(place);

    let description = document.createElement("div");
    description.id = "description";
    description.innerHTML = json.weather[0].description;
    container.appendChild(description);

    let temp = document.createElement("div");
    temp.id = "temp";
    curTemp = {f: json.main.temp, c: convert(json.main.temp)};
    temp.innerHTML = isFarenheit ? `${curTemp.f}\u00B0` : `${curTemp.c}\u00B0`;
    container.appendChild(temp);
    
    let realFeel = document.createElement("div");
    realFeel.id = "realFeel";
    realFeel.classList.add("minorStats")
    curRealFeel = {f: json.main.feels_like, c: convert(json.main.feels_like)}
    realFeel.innerHTML = isFarenheit ? `feels like:  ${curRealFeel.f}\u00B0` : `feels like:  ${curRealFeel.c}\u00B0`;

    let tempButton = document.createElement("button");
    tempButton.id = "tempButton";
    tempButton.innerHTML = isFarenheit ? '\u00B0F' : '\u00B0C';
    tempButton.addEventListener('click', () => {
        temp.innerHTML = isFarenheit ? `${curTemp.c}\u00B0` : `${curTemp.f}\u00B0`;
        realFeel.innerHTML = isFarenheit ? `feels like:  ${curRealFeel.c}\u00B0` : `feels like:  ${curRealFeel.f}\u00B0`;
        toggleTemp(tempButton, temp);
        isFarenheit = !isFarenheit;
    });
    container.appendChild(tempButton);

    let divider = document.createElement("div");
    divider.innerHTML = "______________________________________";
    container.appendChild(divider);

    container.appendChild(realFeel);

    let wind = document.createElement("div");
    wind.id = "wind";
    wind.classList.add("minorStats");
    wind.innerHTML = `wind speed:  ${json.wind.speed} mph`;
    container.appendChild(wind);

    let humidity = document.createElement("div");
    humidity.id = "humidity";
    humidity.classList.add("minorStats");
    humidity.innerHTML = `humidity:  ${json.main.humidity}%`;
    container.appendChild(humidity);

}

function clearContainer(){
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function convert(temp){
    return ((temp - 32) * 5 / 9).toFixed(2);
}

function toggleTemp(button){
    button.innerHTML = isFarenheit ? '\u00B0C' : '\u00B0F';
}