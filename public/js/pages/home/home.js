
(function ($) {
    $('#latest-releases-list').hide();
    $('#now-playing-list').hide();
    $('#upcoming-movies-list').hide();
    for (let movie of latestReleases){
        $('#latest-releases-list').append(
            `<a href="/movie/${movie.slug}">
                <li class="item">
                    <div class="latest-releases-showcase">
                        <img src="${movie.backdrop}"/>
                    </div>
                </li>
            </a>`)
    }

    for (let movie of nowPlaying){
        let subString = [];
        if (movie.genre) subString.push(movie.genre);
        if (movie.runTime) subString.push(`${movie.runTime} mins`);
        if (movie.mpaaRating) subString.push(movie.mpaaRating);

        const movieSubInfo = subString.join(' | ')
        $('#now-playing-list').append(
            `<a href="/movie/${movie.slug}">
                <li class="item">
                    <div class="now-playing-box">
                        <div class="now-playing-box-img">
                            <img src="${movie.poster}">
                        </div>
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/quote', "'")}</h6>
                            <p>${movieSubInfo}</p>
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
                            <img src="${movie.poster}">
                        </div>
        
                        <div class="now-playing-box-text">
                            <h6>${movie.movieName.replace('/quote', "'")}</h6>
                            <p>${(new Date(movie.releaseDate)).toLocaleDateString() }</p>
                        </div>
                    </div>
                </li>
            </a>`)
    }


    $('#latest-releases-list').show();
    $('#now-playing-list').show();
    $('#upcoming-movies-list').show();

})(window.jQuery);

$(document).ready(function() {
    $('#latest-releases-list, #now-playing-list, #upcoming-movies-list').lightSlider({
        autoWidth:true,
        loop:true,
        onSliderLoad: function() {
            $('#latest-releases-list, #now-playing-list, #upcoming-movies-list').removeClass('cS-hidden');
        }
    });

});