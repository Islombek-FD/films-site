// Select form elements 
const elForm = document.querySelector('.films__form');
const elSelect = document.querySelector('.genres__select');
const elSortSelect = document.querySelector('.sort__select');
const elRegExpInput = document.querySelector('.regexp__input');

// Selecting Body 
const elBody = document.querySelector('body');

// Selecting film list 
const elFilmsList = document.querySelector('.films__list');

// Selecting hamburger menu 
const elHamburgerMenu = document.querySelector('.hamburger__menu');

// Selecting bookmark element
const elBookmark = document.querySelector('.bookmark');

// Selecting bookmark open button 
const elBookmarkOpenBtn = document.querySelector('.bookmark__open-btn');

// Selecting bookmark films list 
const elBookmarkList = document.querySelector('.bookmark__list');

// Selecting modal elements
const elModal = document.querySelector('.modal');
const elModalInner = document.querySelector('.modal__inner');
const elModalFilmTitle = document.querySelector('.modal__film-title');
const elModalFilmImg = document.querySelector('.modal__film-img');
const elModalFilmDescription = document.querySelector('.modal__film-description');
const elModalFilmGenresTitle = document.querySelector('.modal__film-genres-title');
const elModalFilmGenresList = document.querySelector('.modal__film-genres-list');
const elModalFilmTime = document.querySelector('.modal__film-time');

// Normalize Date Function
function normalizeDate(format) {
    const date = new Date(format);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);

    return `${day}.${month}.${year}`;
}

// Films sort 
const sortFilms = {
    0: (a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return  1;
        }
        return 0;
    },

    1:  (a, b) => {
        if (a.title < b.title) {
            return 1;
        }
        if (a.title > b.title) {
            return -1;
        }
        return 0;
    },

    2: (a, b) => b.release_date - a.release_date,

    3: (a, b) => a.release_date - b.release_date,
}

const bookmarkFoundFilms = [];

// Listener form submit 
elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const elSelectValue = elSelect.value;
    const elSortSelectValue = elSortSelect.value;
    const elRegExpInputValue = elRegExpInput.value.trim();

    const regExp = new RegExp(elRegExpInputValue, 'gi');

    let filteredFilms = [];
    if (elSelectValue === 'All') {
        filteredFilms = films.filter(movie => movie.title.match(regExp));
    }
    else {
        filteredFilms = films.filter(film => film.genres.includes(elSelectValue)).filter(movie => movie.title.match(regExp));
    }

    filteredFilms.sort(sortFilms[elSortSelectValue]);
    elRegExpInput.value = null;

    renderFilms(filteredFilms, elFilmsList);
})

// Listener body click event
let isOpenForm = false;
elBody.addEventListener('click', (evt) => {
    const elBookmarkTitle = document.querySelector('.bookmark__title');
    if (evt.target.matches('.form__open-btn') || evt.target.matches('.form__open-icon')) {
        if (!isOpenForm) {
            elForm.classList.add('films__form--open');
            isOpenForm = true;
            evt.target.classList.add('form__open-btn--rotate');
        }
        else {
            elForm.classList.remove('films__form--open');
            isOpenForm = false;
            evt.target.classList.remove('form__open-btn--rotate');
        }
    }
    else if (evt.target.matches('.bookmark__open-btn') && bookmarkFoundFilms.length === 0) {
        elBookmarkTitle.textContent = 'No selected items';
        elBookmarkTitle.style.color = 'red';
    }
    else if (!(bookmarkFoundFilms.length === 0)) {
        elBookmarkTitle.textContent = 'Selected films';
        elBookmarkTitle.style.color = '#008CBA';
    }
})

let isOpenBookmark = false;
// Listener elBookmark click 
elBookmark.addEventListener('click', (evt) => {
    if (evt.target.matches('.bookmark__close-btn')) {
        elBookmark.classList.remove('bookmark--open');
        elBookmarkOpenBtn.textContent = 'Bookmarked\'s';
        elBookmarkOpenBtn.style.backgroundColor = 'red';
        elBookmarkOpenBtn.style.color = 'white';
        isOpenBookmark = false;
    }
    else if (evt.target.matches('.bookmark__delete-btn')) {
        const bookmarkId = evt.target.dataset.bookmarkId;
        const foundFilmIndex = bookmarkFoundFilms.findIndex(film => film.id === bookmarkId);
        bookmarkFoundFilms.splice(foundFilmIndex, 1);

        bookmarkFilms(bookmarkFoundFilms, elBookmarkList);
        if (bookmarkFoundFilms.length === 0) {
            elBookmark.classList.remove('bookmark--open');
            elBookmarkOpenBtn.textContent = 'Bookmarked\'s';
            elBookmarkOpenBtn.style.backgroundColor = 'red';
            elBookmarkOpenBtn.style.color = 'white';
            isOpenBookmark = false;
        }
    }
})

