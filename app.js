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
  // console.log(resData);

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
    if (heart_icon.classList.contains('change-color')) {
      remove_LS(movieId);
      heart_icon.classList.remove('change-color');
      heart_icon.classList.add('change-white-color');
    } else {
      add_to_LS(movieId);
      heart_icon.classList.remove('change-white-color');
      heart_icon.classList.add('change-color');
    }
    fetch_favorite_movies();
  });
  
    })
    .catch(error => {
      console.error('Error in showPopup:', error);
    });
}  

close.addEventListener('click', () => {
  popupContainer.classList.remove('show-popup');
});

// Local Storage
function get_LS () {
  const movie_ids = JSON.parse(localStorage.getItem('movie-id'));
  return movie_ids === null ? [] : movie_ids
}
function add_to_LS (id) {
  const movie_ids = get_LS();
  localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
}
// function remove_LS(id) {
//   console.log('Removing movie with ID:', id);
//   const movie_ids = get_LS();
//   localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)));
//   console.log('Movies in localStorage after delete:', get_LS());
// }

function remove_LS(id) {
  if (!id) {
    console.warn('Invalid movie ID:', id);
    return;
  }

  const movie_ids = get_LS();
  const updated_movie_ids = movie_ids.filter(e => e !== id && e !== null);

  localStorage.setItem('movie-id', JSON.stringify(updated_movie_ids));
  console.log('Movies in localStorage after delete:', updated_movie_ids);
}



async function get_movie_by_id(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
  // console.log('Request URL:', url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // console.error('Error fetching movie details:', response.status);
      return null;
    }

    const movieDetails = await response.json();
    // console.log('Movie Details:', movieDetails);

    return movieDetails;
  } catch (error) {
    // console.error('Error fetching movie details:', error);
    return null;
  }
}

fetch_favorite_movies()

async function fetch_favorite_movies() {
  moviesGrid.innerHTML = '';
  const movies_LS = await get_LS();
  const movies = [];

  // Filter out null values from the movie IDs
  const validMovieIds = movies_LS.filter(movieId => movieId !== null);

  // Use a map function to ensure consecutive indices
  const validMovieIdsConsecutive = validMovieIds.map((_, index) => index);

  for (let i = 0; i < validMovieIdsConsecutive.length; i++) {
    const movieIndex = validMovieIdsConsecutive[i];
    const movie_id = validMovieIds[movieIndex];

    let movie = await get_movie_by_id(movie_id);

    // Only add the movie to the UI if it's successfully fetched
    if (movie) {
      add_favorites_to_dom_from_LS(movie);
      movies.push(movie);
    }
  }
}


function add_favorites_to_dom_from_LS(movie_data) {
  const listItem = document.createElement('li');
  listItem.classList.add('favorite-item');

  // Set the dataset.id to the movie id
  listItem.dataset.id = movie_data.id;

  listItem.innerHTML = `
    <div class="img">
      <img src="https://image.tmdb.org/t/p/w500${movie_data.poster_path}" style="width: 80%; height: 50%" alt="${movie_data.title}">
      <div class="info">
        <h2>${movie_data.title}</h2>
        <div class="single-info">
          <span>Rate:</span>
          <span>${movie_data.vote_average}/10</span>
        </div>
        <div class="single-info">
          <span>Release Date:</span>
          <span>${movie_data.release_date}</span>
        </div>
      </div>
    </div>
    <div class="overlay">
      <button class="delete-button">Delete</button>
    </div>
  `;

  moviesGrid.appendChild(listItem);

  const deleteButton = listItem.querySelector('.overlay .delete-button');
  deleteButton.addEventListener('click', () => {
    const movieId = listItem.dataset.id;
    handleDelete(movieId);
  });

  const favoriteItems = document.querySelectorAll('.favorite-item');
  addClickEffectToCard(favoriteItems);
}

function handleDelete(movieId) {
  // Remove the movie from localStorage
  remove_LS(movieId);

  // Verify if the movie was removed from localStorage
  console.log('Movies in localStorage after delete:', get_LS());

  // Refresh the favorites display
  fetch_favorite_movies();
}

