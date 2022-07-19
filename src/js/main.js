'use strict';

const searchInput = document.querySelector('.js-search-input');
const searchButton = document.querySelector('.js-search-button');
const resetButton = document.querySelector('.js-reset-button');
const resetFavButton = document.querySelector('.js-fav-reset-button');
const favListHTML = document.querySelector('.js-favorite-list');
const resultList = document.querySelector('.js-result-list');
const serverURL = 'https://api.jikan.moe/v4/anime?q=';
const formSearch = document.querySelector('.search');
const errorMessage = document.querySelector('.js-message');



const serverInvalidImage = 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png';
const placeholderImage = 'https://via.placeholder.com/225x350/3D3D3D/666666/?text=No+image+:(';

let animeResultList = [];
const animeFavList = [];

function setFavoritesInLS(){
  localStorage.setItem('favorites', JSON.stringify(animeFavList));
}

function handleFavList(event) {
  const selectedAnimeID = parseInt(event.currentTarget.id);
  const foundAnime = animeResultList.find((anime)=> anime.mal_id === selectedAnimeID);
  const favFound = animeFavList.findIndex((favAnime) => favAnime.mal_id === selectedAnimeID);
  if (favFound === -1) {
    animeFavList.push(foundAnime);
  } else {
    animeFavList.splice(favFound, 1);
  }
}
function handleCardClick(event) {
  handleFavList(event);
  renderCard(animeResultList, resultList);
  renderCard(animeFavList, favListHTML);
  setFavoritesInLS();
}

function listenCard() {
  const liCard = document.querySelectorAll('.js-anime-card');
  for (const card of liCard) {
    card.addEventListener('click', handleCardClick);
  }
} 


function getFromServer(userSearch) {
  return fetch(serverURL + userSearch)
    .then((response) => response.json())
    .then((apiData) => {
      animeResultList = apiData.data;})
    .catch(error => {
      console.error(error);
    });
}

function renderFavoritesFromLS() {
  const favoritesFromLS = JSON.parse(localStorage.getItem('favorites'));
  if (favoritesFromLS){
    for (const anime of favoritesFromLS) {
      animeFavList.push(anime);
    }
    renderCard(animeFavList, favListHTML);
  }
}

function renderCard(list, htmlList) {
  emptyElement(htmlList);
  for (const anime of list) {
    let animeTitle = anime.title;
    let animePhoto = anime.images.jpg.image_url;
    let animeID = anime.mal_id;
    let classFav = '';
    const animeFavIndex = animeFavList.findIndex((favAnime) => favAnime.mal_id === animeID);

    if (animeFavIndex !== -1){
      classFav = 'fav';
    } else {
      classFav = '';
    }

    if(animePhoto === serverInvalidImage) {
      animePhoto = placeholderImage;
    }

    htmlList.innerHTML += `<li class="js-anime-card card ${classFav}" id="${animeID}">
      <img class="card-image" alt"Imagen de ${animeTitle}" title="Imagen de ${animeTitle}" src="${animePhoto}"/>
      <h3 class="card-title">${animeTitle}</h3>
    </li>`;

    listenCard();

  }
}

function handleButton(event) {
  event.preventDefault();
  const userSearch = searchInput.value;
  let searchInServer = serverURL + userSearch;
  if(searchInput.value === ''){
    errorMessage.innerHTML = 'Introduce una serie para poder buscar';
  } else {
    getFromServer(searchInServer)
      .then(()=>{renderCard(animeResultList, resultList);
      });}
}

function handleReset(event) {
  event.preventDefault();
  searchInput.value = '';
  emptyElement(resultList);
  emptyElement(errorMessage);
}

function emptyElement(element){
  element.innerHTML = '';
}

function handleFavReset(event) {
  event.preventDefault();
  const allInFavList = document.querySelectorAll('.fav');
  for (const anime of allInFavList) {
    anime.classList.remove('fav');
  }
  animeFavList.length = 0;
  emptyElement(favListHTML);
  setFavoritesInLS();
  renderCard(animeFavList, favListHTML);
}

renderFavoritesFromLS();

resetButton.addEventListener('click', handleReset);
formSearch.addEventListener('click', (event) => event.preventDefault);
searchInput.addEventListener('click', (event) => event.preventDefault);
searchButton.addEventListener('click', handleButton);
resetFavButton.addEventListener('click', handleFavReset);



