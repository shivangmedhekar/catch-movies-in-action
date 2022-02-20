(function ($) {

    console.log(nowPlaying)
    for (let movie of nowPlaying){
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
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/qoute', "'")}</h6>
                            <p> ${genre} | ${movie.runTime} min | ${movie.mpaaRating}</p>
                        </div>
                    </div>
            </a>`)
    }
})(window.jQuery);
