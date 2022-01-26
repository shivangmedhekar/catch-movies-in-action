
(function ($){
    showDetails.movieName = showDetails.movieName.replace('/quote', "'");
    console.log(showDetails)
    if (showDetails.format.length === 0)
        showDetails.format = 'Digital';
    let layout, theaterName;
    let seats = showDetails.availability;

    printLayout();
    displayShowDetails();

    async function printLayout(){
        layout = await getAudiLayout(showDetails.format);
        console.log(layout)
        await addSeats(layout.layout);
    }

    async function displayShowDetails(){
        $('#movieName').html(showDetails.movieName);
        theaterName = await getTheaterName(showDetails.theaterId);
        $('#theaterName').html(theaterName);
        const showtime = (new Date(showDetails.showtime)).toLocaleString();
        $('#showTime').html(showtime);
        $('#format').html(showDetails.format);
    }

    async function getAudiLayout(format){

        const result = await $.ajax({
            method: 'GET',
            url: '/seatselection/'+ format
        });
        return result
    }
    getTheaterName(showDetails.theaterId);
    async function getTheaterName(theaterId){

        const result = await $.ajax({
            method: 'GET',
            url: '/theater/getTheaterById/'+ theaterId
        });
        return result.theaterName;
    }

    const continueButton = document.getElementById('continueButton');
    continueButton.disabled = true;

    function addSeats(layout) {

        const seatNos = Object.keys(showDetails.availability);

        let seatNoIndex = 0;
        for (let row of layout) {

            let rowDiv = document.createElement("div");
            rowDiv.className = "row";
            for (let ele of row) {

                let seatDiv = document.createElement("div");

                if (ele) {
                    seatDiv.className = "seat";
                    seatDiv.id = seatNos[seatNoIndex];
                    let seatNoDisplay = document.createTextNode(seatNos[seatNoIndex]);
                    seatDiv.appendChild(seatNoDisplay);
                    if (parseInt(seats[seatNos[seatNoIndex]])) {
                        seatDiv.classList.add("occupied");
                    }
                    seatNoIndex++;
                } else seatDiv.classList.add("hidden")
                rowDiv.appendChild(seatDiv);
            }
            document.getElementById('theatreContainer').appendChild(rowDiv);
        }
    }



    theatreContainer.addEventListener('click', (e) => {

        if ((e.target.classList.contains(('seat')) || e.target.classList.contains('seat-no')) && !e.target.classList.contains('occupied') && !e.target.classList.contains('hidden')) {
            e.target.classList.toggle('selected');
        }
        updateSelectedCount();
        updateButton();
    });

    function updateSelectedCount() {
        const selectedSeats = document.querySelectorAll('.row .seat.selected');

        let selectedSeatsList = [];
        for (let seat of selectedSeats) {
            selectedSeatsList.push(seat.id)
        }
        //console.log(selectedSeatsList)
        seatList = selectedSeatsList;
    }

    function updateButton() {
        if (!seatList.length) continueButton.disabled = true; else continueButton.disabled = false;
    }

    continueButton.addEventListener('click', e => {

        const summaryObj = {
            movieId: showDetails.movieId,
            movieName: showDetails.movieName,
            theaterId: showDetails.theatreId,
            theaterName: theaterName,
            showtime: showDetails.showtime,
            showtimeId: showDetails.showtimeId,
            noOfSeats: seatList.length,
            seats: seatList,
            format: showDetails.format,
            price: showDetails.ticketPrices
        }

        const form = document.createElement("form");
        const purchaseSummary = document.createElement("input");

        form.method = "POST";
        form.action = "/order/confirm-purchase";

        purchaseSummary.value = JSON.stringify(summaryObj);
        purchaseSummary.type = 'hidden'
        purchaseSummary.name = "Purchase Summary";
        form.appendChild(purchaseSummary);

        document.body.appendChild(form);

        form.submit();
    })

})(window.jQuery);