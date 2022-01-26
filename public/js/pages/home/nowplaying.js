(function ($) {
    for (let movie of nowPlaying){
        $('.now-playing-list').append(
            `<a href="/movie/${movie.slug}">
                    <div class="movies-box">
                        <div class="movies-img">
                            <img src="https://image.tmdb.org/t/p/original/${movie.poster}">
                        </div>
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/qoute', "'")}</h6>
                            <p>${movie.genre[0]}${movie.genre.substring(1, movie.genre.length).toLowerCase()} | ${movie.runTime} min | ${movie.mpaaRating}</p>
                        </div>
                    </div>
            </a>`)
    }
})(window.jQuery);
