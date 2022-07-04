//Declaramos propiedades bases con Axios
const API_KEY = '416c4eb7ed48b7d9f2f543bd1bf36b6d';
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset-utf-8'
    },
    params: {
        'api_key': API_KEY,
    },
})

//Utils (Reutilizar Codigo)
function createMovies(movies, container) {

    container.innerHTML = ''; //Limpiando cache para volverlo a cargar con el forEach (Esto se hace para que no exista carga repetida)

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    container.innerHTML = ''; //Limpiando cache para volverlo a cargar con el forEach (Esto se hace para que no exista carga repetida)
    
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}` ;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

//Llamados a la API
//Trending Movies: manipulacion dinamica para el slider 
async function  getTrendingMoviesPreview() {
    //Consumimos esta API con axios
    const {data} = await api('trending/movie/day') ///trending/{media_type}/{time_window} Esto esta en la API seccion tendencia
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList); //Llamando a la funcion createMovies para reutilizar codigo
}

//Category: manipulacion dinamica para agregar una seccion de categorias
async function  getCategoriesPreview() {
    //Consumimos esta API con axios
    const {data} = await api('genre/movie/list'); //genre/movie/list Parametros que da la documentacion
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

//Llamar peliculas por categoria
async function  getMoviesByCategory(id) {
    //Consumimos esta API con axios
    const {data} = await api('discover/movie', { //discover/movie para filtrar peliculas por genero
        params: {
            with_genres: id,
        },
    }) 
    const movies = data.results;

    createMovies(movies, genericSection); //Llamando a la funcion createMovies para reutilizar codigo
}

//Buscador de peliculas
async function  getMoviesBySearch(query) {
    //Consumimos esta API con axios
    const {data} = await api('search/movie', { //discover/movie para filtrar peliculas por genero
        params: {
            query,
        },
    }) 
    const movies = data.results;

    createMovies(movies, genericSection); //Llamando a la funcion createMovies para reutilizar codigo
}
