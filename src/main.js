//Movies para el slider 
async function  getTrendingMoviesPreview() {
    const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY) ///trending/{media_type}/{time_window} Esto esta en la API seccion tendencia
    const data = await response.json();

    const movies = data.results;
    movies.forEach(movie => {
        const trendinPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendinPreviewMoviesContainer.appendChild(movieContainer);
    });
}

getTrendingMoviesPreview();