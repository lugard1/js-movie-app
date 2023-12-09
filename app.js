// Your API_KEY should be defined in config.js

const input = document.querySelector('.search input');
const btn = document.querySelector('.search .btn');
const moviesGrid = document.querySelector('.favorites .movies-grid');

const popupContainer = document.querySelector('.popup-container');
const close = document.querySelector('.x-icon');

function addClickEffectToCard(cards) {
  cards.forEach(card => {
    card.addEventListener('click', () => showPopup(card));
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
    card.dataset.trailerKey = '';
    card.dataset.overview = movie.overview;

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

  const cards = document.querySelectorAll('.card');
  addClickEffectToCard(cards);
}

btn.addEventListener('click', () => searchMovies());

// Popup
async function searchMoviesById(id) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
  const movieDetails = await response.json();
  return movieDetails;
}

async function searchMoviesTrailer(id) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
  const resData = await response.json();

  if (resData.results.length > 0) {
    return resData.results[0].key;
  } else {
    return null;
  }
}

function showPopup(card) {
  const movieId = card.dataset.id;
  const imageURL = card.querySelector('.img img').src;

  searchMoviesById(movieId)
    .then(movieDetails => {
      if (!movieDetails || movieDetails.title === null || movieDetails.overview === null) {
        console.error('Error: Movie details not found or incomplete.');
        return Promise.reject('Movie details not found or incomplete.');
      }

      document.getElementById('popupPoster').src = imageURL;
      document.querySelector('.movie-title').textContent = movieDetails.title || 'Title not available';
      document.getElementById('popupLanguage').textContent = 'English'; // Replace with actual language data
      document.getElementById('popupLength').textContent = '120 minutes'; // Replace with actual length data
      document.getElementById('popupRate').textContent = `${movieDetails.vote_average}/10`;
      document.getElementById('popupBudget').textContent = `$1350000`; // Replace with actual budget data
      document.getElementById('popupReleaseDate').textContent = '05-07-2022'; // Replace with actual release date data

      // Genres
      const genresList = document.getElementById('popupGenres');
      genresList.innerHTML = '';
      movieDetails.genres.forEach(genre => {
        const li = document.createElement('li');
        li.textContent = genre.name;
        genresList.appendChild(li);
      });

      document.getElementById('popupOverview').textContent = movieDetails.overview || 'Overview not available';

      return searchMoviesTrailer(movieId);
    })
    .then(trailerKey => {
      const trailerIframe = document.querySelector('.trailer iframe');
      if (trailerKey) {
        trailerIframe.src = `https://www.youtube.com/embed/${trailerKey}`;
      } else {
        trailerIframe.src = '';
      }

      popupContainer.classList.add('show-popup');

   // Wait for the popup to be displayed before selecting the heart icon
   const heart_icon = document.querySelector('.popup-container.show-popup .favorite-heart-icon');
   heart_icon.addEventListener('click', () => {
     // Now we will check if the heart icon has the change-color class; if yes, remove it; if not, add it
     // But first, let's create that class in CSS
     console.log('clicked heart icon');
 
     if (heart_icon.classList.contains('change-color')) {
       heart_icon.classList.remove('change-color');
       heart_icon.classList.add('change-white-color');
      } else {
       heart_icon.classList.remove('change-white-color');
       heart_icon.classList.add('change-color');
      }
    });
    })
    .catch(error => {
      console.error('Error in showPopup:', error);
    });
}  

close.addEventListener('click', () => {
  popupContainer.classList.remove('show-popup');
});
