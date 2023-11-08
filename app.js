// const search_term = 'a1405ed4af4bc83f1e312cd53d0a8854';
const api_key = 'a1405ed4af4bc83f1e312cd53d0a8854';

// API Read access token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTQwNWVkNGFmNGJjODNmMWUzMTJjZDUzZDBhODg1NCIsInN1YiI6IjY1NDQyNzAzOGM3YjBmMDBhZDE3OWE4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BDOuAwY1V4m1RbE1kmJHU0u7hRQRYYrLgtIqzNJWs-w'

// grab different components sections

const input = document.querySelector('.search input');
const btn = document.querySelector('.search button');
const main_grid_title = document.querySelector('.favorites h1');
const main_grid = document.querySelector('.favorites .movies-grid');

// btn.addEventListener('click', add_searched_movies_to_dom)

async function get_movie_by_search (search_term) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/157336?api_key=${api_key}&append_to_response=videos,images`);
  const resData = await response.json();
  return resData;
}

console.log(resData);

// get_movie_by_search(search_term);

btn.addEventListener('click', add_searched_movies_to_dom);

async function add_searched_movies_to_dom () {
  const data = await get_movie_by_search(input.value);
  // console.log(data);

  // main_grid_title.innerText = `search Results...`
  main_grid.innerHTML = data.map((e => {
    return `<div class="card" data-id="${e.id}">
    <div class="img">
      <img src="${data.images.backdrops[0].file_path}" style="width: 80%; height:50%"  alt="">
      <div class="info">
        <h2>${e.title}</h2>
        <div class="single-info">
          <span>Rate:</span>
          <span>${e.vote_average}</span>
        </div>
        <div class="single-info">
          <span>Release Date:</span>
          <span>${e.release_date}</span>
        </div>
      </div>
    </div>
  </div>`;
  })).join('');
}
  
add_searched_movies_to_dom ();