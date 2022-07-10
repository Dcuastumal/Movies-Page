//Data
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

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}

//Utils (Reutilizar Codigo)

const lazyLoader = new IntersectionObserver((entries) => { //(callback, options) Se utilizaria para crear un observador para cada distinto contenedor
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
}) 

function createMovies(movies, container, {lazyLoad = false, clean = true} = {},) { //Creamos un clean para borrar todo el html

    if (clean) { //si es verdad eliminara la carga repetida
        container.innerHTML = ''; //Limpiando cache para volverlo a cargar con el forEach (Esto se hace para que no exista carga repetida)
    }

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute( lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path);
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://static.vecteezy.com/system/resources/previews/004/606/756/non_2x/icon-error-outline-long-shadow-style-simple-illustration-editable-stroke-free-vector.jpg');
        });
        
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie);
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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

    createMovies(movies, trendingMoviesPreviewList, true); //Llamando a la funcion createMovies para reutilizar codigo
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
    maxPage = data.total_pages; //Se almacena en la variable el numero total de paginas

    createMovies(movies, genericSection, {lazyLoad: true}); //Llamando a la funcion createMovies para reutilizar codigo
}

//Scroll infinito las peliculas por categoria
function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

        const pageIsNotMax = page < maxPage ; //Validamos que la pagina sea menor que el numero total de paginas

        if (scrollIsBottom && pageIsNotMax) { //Validamos el scrollIsBottom y que la pagina que se mostro sea menor que el numero total de paginas
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;

            createMovies(movies, genericSection, { lazyLoad: true, clean: false },);
            
        }
    }
}

//Buscador de peliculas
async function  getMoviesBySearch(query) {
    //Consumimos esta API con axios
    const {data} = await api('search/movie', { //discover/movie para hacer la busqueda de peliculas
        params: {
            query,
        },
    }) 
    const movies = data.results;
    maxPage = data.total_pages; //Se almacena en la variable el numero total de paginas
    console.log(maxPage)

    createMovies(movies, genericSection, {lazyLoad: true}); //Llamando a la funcion createMovies para reutilizar codigo
}

//Scroll infinito para Search
function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

        const pageIsNotMax = page < maxPage ; //Validamos que la pagina sea menor que el numero total de paginas

        if (scrollIsBottom && pageIsNotMax) { //Validamos el scrollIsBottom y que la pagina que se mostro sea menor que el numero total de paginas
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;

            createMovies(movies, genericSection, { lazyLoad: true, clean: false },);
        }
    }
}

//seccion de Tendencia
async function  getTrendingMovies() { //Declaramos la variable page = 1 (Primera Pagina)
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages; ////Se almacena en la variable el numero total de paginas

    createMovies(movies, genericSection, { lazyLoad: true});
}

//Scroll infinito para tendencias
async function getPaginatedTrendingMovies() {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage ; //Validamos que la pagina sea menor que el numero total de paginas

    if (scrollIsBottom && pageIsNotMax) { //Validamos el scrollIsBottom y que la pagina que se mostro sea menor que el numero total de paginas
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
            page,
            },
        });
    const movies = data.results;

    createMovies(movies, genericSection, { lazyLoad: true, clean: false },);
    }
}

//seccion de informacion de peliculas
async function  getMovieById(id) {
    //Consumimos esta API con axios
    const { data: movie } = await api('movie/' + id); //EndPoint de movie solamente peliculas por su id

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`; //Poner la imagen de fondo con el css

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id);
}
//Slider de peliculas relacionadas dentro de la seccion de informacion de peliculas
async function getRelatedMoviesId(id) {
    const {data} = await api(`/movie/${id}/similar`); //endpoint de similar
    const relatedMovides = data.results;

    createMovies(relatedMovides, relatedMoviesContainer);
    relatedMoviesContainer.scrollTo(0, 0) //Volver al inicio del scroll horizontal
}

