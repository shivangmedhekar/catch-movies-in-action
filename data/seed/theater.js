const mongoCollections = require('./../../config/mongoCollections');
const theater = mongoCollections.theaters;
// const {ObjectId} = require("mongodb");
const { nanoid, customRandom, urlAlphabet} = require('nanoid');
const seedrandom = require("seedrandom");


async function addTheater() {
    const theaterCollection = await theater();
    let theaterId;

    const seedrandom = require('seedrandom')
    const { customRandom, urlAlphabet } = require('nanoid');
    const rng = seedrandom("AMC 34th Street 14");
    const nanoid = customRandom(urlAlphabet, 7, size => {
        return (new Uint8Array(size)).map(() => 256 * rng())})
    theaterId = nanoid();
    const findResult = await theaterCollection.findOne( {theaterId: theaterId});

    if (findResult != null) throw "Error: Theater with same name exists";

    const newTheater = {

        theaterId: theaterId,
        theatreName: "AMC 34th Street 14",
        location: "312 West 34th Street, New York, New York 10001",

        screens: [{

            screenNo: 1,
            screenName: "Screen 1",

            layout: [
                [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
                [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
                [1, 1, 0, 1, 1, 1, 1, 0, 1, 1]
            ],
            totalNoOfSeats: 24,
        },
            {
                screenNo: 2,
                screenName: "screen 2/IMAX",

                layout: [
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
                ],
                totalNoOfSeats: 106,
            },

            {
                screenNo: 3,

                screenName: "screen 3",

                layout: [
                    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],
                totalNoOfSeats: 56,
            },
        ],
    }

    const insertInfo = await theaterCollection.insertOne(newTheater);
    if (insertInfo.insertedCount === 0) throw 'Could not add Movie';
    const newId = insertInfo.insertedId;

    // const addedMovie = await this.get(newId.toString());
    // console.log(addedMovie);
    console.log("Theater Added");
}

module.exports = {
    addTheater
}