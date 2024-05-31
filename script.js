//API https://www.omdbapi.com/?s=Narnia&apikey=6b66069

async function fetchMovieData(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    const searchQuery = document.querySelector('input[name="search"]').value;
    const apiKey = '6b66069'; // Replace with your actual API key
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');

    results.innerHTML = ''; // Clear previous results
    loading.style.display = 'block'; // Show loading indicator

    const response = await fetch(`http://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKey}`);
    const data = await response.json();
    loading.style.display = 'none'; // Hide loading indicator

    if (data.Response === "True") {
        for (const movie of data.Search) {
            const detailsResponse = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
            const detailsData = await detailsResponse.json();
            displayMovieData(detailsData);
        }
    } else {
        displayNoResults(searchQuery);
    }
}

function displayMovieData(movie) {
    const results = document.getElementById('results');
    const rottenTomatoesRating = movie.Ratings.find(rating => rating.Source === "Rotten Tomatoes");
    const durationInMinutes = parseInt(movie.Runtime);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const durationFormatted = `${hours}h ${minutes}m`;

    const movieElement = document.createElement('div');
    movieElement.className = 'movie';
    movieElement.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'http://placehold.it/300x400'}" alt="${movie.Title}" />
        <p><strong>Title:</strong> ${movie.Title}</p>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Category:</strong> ${movie.Genre}</p>
        <p><strong>Duration:</strong> ${durationFormatted}</p>
        <p><strong>Description:</strong> ${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Writers:</strong> ${movie.Writer}</p>
        <p><strong>Stars:</strong> ${movie.Actors}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Rotten Tomatoes:</strong> ${rottenTomatoesRating ? rottenTomatoesRating.Value : 'N/A'}</p>
        <p><strong>Metacritic:</strong> ${movie.Metascore ? movie.Metascore : 'N/A'}</p>
    `;
    results.appendChild(movieElement);
}

function displayNoResults(query) {
    const results = document.getElementById('results');
    results.innerHTML = `<p>No results found for "${query}".</p>`;
}
