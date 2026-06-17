import { state }
from "./state.js";

import {
fetchMovies
}
from "./api.js";

import {
renderMovies,
appendMovies,
showSkeleton
}
from "./ui.js";

const searchInput =
document.getElementById(
"searchInput"
);

const moviesContainer =
document.getElementById(
"moviesContainer"
);

const themeBtn =
document.getElementById(
"themeBtn"
);

const savedTheme =

localStorage.getItem(
"theme"
);

if(savedTheme==="light"){

document.body.classList.add(
"light"
);

}
themeBtn.addEventListener(
"click",

()=>{

document.body.classList.toggle(
"light"
);

localStorage.setItem(

"theme",

document.body.classList.contains(
"light"
)

?

"light"

:

"dark"

);

}
);

let isLoading = false;

async function searchMovies(){

if(!state.search)
return;

showSkeleton(
moviesContainer
);

const data =

await fetchMovies(

state.search,

state.page

);

if(data.Response==="False"){

moviesContainer.innerHTML =
"<h2>No Movies Found</h2>";

return;

}

renderMovies(
data.Search,
moviesContainer
);

}

function debounce(
callback,
delay
){

let timeout;

return function(){

clearTimeout(timeout);

timeout = setTimeout(

()=>{

callback.apply(
this,
arguments
);

},

delay

);

};

}

const searchHandler =

debounce(

(event)=>{

state.search =
event.target.value;

state.page = 1;

if(
state.search.length < 3
)
return;

searchMovies();

},

500

);

searchInput
.addEventListener(
"input",
searchHandler
);

moviesContainer
.addEventListener(
"click",

(event)=>{

const card =

event.target.closest(
".movie-card"
);

if(!card)
return;

const movieId =
card.dataset.id;

window.location.href =

`movie.html?id=${movieId}`;

}
);

window.addEventListener(
"scroll",

async ()=>{

if(isLoading)
return;

const {

scrollTop,
scrollHeight,
clientHeight

}

=

document.documentElement;

if(

scrollTop +
clientHeight

>=

scrollHeight - 100

){

isLoading = true;

state.page++;

const data =

await fetchMovies(

state.search,

state.page

);

if(data.Search){

appendMovies(
data.Search,
moviesContainer
);

}

isLoading = false;

}

}
);

function saveSearchHistory(
search
){

let history =

JSON.parse(

localStorage.getItem(
"history"
)

)||[];

history.unshift(search);

history =

[...new Set(history)];

history = history.slice(0,10);

localStorage.setItem(

"history",

JSON.stringify(
history
)

);

renderHistory();

}

function renderHistory(){

const container =

document.getElementById(
"historyContainer"
);

if(!container)
return;

const history =

JSON.parse(

localStorage.getItem(
"history"
)

)||[];

container.innerHTML="";

history.forEach(item=>{

container.innerHTML +=

`
<button
class="history-btn">

${item}

</button>
`;

});

}