//Up
async function fetchMovieData(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    if (isFetchingData) return; // If already fetching data, return early
    isFetchingData = true;
    const searchQuery = document.querySelector('input[name="search"]').value;
    const apiKey = '6b66069'; // Replace with your actual API key
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    const wrapper = document.querySelector('.wrapper');

    results.innerHTML = ''; // Clear previous results
    loading.style.display = 'block'; // Show loading indicator
    wrapper.style.display = 'none'; // Hide the wrapper initially

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKey}`);
        const data = await response.json();
        loading.style.display = 'none'; // Hide loading indicator

        if (data.Response === "True") {
            wrapper.style.display = 'block'; // Show the wrapper
            for (const movie of data.Search) {
                const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                const detailsData = await detailsResponse.json();
                displayMovieData(detailsData);
            }
        } else {
            wrapper.style.display = 'block'; // Show the wrapper even if no results
            displayNoResults(searchQuery);
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        loading.style.display = 'none'; // Hide loading indicator in case of error
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
            <h1><strong>${movie.Title}</strong></h1>
            <h3><strong>${movie.Year} | ${movie.Rated} | ${durationFormatted}</strong></h3>
            <p>${movie.Plot}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Writers:</strong> ${movie.Writer}</p>
            <p><strong>Stars:</strong> ${movie.Actors}</p>
            <h1><strong>Ratings:</strong></h1>
            <div class="ratings">
                <span class="rating"><i class="fas fa-star"></i> <strong>IMDB:</strong> ${movie.imdbRating}/10</span>
                <span class="rating"><i class="fas fa-pizza-slice"></i> <strong>Rotten Tomatoes:</strong> ${rottenTomatoesRating ? rottenTomatoesRating.Value : 'N/A'}</span>
                <span class="rating"><i class="fas fa-m"></i> <strong>Metacritic:</strong> ${movie.Metascore ? movie.Metascore : 'N/A'}/100</span>
            </div>
        </div>
    `;
    results.appendChild(movieContainer);
}

function displayNoResults(query) {
    const results = document.getElementById('results');
    results.innerHTML = `<p>No results found for "${query}".</p>`;
}

const form = document.getElementById('movieForm');

form.addEventListener('submit', fetchMovieData);
