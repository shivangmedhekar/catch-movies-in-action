(function($) {
    console.log(orderHistory)
    for (let order of orderHistory){
        const today = new Date();

        console.log(new Date(order.showtime))
        if (new Date(order.showtime) - today < 0) $('#past-orders').append(order.movieName);
        else $('#upcoming-orders').append(order.movieName);
    }

})(window.jQuery);