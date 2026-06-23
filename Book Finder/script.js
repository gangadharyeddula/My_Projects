const API_KEY = "AIzaSyBY6AGeKwlkevD76Do5LL2udS5PqmOtjkc";

document
.getElementById("searchInput")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        searchBook();
    }

});

async function searchBook(){

    const bookName =
    document.getElementById("searchInput").value.trim();

    const result =
    document.getElementById("result");

    if(bookName === ""){
        result.innerHTML =
        "<h2>Please Enter Book Name</h2>";
        return;
    }

    result.innerHTML =
    "<h2>Loading...</h2>";

    try{

        const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${bookName}&maxResults=20&key=${API_KEY}`
        );

        const data = await response.json();

        result.innerHTML = "";

        if(!data.items){

            result.innerHTML =
            `<div class="not-found">
                Book Not Found ❌
            </div>`;

            return;
        }

        data.items.forEach(book=>{

            const info = book.volumeInfo;

            const image =
            info.imageLinks?.thumbnail ||
            "https://via.placeholder.com/200x300";

            const author =
            info.authors
            ? info.authors.join(", ")
            : "Unknown Author";

            const card = document.createElement("div");

            card.classList.add("card");

            card.innerHTML = `
                <img src="${image}">
                <h3>${info.title}</h3>
                <p>${author}</p>
            `;

            card.addEventListener("click", ()=>{

                localStorage.setItem(
                    "selectedBook",
                    JSON.stringify(book)
                );

                window.location.href =
                "details.html";
            });

            result.appendChild(card);

        });

    }
    catch(error){

        result.innerHTML =
        "<h2>Something Went Wrong ⚠️</h2>";

        console.log(error);
    }

}