import './sass/main.scss';
import ImageApiService from './pixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    loadMoreBtn: document.querySelector(".load-more-btn"),
    search: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
}

refs.search.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imageApiService = new ImageApiService();
console.log(imageApiService);

async function onSearch(evt) {
    evt.preventDefault();
//   refs.loadMoreBtn.classList.add('is-hidden');
    imageApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

    if (!imageApiService.query) {
        Notiflix.Notify.failure("Please enter what you find!");
        return;
    }

    imageApiService.resetPage();

    try {
        const result = await imageApiService.fetchPhotos();
        const photos = result.hits;
        const totalHits = result.totalHits;
        console.log(totalHits);
        if (totalHits === 0) {    
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            clearMarkup();
            refs.loadMoreBtn.classList.add('is-hidden');
            return;
        } 

        const maxPage = Math.ceil(totalHits / 40);

        if (!(maxPage === 1)) {
            refs.loadMoreBtn.disabled = false;
            refs.loadMoreBtn.classList.remove('is-hidden');
        }

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        clearMarkup();
        markupImageEl(photos);
    } catch (err) {
        console.log(err);
    }
};

async function onLoadMore() {
    refs.loadMoreBtn.disabled = true;
    try {
        const result = await imageApiService.fetchPhotos();
        const photos = result.hits;
        const totalHits = result.totalHits;
        const maxPage = Math.ceil(totalHits / 40);
        const currenPage = imageApiService.page - 1;
        if (maxPage === currenPage) {
            refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
        markupImageEl(photos);
        refs.loadMoreBtn.disabled = false;
    } catch (err) {
        console.log(err);
    };
    
};


function markupImageEl(photos) {
    const markup = photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <li class="gallery__item">
            <a href="${largeImageURL}" class="gallery__link">
            <div class="card-thumb">
                <img class="card-thumb__img" src="${webformatURL}" alt="${tags}">
            </div>
            <div class="card-contetnt">
                <p class="card-content__item">
                    <b>Likes:</b> ${likes}
                </p>
                <p class="card-content__item">
                    <b>Views:</b> ${views}
                </p>
                <p class="card-content__item">
                    <b>Comments:</b> ${comments}
                </p>
                <p class="card-content__item">
                    <b>Downloads:</b> ${downloads}
                </p>
            </div>
           </a>
        </li>`;
        
    }).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);
    simpleLightbox();
}

function clearMarkup() {
    refs.gallery.innerHTML = ''
    // refs.loadMoreBtn.classList.toggle('is-hidden');
}
function simpleLightbox() {
    let lightbox = new SimpleLightbox('.gallery a', {
    /* options */
    });
    lightbox.refresh();
}