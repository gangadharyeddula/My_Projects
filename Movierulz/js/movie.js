import {
fetchMovieDetails
}
from "./api.js";

import {
addFavorite
}
from "./storage.js";

import {
showToast
}
from "./ui.js";

const params =
new URLSearchParams(
window.location.search
);

const movieId =
params.get("id");

let currentMovie = null;

async function loadMovie(){

const movie =

await fetchMovieDetails(
movieId
);

currentMovie = movie;

saveRecentMovie(
movie
);

renderMovie(
movie
);

}

function renderMovie(
movie
){

document
.getElementById(
"movieDetails"
)
.innerHTML =

`
<div class="details-container">

<img
src="${movie.Poster}">

<div>

<h1>
${movie.Title}
</h1>

<button id="favoriteBtn">

Add To Favorites

</button>

<p>
Year:
${movie.Year}
</p>

<p>
Genre:
${movie.Genre}
</p>

<p>
Director:
${movie.Director}
</p>

<p>
Actors:
${movie.Actors}
</p>

<p>
IMDb Rating:
${movie.imdbRating}
</p>

<p>
${movie.Plot}
</p>

</div>

</div>
`;

document
.getElementById(
"favoriteBtn"
)
.addEventListener(
"click",
saveMovie
);

}

function saveMovie(){

const result =
addFavorite(
currentMovie
);

if(result){

showToast(
"Added To Favorites"
);

}
else{

showToast(
"Already Exists"
);

}

}

function saveRecentMovie(
movie
){

let recent =

JSON.parse(

localStorage.getItem(
"recent"
)

)||[];

recent.unshift(movie);

recent = recent.filter(

(item,index,self)=>

index===

self.findIndex(

m=>

m.imdbID===item.imdbID

)

);

recent = recent.slice(0,5);

localStorage.setItem(

"recent",

JSON.stringify(
recent
)

);

}

loadMovie();