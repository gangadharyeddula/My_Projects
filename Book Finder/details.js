const book =
JSON.parse(
localStorage.getItem("selectedBook")
);

const info = book.volumeInfo;

const image =
info.imageLinks?.thumbnail ||
"https://via.placeholder.com/200x300";

document.getElementById("bookDetails")
.innerHTML = `

<div class="details-card">

<a href="index.html"
class="back-btn">
⬅ Back
</a>

<br><br>

<img src="${image}">

<h1>${info.title}</h1>

<h3>
${
info.authors
? info.authors.join(", ")
: "Unknown Author"
}
</h3>

<p>
<b>Publisher:</b>
${info.publisher || "N/A"}
</p>

<p>
<b>Published Date:</b>
${info.publishedDate || "N/A"}
</p>

<p>
<b>Categories:</b>
${
info.categories
? info.categories.join(", ")
: "N/A"
}
</p>

<p>
<b>Page Count:</b>
${info.pageCount || "N/A"}
</p>

<p>
<b>Language:</b>
${info.language || "N/A"}
</p>

<h2>Description</h2>

<p>
${info.description || "No Description Available"}
</p>
</div>
`;