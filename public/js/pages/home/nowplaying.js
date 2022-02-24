(function ($) {

    console.log(nowPlayingMovies)
    for (let movie of nowPlayingMovies){
        let genre
        if (movie.genre) genre = `${movie.genre[0]}${movie.genre.substring(1, movie.genre.length).toLowerCase()}`;
        else genre = "NA";

        if (movie.poster.includes('null')) movie.poster = 'public/assets/noimg.jpg';

        $('.now-playing-list').append(
            `<a href="/movie/${movie.slug}">
                    <div class="movies-box">
                        <div class="movies-img">
                            <img src="${movie.poster}">
                        </div>
        
                        <div class="movie-box-text">
                            <h6>${movie.movieName.replace('/qoute', "'")}</h6>
                            <p> ${genre} | ${movie.runTime} min | ${movie.mpaaRating}</p>
                        </div>
                    </div>
            </a>`)
    }
})(window.jQuery);
