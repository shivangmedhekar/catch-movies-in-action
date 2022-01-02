const mongoCollections = require('./../config/mongoCollections');
const movies = mongoCollections.movies;

async function getAllMovies(){

    /*------------ Error Handling Start ------------*/
    if (arguments.length) throw "Error: more parameters passed then required";
    /*------------ Error Handling End ------------*/

    const movieCollection = await movies();

    let movieListDB = await movieCollection.find({}).toArray();
    let movieList = []
    for (let movie of movieListDB) {
        movieList.push(
            {
                'movieId':movie.movieId,
                'movieName':movie.movieName
            }
        );
    }
    return movieList;
}

async function getMovieById(movieId){

    /*------------ Error Handling Start ------------*/
    if (arguments.length < 1) throw "Error: less parameters passed then required";
    /*------------ Error Handling End ------------*/

    const movieCollection = await movies();

    let movie = await movieCollection.findOne({ movieId: movieId}, {projection:  { _id: 0, movieId: 1, movieName: 1 }});

    //error handling
    return movie;
}

module.exports = {
    getAllMovies, getMovieById
}