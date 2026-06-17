export function showToast(
message
){

const toast =
document.createElement(
"div"
);

toast.className =
"toast";

toast.textContent =
message;

document
.getElementById(
"toastContainer"
)
.appendChild(toast);

setTimeout(()=>{

toast.remove();

},3000);

}

export function showSkeleton(
container
){

container.innerHTML = "";

for(let i=0;i<8;i++){

container.innerHTML +=

`
<div class="skeleton">
</div>
`;

}

}

export function renderMovies(
movies,
container
){

container.innerHTML = "";

movies.forEach(movie=>{

const poster =

movie.Poster === "N/A"

?

"https://via.placeholder.com/300x450"

:

movie.Poster;

container.innerHTML +=

`
<div
class="movie-card"
data-id="${movie.imdbID}">

<img
loading="lazy"
src="${poster}">

<h3>
${movie.Title}
</h3>

<p>
${movie.Year}
</p>

</div>
`;

});

}

export function appendMovies(
movies,
container
){

movies.forEach(movie=>{

container.innerHTML +=

`
<div
class="movie-card"
data-id="${movie.imdbID}">

<img
loading="lazy"
src="${movie.Poster}">

<h3>
${movie.Title}
</h3>

<p>
${movie.Year}
</p>

</div>
`;

});

}