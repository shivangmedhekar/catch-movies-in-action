const mongoCollections = require('./../config/mongoCollections');
const axios = require("axios");
const showtimesCollection = mongoCollections.showtimes;
const X_AMC_VENDOR_KEY = process.env.X_AMC_VENDOR_KEY;

async function clearOldShowtime(){
    const showtimes = await showtimesCollection();
    const findResult = await showtimes.find().toArray();

    const today = new Date();
    for (let show of findResult){
        if (show.showtime - today < 0) {
            const deleteQuery = showtimes.deleteOne({_id: show._id});
        }
    }

}

async function getShowsOfMovie(theaterId, slug, searchDate){

    slug = slug.substring(0, slug.length - 6)
    const url = `https://api.amctheatres.com/v2/theatres/${theaterId}/showtimes/${searchDate}/?movie=${slug}`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': X_AMC_VENDOR_KEY
        }
    });
    let showtimes = [];

    for (let show of data._embedded.showtimes){
        showtimes.push({
            id: show.id,
            showtime: show.showDateTimeLocal,
            format: show.premiumFormat
        })
    }
    return showtimes;
}

async function getShowsDetails(showtimeId){

    const showtimes = await showtimesCollection();

    const findResult = await showtimes.findOne({showtimeId: showtimeId});
    if (findResult) {
        findResult.movieName = findResult.movieName.replace("'", "/quote");
        return findResult
    }

    const url = `https://api.amctheatres.com/v2/showtimes/${showtimeId}`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': X_AMC_VENDOR_KEY
        }
    });

    const showtime = new Date(data.showDateTimeLocal);
    const timeNow = new Date();
    const diff = showtime.getTime() - timeNow.getTime()

    const ttl = Math.abs(diff / 1000)

    let ticketPrices = [];
    for (let price of data.ticketPrices){
        ticketPrices.push({
            type: price.type,
            price: price.price
        })
    }

    const showtimeObj = {
        showtime: new Date(showtime),
        showtimeId: showtimeId,
        format: data.premiumFormat,
        movieId: data.movieId,
        movieName: data.movieName,
        theaterId: data.theatreId,
        audi: data.auditorium,
        availability: setAudiAvailability(data.premiumFormat),
        ticketPrices: ticketPrices
    }

    const insertResult = await showtimes.insertOne(showtimeObj);
    showtimeObj.movieName = showtimeObj.movieName.replace("'", '/quote');
    return showtimeObj
}

function setAudiAvailability(format){

    if (format.length === 0) {
        return {
            A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, A7: 0, A8: 0, A9: 0, A10: 0,
            B1: 0, B2: 0, B3: 0, B4: 0, B5: 0, B6: 0, B7: 0, B8: 0, B9: 0, B10: 0,
            C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0, C7: 0, C8: 0, C9: 0, C10: 0,
            D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0, D8: 0, D9: 0, D10: 0, D11: 0, D12: 0, D13: 0,
            E1: 0, E2: 0, E3: 0, E4: 0, E5: 0, E6: 0, E7: 0, E8: 0, E9: 0, E10: 0, E11: 0, E12: 0, E13: 0
        }
    }
    else if (format.includes("IMAX")) {
        return {
            A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, A7: 0, A8: 0, A9: 0, A10: 0, A11: 0, A12: 0, A13: 0, A14: 0,
            B1: 0, B2: 0, B3: 0, B4: 0, B5: 0, B6: 0, B7: 0, B8: 0, B9: 0, B10: 0, B11: 0, B12: 0, B13: 0, B14: 0, B15: 0, B16: 0,
            C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0, C7: 0, C8: 0, C9: 0, C10: 0, C11: 0, C12: 0, C13: 0, C14: 0, C15: 0, C16: 0,
            D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, D7: 0, D8: 0, D9: 0, D10: 0, D11: 0, D12: 0, D13: 0, D14: 0, D15: 0, D16: 0,
            E1: 0, E2: 0, E3: 0, E4: 0, E5: 0, E6: 0, E7: 0, E8: 0, E9: 0, E10: 0, E11: 0, E12: 0, E13: 0, E14: 0, E15: 0, E16: 0,
            F1: 0, F2: 0, F3: 0, F4: 0, F5: 0, F6: 0, F7: 0, F8: 0, F9: 0, F10: 0, F11: 0, F12: 0, F13: 0, F14: 0, F15: 0, F16: 0,
            G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0, G7: 0, G8: 0, G9: 0, G10: 0, G11: 0, G12: 0
        }
    }

    else {
        return {
            A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, A7: 0, A8: 0,
            B1: 0, B2: 0, B3: 0, B4: 0, B5: 0, B6: 0, B7: 0, B8: 0,
            C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0, C7: 0, C8: 0
        }
    }
}

module.exports = {
    getShowsOfMovie, getShowsDetails, clearOldShowtime
}