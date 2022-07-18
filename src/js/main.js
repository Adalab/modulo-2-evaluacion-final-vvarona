'use strict';

const searchInput = document.querySelector('.js-search-input');
const searchButton = document.querySelector('.js-search-button');
const resetButton = document.querySelector('.js-reset-button');
const favListHTML = document.querySelector('.js-favorite-list');
const resultList = document.querySelector('.js-result-list');
const serverURL = 'https://api.jikan.moe/v4/anime?q=';
const formSearch = document.querySelector('.search');

const animeList = [];
const animeFavList= [];

function listenCard() {
  const liCard = document.querySelectorAll('.js-anime-card');
  for (const card of liCard) {
    card.addEventListener('click', ()=> console.log(`click`) );
  }
}

function getFromServer(userSearch) {
  fetch(serverURL + userSearch)
    .then((response) => response.json())
    .then((apiData) => {
      animeResultList = apiData.data;
      renderCard(animeResultList);
      console.log('funciona la api');
      console.log(animeResultList);
    }).catch(error => {
      console.error(error);
    });
}

function printInResultList(animeTitle, animePhoto) {
  resultList.innerHTML += `<li class="js-anime-card card">
      <img class="card-image" alt"Imagen de ${animeTitle}" title="Imagen de ${animeTitle}" src="${animePhoto}"/>
      <h3 class="card-title">${animeTitle}</h3>
    </li>`;
  listenCard();
}

function renderCard(animeDataList) {
  for (const anime of animeDataList) {
    let animeTitle = anime.title;
    let animePhoto = anime.images.jpg.image_url;
    printInResultList(animeTitle, animePhoto);
    
  }
}

function handleButton(event) {
  event.preventDefault();
  let userSearch = searchInput.value;
  let searchInServer = serverURL + userSearch;
  console.log(searchInServer);
  getFromServer(searchInServer);
}

function handleInput(event) {
  event.preventDefault();
  let userSearch = searchInput.value;
  let searchInServer = serverURL + userSearch;
  console.log(searchInServer);
  

}

function handleReset(event) {
  event.preventDefault();
  const reset = searchInput.value = '';
  let searchInServer = serverURL + reset;
  resultList.innerHTML = '';
  console.log(searchInServer);
}



let animeResultList = [];

searchInput.addEventListener('keyup', handleInput);
resetButton.addEventListener('click', handleReset);
formSearch.addEventListener('click', (event) => event.preventDefault);
searchButton.addEventListener('click', handleButton);



