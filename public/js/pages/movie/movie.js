(function($) {
    $(document).attr("title", `${movieInfo.movieName}: CMA`);
    console.log(movieInfo)
    $('#movie-name').html(movieInfo.movieName.replace(/\/quote/g,"'"));
    $('#movie-synopsis').html(movieInfo.synopsis.replace(/\/quote/g,"'"));

    if(movieInfo.genre)
        $('#movie-genre').html(movieInfo.genre);

    if(movieInfo.mpaaRating)
        $('#movie-mpaaRating').html(movieInfo.mpaaRating);

    if(movieInfo.runTime)
        $('#movie-runtime').html(`${movieInfo.runTime} MINS`);

    $('#movie-poster').attr("src", `${movieInfo.poster}`);
    $('#movie-backdrop').attr("src", `https://image.tmdb.org/t/p/original/${movieInfo.backdrop}`);
    const todaysDate = new Date();
    const releaseDate = new Date(movieInfo.releaseDate);

    if (movieInfo.hasScheduledShowtimes){

        $('#book-btn-link').attr('href', `${movieInfo.slug}/showtimes/`);
        $('#book-btn-link').html('Tickets Available');
        $('#book-btn-link').show();
    }
    else {
        $('#movie-release-date').html('Release Date: ' + releaseDate.toLocaleDateString());
        $('#movie-release-date').show();
    }

})(window.jQuery);