// const search_term = 'a1405ed4af4bc83f1e312cd53d0a8854';
// const api_key = 'a1405ed4af4bc83f1e312cd53d0a8854';

// API Read access token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQwNWVkNGFmNGJjODNmMWUzMTJjZDUzZDBhODg1NCIsInN1YiI6IjY1NDQyNzAzOGM3YjBmMDBhZDE3OWE4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BDOuAwY1V4m1RbE1kmJHU0u7hRQRYYrLgtIqzNJWs-w'

// grab different components sections

// const input = document.querySelector('.search input');
// const btn = document.querySelector('.search .btn');
// const main_grid_title = document.querySelector('movies-container favourites');
// const main_grid = document.querySelector('.favorites .movies-grid');

// btn.addEventListener('click', add_searched_movies_to_dom)

// async function get_movie_by_search () {
//   const response = await fetch(`https://api.themoviedb.org/3/movie/157336?api_key=${api_key}&append_to_response=videos,images`);
//   const resData = await response.json();
//   console.log(resData);

//   return resData;
// }

// get_movie_by_search ();

// get_movie_by_search(search_term);

// btn.addEventListener('click', add_searched_movies_to_dom);

// async function add_searched_movies_to_dom () {
//   const data = await get_movie_by_search(input.value);
//   console.log(data);

//   main_grid_title.innerText = `search Results...`
//   main_grid.innerHTML = data.map(e => {
//     return `<div class="card" data-id="${e.id}">
//     <div class="img">
//       <img src="${e.images.backdrops[0].file_path}" style="width: 80%; height:50%"  alt="">
//       <div class="info">
//         <h2>${e.original_title}</h2>
//         <div class="single-info">
//           <span>Rate:</span>
//           <span>${e.vote_average}</span>
//         </div>
//         <div class="single-info">
//           <span>Release Date:</span>
//           <span>${e.release_date}</span>
//         </div>
//       </div>
//     </div>
//   </div>`;
//   }).join('');
// }

// async function add_searched_movies_to_dom() {
//   const data = await get_movie_by_search(input.value);

//   if (Array.isArray(data)) {
//     main_grid_title.innerText = `Search Results...`;
//     main_grid.innerHTML = data.map(e => {
//       // your mapping logic here
//       return `<div class="card" data-id="${e.id}">
//     <div class="img">
//       <img src="${e.images.backdrops[0].file_path}" style="width: 80%; height:50%"  alt="">
//       <div class="info">
//         <h2>${e.original_title}</h2>
//         <div class="single-info">
//           <span>Rate:</span>
//           <span>${e.vote_average}</span>
//            </div>
//            <div class="single-info">
//            <span>Release Date:</span>
//           <span>${e.release_date}</span>
//         </div>
//       </div>
//     </div>
//   </div>`;
//     }).join('');
//   } else {
//     console.error('Data is not an array:', data);
//   }
// }

// async function add_searched_movies_to_dom() {
//   const data = await get_movie_by_search(input.value);

//   // Assuming genres is an array property in the returned data
//   const genresArray = data.genres;

//   if (Array.isArray(genresArray)) {
//     // main_grid_title.innerText = `Search Results...`;
//     main_grid.innerHTML = genresArray.map(genre => {
//       return `<div class="card" data-id="${data.id}">
//         <div class="img">
//           <img src="${data.backdrop_path}" style="width: 80%; height:50%" alt="">
//           <div class="info">
//             <h2>${data.original_title}</h2>
//             <div class="single-info">
//               <span>Genres:</span>
//               <span>${genre.name}</span>
//             </div>
//             <div class="single-info">
//               <span>Rate:</span>
//               <span>${data.vote_average}</span>
//             </div>
//             <div class="single-info">
//               <span>Release Date:</span>
//               <span>${data.release_date}</span>
//             </div>
//           </div>
//         </div>
//       </div>`;
//     }).join('');
//   } else {
//     console.error('Genres data is not an array:', genresArray);
//   }
// }
  
// add_searched_movies_to_dom ();

// const api_key = 'a1405ed4af4bc83f1e312cd53d0a8854';


const input = document.querySelector('.search input');
const btn = document.querySelector('.search .btn');
const moviesGrid = document.querySelector('.favorites .movies-grid');

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
}

btn.addEventListener('click', searchMovies);
