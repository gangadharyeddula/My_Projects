import { CONFIG }
from "./config.js";

const cache = {};

export async function fetchMovies(
search,
page = 1
){

const key =
`${search}-${page}`;

if(cache[key]){

return cache[key];

}

const response =
await fetch(

`${CONFIG.BASE_URL}?apikey=${CONFIG.API_KEY}&s=${search}&page=${page}`

);

const data =
await response.json();

cache[key] = data;

return data;

}

export async function fetchMovieDetails(
id
){

const response =
await fetch(

`${CONFIG.BASE_URL}?apikey=${CONFIG.API_KEY}&i=${id}`

);

return response.json();

}