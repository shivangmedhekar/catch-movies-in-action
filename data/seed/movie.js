const mongoCollections = require('./../../config/mongoCollections');
const movies = mongoCollections.movies;
// const {ObjectId} = require("mongodb");
const { nanoid, customRandom, urlAlphabet} = require('nanoid');
const seedrandom = require("seedrandom");


async function addMovie() {
    const movieCollection = await movies();
    const movieName = "The Matrix Resurrections";

    const seedrandom = require('seedrandom')
    const { customRandom, urlAlphabet } = require('nanoid');
    const rng = seedrandom(movieName);
    const nanoid = customRandom(urlAlphabet, 7, size => {
        return (new Uint8Array(size)).map(() => 256 * rng())})
    const movieId = nanoid();
    const findResult = await movieCollection.findOne( {movieId: movieId});

    if (findResult != null) throw "Error: Theater with same name exists";

    const newMovie = {
        movieId: movieId,
        movieName: movieName
    };

    const insertInfo = await movieCollection.insertOne(newMovie);
    if (insertInfo.insertedCount === 0) throw 'Could not add Movie';
    const newId = insertInfo.insertedId;

    // const addedMovie = await this.get(newId.toString());
    // console.log(addedMovie);
}

module.exports = {
    addMovie
}