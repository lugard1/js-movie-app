const input = document.querySelector('.search input');
const btn = document.querySelector('.search .btn');
const moviesGrid = document.querySelector('.favorites .movies-grid');

const popup_container = document.querySelector('.popup-container');
const close = document.querySelector('.x-icon');


function add_click_effect_to_card(cards) {
  cards.forEach(card => {
    card.addEventListener('click', () => show_popup(card));
  });
}

// Search Movies
async function searchMovies() {
  const query = input.value;
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
  const resData = await response.json();
  console.log(resData);

  displayMovies(resData.results);
}

function displayMovies(movies) {
  moviesGrid.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = movie.id;
    // card.dataset.trailerKey = movie.trailerKey;
    // card.dataset.overview = movie.overview;

    card.innerHTML = `
      <div class="img">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" style="width: 80%; height:50%" alt="${movie.title}">
        <div class="info">
          <h2>${movie.title}</h2>
          <div class="single-info">
            <span>Rate:</span>
            <span>${movie.vote_average}/10</span>
          </div>
          <div class="single-info">
            <span>Release Date:</span>
            <span>${movie.release_date}</span>
          </div>
        </div>
      </div>
    `;

    moviesGrid.appendChild(card);
  });

  const cards = document.querySelectorAll('.card')
  add_click_effect_to_card(cards)
}

btn.addEventListener('click', searchMovies);

//Popup
async function searchMovies_by_id() {
  // const query = input.value;
  const response = await fetch(`https://api.themoviedb.org/3/search/movie/${id}?api_key=${API_KEY}`);
  const resData = await response.json();
  // console.log(resData);

  return resData;
}

searchMovies_by_id();

async function searchMovies_trailer(id) {
  // const query = input.value;
  const response = await fetch(`https://api.themoviedb.org/3/search/movie/${id}/videos?api_key=${API_KEY}`);
  const resData = await response.json();
  console.log(resData);

  // return resData.results;
}

searchMovies_trailer()

function show_popup(card) {
  const movieId = card.dataset.id;
  const imageURL = card.querySelector('.img img').src;
  const trailerKey = card.dataset.trailerKey;

  // Update the content of the popup with the relevant information
  popup_container.querySelector('.poster-img img').src = imageURL;
  popup_container.querySelector('.trailer iframe').src = `https://www.youtube.com/embed/${trailerKey}`;

  // Show the popup
  popup_container.classList.add('show-popup')
}

close.addEventListener('click', () => {
  // console.log('Close button clicked');
  popup_container.classList.remove('show-popup');
});
