import axios from 'axios';

const KEY = '25322807-0f0244e3a4ae1ff604a02abc7';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchPhotos() {
        const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
        
        const response = await axios.get(url);
        console.log(response);
        this.incrementPage();
        const photos = response.data;
             console.log(photos);
        return photos;  
    }
   
    incrementPage() {
        this.page++;
        console.log(this);
    };
   
    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        return this.searchQuery = newQuery;
    }
}
