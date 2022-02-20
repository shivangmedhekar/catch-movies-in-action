(function($) {

    const todaysDate = new Date();
    async function main(){
        const movieDetails = await getMovieDetails();
        let movieReleaseDate = new Date(movieDetails.releaseDate);;


        let calenderDate;
        if (movieReleaseDate - todaysDate < 0) calenderDate = todaysDate;
        else calenderDate = movieReleaseDate;
        // Today's date set in Input type Date for value and minimum selection
        document.getElementById("calender").value = calenderFormatDate(calenderDate);
        document.getElementById("calender").min = calenderFormatDate(calenderDate);

        const dateForSearch = dateFormatingForSearch(calenderDate);
        getShows(dateForSearch);
    }

    main();

    function calenderFormatDate(date){
        console.log(date.getMonth())
        let dateString, year, month, day;

        year = date.getFullYear();

        if (date.getMonth() + 1 < 9) month = `0${date.getMonth() + 1}`;
        else month = date.getMonth() + 1;

        if (date.getDate() < 9) day = `0${date.getDate()}`;
        else day = date.getDate();

        return `${year}-${month}-${day}`;
    }

    async function getMovieDetails(){
        const result = await $.ajax({
            method: 'GET',
            url: '/movie/getMovieBySlug/' + slug
        });
        console.log(result)
        // movieReleaseDate = new Date(result.releaseDate);
        $("#movie-name").html(result.movie.movieName.replace('/quote', "'"));
        return result.movie
    }

    // Search for shows by selection of date and click on search button
    searchByDate();

    function dateFormatingForSearch(date){
        const formatedDate = date.toLocaleDateString().split('/');
        return `${formatedDate[0]}-${formatedDate[1]}-${formatedDate[2].substring(2,4)}`
    }


    function searchByDate() {
        $('#searchBtn').on("click", function (){
            const calenderDate = ($('#calender').val()).split('-');
            const calenderFormatedDate = `${calenderDate[1]}-${calenderDate[2]}-${calenderDate[0]}`;

            const searchDate = dateFormatingForSearch(new Date(calenderFormatedDate));

            $('#show-list').empty()
            getShows(searchDate);
        })
    }
    
    async function getTheaters() {

        const result = await $.ajax({
            method: 'GET',
            url: '/theater/getAllTheaters/'
        });
        return result.theaters
    }

    async function getShows(searchDate){
        let theaters = await getTheaters();
        $('.loader-showtimes').show();
        $('#show-list').hide();
        for (let theater of theaters){
            let theaterDiv = `<div id="${theater.slug}" class="theater">`
            let theaterName = `<h2 class="theater-name display-5">${theater.name}</h2>`

            const result = await $.ajax({
                method: 'POST',
                url: `/showtimes/getshows/${theater.id}/${slug}/${searchDate}` ,
            });

            let conditionalDiv;
            if (result['error']) {
                const errorMsg = 'Sorry, No shows available for this movie';
                conditionalDiv = ''
            }
            else {
                let digital = [];
                let imax = [];
                let dolby = [];
                let prime = [];

                for (let show of result) {
                    if (show.format.length == 0)
                        digital.push(show);
                    else if (show.format.includes("IMAX"))
                        imax.push(show)
                    else if (show.format.includes('Dolby'))
                        dolby.push(show)
                    else prime.push(show)
                }
                const showsByFormat = [digital, imax, dolby, prime];


                let formatDiv = '';
                for (let format in showsByFormat) {
                    let formatHeading = '';
                    let flag = false
                    if (showsByFormat[format].length > 0) flag = true

                    if (format == 0 && flag) formatHeading = '<h3 class="show-format">Digital</h3>';
                    else if (format == 1 && flag) formatHeading = '<h3 class="show-format">IMAX WITH LASER AT AMC</h3>';
                    else if (format == 2 && flag) formatHeading = '<h3 class="show-format">DOLBY CINEMA</h3>';
                    else if (format == 3 && flag)formatHeading = '<h3 class="show-format">Prime</h3>';

                    let showList = '<div class="show-timings">';
                    for (let show of showsByFormat[format]){

                        let showtime = new Date(show.showtime);
                        const showtimeFormated = showtime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        if (showtime - todaysDate < 0) {

                            showList += `<h4><span class="badge bg-secondary timings">${showtimeFormated}</span></h4>`
                        }
                        else
                            showList += `<h4><a href="${show.id}/"><span class="badge bg-primary timings">${showtimeFormated}</span></a></h4>`
                    }
                    showList += '</div>'
                    if (flag)
                        formatDiv += `<div class="shows bg-light">${formatHeading} ${showList}</div>`
                }
                conditionalDiv = theaterName + formatDiv
            }
            let divToAppend = theaterDiv + conditionalDiv + '</div>'
            $('#show-list').append(divToAppend);
        }
        $('.loader-showtimes').hide();
        $('#show-list').show();
    }

    async function displayTheaterName(theaterId){

        const result = await $.ajax({
            method: 'GET',
            url: '/theater/getTheaterNameById/' + theaterId
        });

        $("#show-list").append('<h2>' + result.theaterName +'</h2>');
    }





})(window.jQuery);