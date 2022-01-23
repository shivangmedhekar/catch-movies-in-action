console.log("here");
(function ($) {

    async function displayTopMovies(){
        const result = await $.ajax({
            method: 'GET',
            url: '/movie/getTopMovies/ajaxCall'
        });

        const topMovies = result.movies;
        for (let movie of topMovies) {
            $(".top-movies-carousel").append(
                `<a href=""><div class="card top-movie-card">` +
                    `<img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" class="card-img-top" alt="...">` +
                `</div></a>`
            );
        }
        var owl = $(".top-movies-carousel");
        owl.owlCarousel({
            autoplay: true,
            loop: true,
            items: 4,
            navigation: true
        });
    }
    displayTopMovies();



})(window.jQuery);