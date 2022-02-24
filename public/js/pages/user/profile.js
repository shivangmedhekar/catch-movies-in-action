(function($) {
    console.log(orderHistory)
    const today = new Date();
    async function main(){


        const [pastEvents, upcomingEvents] = getEventLists(orderHistory);


        upcomingEvents.sort((a, b) => (a.showtime > b.showtime) ? 1 : -1);

        if (pastEvents.length) {
            pastEvents.sort((a, b) => (a.showtime < b.showtime) ? 1 : -1);
            for (let event of pastEvents){
                const orderDiv = await createOrderDiv(event);
                $('#post-orders-list').append(orderDiv);
            }
        }
        else {
            $('#post-orders-list').append('<h5>No Past Events</h5>')
        }

        if (upcomingEvents.length) {
            for (let event of upcomingEvents){
                const orderDiv = await createOrderDiv(event);
                $('#upcoming-orders-list').append(orderDiv);
            }
        }
        else {
            $('#upcoming-orders-list').append('<h5>No Upcoming Events</h5>')
        }


        // for (let order of orderHistory){
        //
        //     const orderDiv = await createOrderDiv(order);
        //
        //     if (new Date(order.showtime) - today < 0) {
        //
        //         $('#post-orders-list').append(orderDiv);
        //     }
        //     else $('#upcoming-orders-list').append(orderDiv);
        // }
    }
    main();

    function getEventLists(orderHistory){
        let pastEvents = [];
        let upcomingEvents = [];
        for (let order of orderHistory) {
            if (new Date(order.showtime) - today < 0) pastEvents.push(order);
            else upcomingEvents.push(order);
        }
        return [pastEvents, upcomingEvents];
    }

    async function getMovieDetails(movieId){
        const result = await $.ajax({
            method: 'POST',
            url: '/movie/' + movieId
        });
        return (result)
    }

    async function createOrderDiv(order){
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

        return orderDiv;
    }

})(window.jQuery);

