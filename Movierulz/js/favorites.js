import {
    getFavorites,
    removeFavorite
}
    from "./storage.js";

import {
    showToast
}
    from "./ui.js";

const favoritesContainer =

    document.getElementById(
        "favoritesContainer"
    );

function loadFavorites() {

    const favorites =
        getFavorites();

    if (
        favorites.length === 0
    ) {

        favoritesContainer.innerHTML =

            `
<h2>
No Favorites Yet
</h2>
`;

        return;

    }

    favoritesContainer.innerHTML = "";

    favorites.forEach(movie => {

        favoritesContainer.innerHTML +=

            `
<div class="movie-card">

<img
src="${movie.Poster}">

<h3>
${movie.Title}
</h3>

<p>
${movie.Year}
</p>

<button
class="remove-btn"
data-id="${movie.imdbID}">

Remove

</button>

</div>
`;

    });

}

favoritesContainer
    .addEventListener(
        "click",

        (event) => {

            if (

                event.target.classList.contains(
                    "remove-btn"
                )

            ) {

                const id =
                    event.target.dataset.id;

                removeFavorite(id);

                showToast(
                    "Removed"
                );

                loadFavorites();

            }

        }
    );

loadFavorites();