// Listener elBookmarkOpenBtn click 
elBookmarkOpenBtn.addEventListener('click', () => {
    if (!isOpenBookmark) {
        elBookmark.classList.add('bookmark--open');
        isOpenBookmark = true;
        elBookmarkOpenBtn.textContent = 'Opening';
        elBookmarkOpenBtn.style.backgroundColor = 'black';
        elBookmarkOpenBtn.style.color = 'orange';
    }
    else {
        elBookmark.classList.remove('bookmark--open');
        isOpenBookmark = false;
        elBookmarkOpenBtn.textContent = 'Bookmarked\'s';
        elBookmarkOpenBtn.style.backgroundColor = 'red';
        elBookmarkOpenBtn.style.color = 'white';
    }
})

// Render bookmarkFilms
function bookmarkFilms(arr, node) {
    node.innerHTML = null;

    arr.forEach(film => {
        const bookmarkFilmItem = document.createElement('li');
        const bookmarkFilmTitle = document.createElement('h3');
        const boookmarkFilmBtn = document.createElement('button');

        bookmarkFilmTitle.textContent = film.title;
        boookmarkFilmBtn.textContent = 'Delete';
        boookmarkFilmBtn.dataset.bookmarkId = film.id;
        
        bookmarkFilmItem.classList.add('bookmark__item');
        bookmarkFilmTitle.classList.add('bookmark__film-title');
        boookmarkFilmBtn.classList.add('bookmark__delete-btn');
        boookmarkFilmBtn.setAttribute('type', 'button');

        bookmarkFilmItem.appendChild(bookmarkFilmTitle);
        bookmarkFilmItem.appendChild(boookmarkFilmBtn);

        node.appendChild(bookmarkFilmItem);
    })
}

// Render films to films list
function renderFilms(arr, node) {
    node.innerHTML = null;

    arr.forEach(film => {

        film.genres.forEach(genre => {
            if(!elSelect.textContent.includes(genre)) {
                const genreOption = document.createElement('option');
                genreOption.value = genre;
                genreOption.textContent = genre;

                elSelect.appendChild(genreOption);
            }
        })

        const filmItem = document.createElement('li');
        const filmTitle = document.createElement('h3');
        const filmImg = document.createElement('img');
        const filmBookmarkBtn = document.createElement('button');
        const filmMoreBtn = document.createElement('button');
        
        filmTitle.textContent = film.title.split(' ').slice(0, 3).join(' ');
        filmImg.setAttribute('src', film.poster);
        filmImg.setAttribute('width', '200');
        filmImg.setAttribute('height', '250');
        filmBookmarkBtn.textContent = 'Bookmark';
        filmMoreBtn.textContent = 'More';
        
        
        filmItem.classList.add('film__item');
        filmTitle.classList.add('film__title');
        filmImg.classList.add('film__img');
        filmBookmarkBtn.classList.add('bookmark__btn');
        filmMoreBtn.classList.add('more__btn');
        filmBookmarkBtn.dataset.bookmarkId = film.id;
        filmMoreBtn.dataset.moreId = film.id;
    
        filmItem.appendChild(filmTitle);
        filmItem.appendChild(filmImg);
        filmItem.appendChild(filmMoreBtn);
        filmItem.appendChild(filmBookmarkBtn);
    
        node.appendChild(filmItem);
    })
}

// Films click 
elFilmsList.addEventListener('click', (evt) => {
    if (evt.target.matches('.bookmark__btn')) {
        const bookmarkId = evt.target.dataset.bookmarkId;
        const foundFilm = films.find(film => film.id === bookmarkId);

        if (bookmarkId) {
            evt.target.textContent = 'Bookmarked';
        }else {
            evt.target.textContent = 'Bookmark';
        }

        if (!bookmarkFoundFilms.includes(foundFilm)) {
            bookmarkFoundFilms.unshift(foundFilm);
        }   
        bookmarkFilms(bookmarkFoundFilms, elBookmarkList);
    }
    else if (evt.target.matches('.more__btn')) {
        elModal.classList.add('modal--open');
        const moreId = evt.target.dataset.moreId;
        const foundFilm = films.find(film => film.id === moreId);

        renderModalFilm(foundFilm);
    }
})

// Render initial films
renderFilms(films, elFilmsList);

// Render modal function 
function renderModalFilm(film) {
    elModalFilmGenresList.innerHTML = null;

    film.genres.forEach(genre => {
        const elModalFilmGenreItem =  document.createElement('li');
        elModalFilmGenreItem.textContent = genre;

        elModalFilmGenreItem.classList.add('modal__film-genre-item');

        elModalFilmGenresList.appendChild(elModalFilmGenreItem);
    })

    elModalFilmTitle.textContent = film.title;
    elModalFilmImg.setAttribute('src', film.poster);
    elModalFilmDescription.textContent = film.overview;
    elModalFilmGenresTitle.textContent = 'Film Genres Types:';
    elModalFilmTime.textContent = normalizeDate(film.release_date);
}

// Modalka
elModal.addEventListener('click', (evt) => {
    if (evt.target.matches('.modal') || evt.target.matches('.modal__close-btn')) {
        elModal.classList.remove('modal--open');
    }
})

