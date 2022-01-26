
(function ($) {

    for (let movie of latestReleases){
        $('#latest-releases-list').append(
            `<a href="/movie/${movie.slug}">
                <li class="item">
                    <div class="latest-releases-showcase">
                        <img src="https://image.tmdb.org/t/p/original/${movie.backdrop}"/>
                    </div>
                </li>
            </a>`)
    }

    for (let movie of nowPlaying){
        $('#now-playing-list').append(
            `<a href="/movie/${movie.slug}">
                <li class="item">
                    <div class="now-playing-box">
                        <div class="now-playing-box-img">
                            <img src="https://image.tmdb.org/t/p/original/${movie.poster}">
                        </div>
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/qoute', "'")}</h6>
                            <p>${movie.genre} | ${movie.runTime} min | ${movie.mpaaRating}</p>
                        </div>
                    </div>
                </li>
            </a>`)
    }


    for (let movie of upcomingMovies){
        $('#upcoming-movies-list').append(
            `<a href="/movie/${movie.slug}">
                <li class="item">
                    <div class="now-playing-box">
                        <div class="now-playing-box-img">
                            <img src="https://image.tmdb.org/t/p/original/${movie.poster}">
                        </div>
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/qoute', "'")}</h6>
                            <p>${(new Date(movie.releaseDate)).toLocaleDateString() }</p>
                        </div>
                    </div>
                </li>
            </a>`)
    }


})(window.jQuery);