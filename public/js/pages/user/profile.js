(function($) {
    console.log(orderHistory)

    async function main(){
        const today = new Date();

        orderHistory.sort((a, b) => (a.showtime < b.showtime) ? 1 : -1);

        for (let order of orderHistory){

            const movieInfo = await getMovieDetails(order.movieId);

            const posterDiv = `<div class="movie-poster-box">
                                    <div class="movie-poster-box-img">
                                        <img id="movie-poster" src="${movieInfo.poster}">
                                    </div>
                                </div>`;

            const movieDetailsDiv = `<div class="movie-details-box">
                                        <h3 id="movie-name" class="h3">${movieInfo.movieName}</h3>
                                        <h3 id="theater-name" class="h5">${order.theaterName}</h3>
                                        <h3 id="format" class="h5">${order.format}</h3>
                                        <h3 id="showtime" class="h5">${(new Date(order.showtime)).toDateString()}</h3>
                                        <h3 id="showtime" class="h5">${(new Date(order.showtime)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3>
                                        <h3 id="seats" class="h5">Seats: ${order.seats}</h3>
                                        <h3 id="total-cost" class="h5">$${order.totalcost}</h3>
                                    </div>`;

            const orderDiv = `<div class="movie-box">
                                <div class="bg-light movie-box-inside">
                                    ${posterDiv} ${movieDetailsDiv}
                                </div>
                               </div>`;

            if (new Date(order.showtime) - today < 0) {

                $('#post-orders-list').append(orderDiv);
            }
            else $('#upcoming-orders-list').append(orderDiv);
        }
    }
    main();
    async function getMovieDetails(movieId){
        const result = await $.ajax({
            method: 'POST',
            url: '/movie/' + movieId
        });
        return (result)
    }

})(window.jQuery);

