(function ($) {
    for (let movie of upcomingMovies){

        if (movie.poster.includes('null')) movie.poster = 'public/assets/noimg.jpg';

        $('.now-playing-list').append(
            `<a href="/movie/${movie.slug}">
                    <div class="movies-box">
                        <div class="movies-img">
                            <img src="${movie.poster}">
                        </div>
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/qoute', "'")}</h6>
                            <p>${(new Date(movie.releaseDate)).toLocaleDateString() }</p>
                        </div>
                    </div>
            </a>`)
    }
})(window.jQuery);
