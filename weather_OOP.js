const form = document.querySelector(".top-banner form"); //return the first html element that matches top-banner & form
const input = document.querySelector(".top-banner input"); //return the first html element that matches top-banner & input
const msg = document.querySelector(".msg"); //return the first html element that matches msg
const list = document.querySelector(".cities"); //return the first html element that matches cities


let array = []; //Array to store the cities

class WeatherInfo { // template for creating objects (encapsulate data with code to work on that data)
  constructor(data, index = array.length - 1) {
    this.data = data;
    this.index = index;
  }

  cardMaker() {
    const { main, name, sys, weather } = this.data; 
    //main: info about the temperature;
    //name: city input;
    //sys: info about location
    //weather: info about the weather
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
    //icon returns the related icon within the weather (e.g. 801 = "Clouds")

    const li = document.createElement("li");
    li.classList.add("city"); //create the card with the city and the weather conditions
    //outuput is the structure of the card
    const output = `
      <div id="del${this.index}" data-index="${this.index}">X</div>
      <h2 data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
      </h2>
      <div>${Math.round(main.temp)}<sup>°C</sup></div>
      <figure>
          <img src="${icon}" alt="${weather[0].description}">
          <figcaption>${weather[0].description}</figcaption>
      </figure>
      `;
      //sup tag = superscript text
      //data-index: data attribute for search an object
    li.innerHTML = output; //inserts the outpput element
    list.appendChild(li); // append the li to the list
    const delBtn = document.querySelector(`#del${this.index}`); //matching id del
    delBtn.addEventListener("click", onDelete); //function type click an listener delete card
  }
}

class Api {
  fetch(inputVal) { //request to the server and load the information
    const apiKey = "e8c9e3bf970879716bf489660566ca43";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url) //promise
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404" || data.cod === "400") return;
        array.push(data);
        localStorage.setItem("data", JSON.stringify(array)); //convert a Javascript object to a JSON string
        const weatherinfo = new WeatherInfo(data);
        weatherinfo.cardMaker(); //creation of an card
      })
      .catch(() => { // returns a promise and deal with rejected cases only
        msg.textContent = "Please search for a valid city";
      });

    msg.textContent = "";
    form.reset();
    input.focus();
  }
}

const api = new Api();
form.addEventListener("submit", e => {
  e.preventDefault();
  const inputVal = input.value;
  api.fetch(inputVal);
});

function onDelete(e) { //function paramenter name whem the parameter is event
  const { index } = e.target.dataset;
  const newArray = array.filter((_, itemIndex) => index != itemIndex);
  document.createElement("li");
  const lis = document.querySelectorAll("li");
  lis.forEach((li) => li.remove());
  newArray.forEach((item, itemIndex) => {
    const weatherinfo = new WeatherInfo(item, index);
    weatherinfo.cardMaker();
  });
  array = newArray;
  localStorage.setItem("data", JSON.stringify(newArray));
}