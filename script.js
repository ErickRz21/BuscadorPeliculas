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

    const movieContainer = document.createElement('div');
    movieContainer.style.width = '100%';
    movieContainer.className = 'movie';

    movieContainer.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'http://placehold.it/300x400'}" alt="${movie.Title}" />
        <div class="movie-details">
            <p><strong>${movie.Title}</strong></p>
            <p> ${movie.Year}, ${movie.Genre}, ${durationFormatted}</p>
            <p>${movie.Plot}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Writers:</strong> ${movie.Writer}</p>
            <p><strong>Stars:</strong> ${movie.Actors}</p>
        </div>
    `;
    results.appendChild(movieContainer);

     const ratingsDiv = document.createElement('div');
    ratingsDiv.className = 'ratings';
    ratingsDiv.innerHTML = `
        <p><strong>Ratings:</strong></p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Rotten Tomatoes:</strong> ${rottenTomatoesRating ? rottenTomatoesRating.Value : 'N/A'}</p>
        <p><strong>Metacritic:</strong> ${movie.Metascore ? movie.Metascore : 'N/A'}</p>
    `;
    
    // Append the ratingsDiv to movieContainer
    movieContainer.appendChild(ratingsDiv);
}




function displayNoResults(query) {
    const results = document.getElementById('results');
    results.innerHTML = `<p>No results found for "${query}".</p>`;
}
