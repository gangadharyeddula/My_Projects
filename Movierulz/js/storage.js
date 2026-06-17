export function getFavorites(){

return JSON.parse(

localStorage.getItem(
"favorites"
)

)||[];

}

export function saveFavorites(
favorites
){

localStorage.setItem(

"favorites",

JSON.stringify(
favorites
)

);

}

export function addFavorite(
movie
){

const favorites =
getFavorites();

const exists =

favorites.some(

item=>

item.imdbID === movie.imdbID

);

if(exists){

return false;

}

favorites.push(movie);

saveFavorites(
favorites
);

return true;

}

export function removeFavorite(
id
){

const favorites =
getFavorites();

const updated =

favorites.filter(

movie=>

movie.imdbID !== id

);

saveFavorites(
updated);

}

export function saveTheme(
isLight
){

localStorage.setItem(
"theme",
isLight
);

}

export function getTheme(){

return localStorage.getItem(
"theme"
);

}