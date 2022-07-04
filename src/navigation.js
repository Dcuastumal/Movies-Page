searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value; //Usamos #hash para navegar
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends'; 
});
arrowBtn.addEventListener('click', () => {
    history.back(); //Para generar un historial de navegacion
    //location.hash = '#home'
});

window.addEventListener('DOMContentLoaded', navigator, false); //DOMContentLoaded: sirve para realizar acciones cuando el DOM ha terminado de cargar y se encuentra listo
window.addEventListener('hashchange', navigator, false); //El evento hashchange es ejecutado cuando el fragmento identificador de la URL ha cambiado (la parte de la URL que continúa despues del simbolo #, incluyendo el símbolo #).

function navigator() {
    console.log({location});

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        moviePage()
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; //   
}

function homePage() {
    console.log('HOME');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    searchForm.classList.add('header-searchForm');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getCategoriesPreview();
    getTrendingMoviesPreview();
}
function categoriesPage() {
    console.log('CATEGORIES!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('='); // ['#category', id-name] Esto es lo que nos devuelve para getMoviesByCategories
    const [categoryId, categoryName] = categoryData.split('-');
    const newName = categoryName.replace('%20', ' '); //Quita el %20 y dejarlo como un espacio " "

    headerCategoryTitle.innerHTML = newName;  //Cuando cambiemos de categoria aparezca el nombre de la categoria como h3

    getMoviesByCategory(categoryId);
}
function moviePage() {
    console.log('MOVIE');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('header-searchForm');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    //[#hash, id]
    const [_, movieId] = location.hash.split('=')
    getMovieById(movieId);
}
function searchPage() {
    console.log('SEARCH');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // [Search, Buscado]
    const [_, query] = location.hash.split('='); //Haciendo split de los hash en un array 
    const newName = query.replace('%20', ' ')  //Quita el %20 y dejarlo como un espacio " "
    headerCategoryTitle.innerHTML = `You search '${newName}'`;

    getMoviesBySearch(query);
}
function trendsPage() {
    console.log('TRENDS!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Trending';
    getTrendingMovies();
}