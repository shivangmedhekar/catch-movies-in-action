const mongoCollections = require('./../../config/mongoCollections');
const showtimesCollection = mongoCollections.showtimes;


async function createMovieShowTime(movieId) {


    const showtimes = await showtimesCollection();

    const findResult = await showtimes.findOne( {movieId: movieId});

    if (findResult != null) throw "Error: movie exists in showtimes collection";

    const obj = {
        movieId: movieId,
        theaters: [
            // {
            //     theaterId: theaterId,
            //     screens: [{
            //             screenNo: 1,
            //             shows: [
            //                 {
            //                     showTime: new Date(),
            //                     price: 10,
            //                     availability: {}
            //                 }
            //             ]
            //     }]
            // }
        ]
    }

    const insertInfo = await showtimes.insertOne(obj);
    if (insertInfo.insertedCount === 0) throw 'Could not add movie to showtimes collection';
    const newId = insertInfo.insertedId;

}

async function addTheaterForMovie(movieId, theaterId) {

    const showtimes = await showtimesCollection();

    const movie = await showtimes.findOne( {movieId: movieId});
    if (movie === null) throw "Error: movie not in showtimes collection";

    const theater = await showtimes.findOne({ "movieId": movieId, "theaters.theaterId": theaterId });
    if (theater != null) throw "Error: theater exists for this movie";

    const addTheater = await showtimes.updateOne({"movieId": movieId},
        {
            "$push": {
                "theaters": {
                    theaterId: theaterId,
                    screens: []
                }
            }
        });

    //check updated or not
}

async function addScreens(movieId, theaterId, screenNo) {

    const showtimes = await showtimesCollection();

    const movie = await showtimes.findOne( {movieId: movieId});
    if (movie === null) throw "Error: movie not in showtimes collection";

    const theater = await showtimes.findOne({ "movieId": movieId, "theaters.theaterId": theaterId});
    if (theater === null) throw "Error: theater doesn't exists for this movie";

    const addScreen = await showtimes.updateOne({ "movieId": movieId, "theaters.theaterId": theaterId },
        {
            "$push": {
                "theaters.$.screens": {
                    screenNo: screenNo,
                    shows: []
                }
            }
        });
}

async function addToSmallScreen(movieId, theaterId, screenNo) {

    const showtimes = await showtimesCollection();

    const movie = await showtimes.findOne( {movieId: movieId});
    if (movie === null) throw "Error: movie not in showtimes collection";

    const theater = await showtimes.findOne({ "movieId": movieId, "theaters.theaterId": theaterId});
    if (theater === null) throw "Error: theater doesn't exists for this movie";

    const addScreen = await showtimes.updateOne(
        {
            "movieId": movieId,
            "theaters.theaterId": theaterId,
            "theaters.screens.screenNo": screenNo
        },
        {
            "$push": {
                "theaters.$[i].screens.$[j].shows": {
                    showTime: new Date(),
                    price: 10,
                    availability: {}
                }
            }
        },
        {
            arrayFilters: [{
                "i.theaterId": theaterId
            }, {
                 "j.screenNo": screenNo
                }]
        }
        );
}

async function addToMidScreen(movieId, theaterId, screenNo) {

}

async function addToBigScreen(movieId, theaterId, screenNo) {

}

module.exports = {
    createMovieShowTime, addTheaterForMovie, addScreens, addToSmallScreen
}