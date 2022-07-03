const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset-utf-8'
    },
    params: {
        'api_key': API_KEY,
    },
})

//Trending Movies: manipulacion dinamica para el slider 
async function  getTrendingMoviesPreview() {
    //Consumimos esta API con axios
    const {data} = await api('trending/movie/day') ///trending/{media_type}/{time_window} Esto esta en la API seccion tendencia
    const movies = data.results;

    movies.forEach(movie => {
        const trendinPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');

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

//Category: manipulacion dinamica para agregar una seccion de categorias
async function  getCategoriesPreview() {
    //Consumimos esta API con axios
    const {data} = await api('genre/movie/list'); //genre/movie/list Parametros que da la documentacion
    const categories = data.genres;
    
    categories.forEach(category => {
        const categoryPreviewMoviesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoryPreviewMoviesContainer.appendChild(categoryContainer);

    });
}

getCategoriesPreview();
getTrendingMoviesPreview();