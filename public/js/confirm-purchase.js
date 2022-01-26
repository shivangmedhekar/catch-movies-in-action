(function($) {
    const confirmButton = document.getElementById('confirm-btn');
    console.log(orderSummary);

    $('#movie-name').html(`${orderSummary.movieName}`);
    $('#show-date').html(`${(new Date(orderSummary.showtime)).toLocaleDateString()}`);
    $('#show-time').html(`${(new Date(orderSummary.showtime)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
    $('#theater-name').html(`${orderSummary.theaterName}`);
    $('#format').html(`${orderSummary.format}`);
    $('#no-of-seats').html(` ${orderSummary.seats.length}`);
    $('#seats').html(`${orderSummary.seats}`);
    $('#cost').html(`$${orderSummary.seats.length * orderSummary.price[0].price}`)
    // $('#audi').html(`Movie: ${orderSummary.audit}`);


    let movieInfo;
    async function getMovieInfo(){
        const result = await $.ajax({
            method: 'GET',
            url: '/movie/getMovieBySlug/' + slug
        });
        console.log(result.movie.movieName)
    }
    confirmButton.addEventListener('click', e => {


        const form = document.createElement("form");
        const purchaseSummary = document.createElement("input");
        form.method = "POST";
        form.action = "/order/checkout";
        orderSummary.totalcost = orderSummary.seats.length * orderSummary.price[0].price;
        purchaseSummary.value = JSON.stringify(orderSummary);
        purchaseSummary.type = 'hidden'
        purchaseSummary.name = "orderSummary";
        form.appendChild(purchaseSummary);

        document.body.appendChild(form);

        form.submit();
    })
})(window.jQuery);