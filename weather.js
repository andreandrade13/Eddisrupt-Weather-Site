/* variable that points the location of selectors or group of selectors  */
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".list .cities");
const apiKey = "b1f7cd42e40efae1ab2b1e2d3dc5afc4"; 

form.addEventListener("submit", e => { // when submit, executes
  e.preventDefault(); // preventing the search of an empty space?
  let inputVal = input.value;

  //check if there's already a city, it will check on the list already created (html)
  const listItems = list.querySelectorAll(".list .city"); 
  const listItemsArray = Array.from(listItems); // static method that creates a copied array from listItems

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => { //filter(el) callback the 
      let content = "";
      //lisbon,pt
      if (inputVal.includes(",")) {
        //lisbon,ptttttt->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //lisbon
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well`;
      form.reset();
      input.focus();
      return;
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url) // 
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h3 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h3>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li); // include the box to the bullet list
    })
    .catch(() => { // promise -> returns if a city doesnt exist
      msg.textContent = "Please search for a valid city";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});