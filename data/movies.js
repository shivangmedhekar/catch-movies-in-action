const mongoCollections = require('./../config/mongoCollections');
const movies = mongoCollections.movies;

const axios = require('axios');

const X_AMC_VENDOR_KEY = process.env.X_AMC_VENDOR_KEY
const tmdbAPIkey = process.env.TMDB_API_KEY;
const omdbAPIkey = process.env.OMDB_API_KEY;

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

async function getMovieNameById(movieId) {

    /*------------ Error Handling Start ------------*/
    if (arguments.length < 1) throw "Error: less parameters passed then required";
    if (typeof movieId !== 'string') throw 'Error: movieId not of type string';
    if (movieId.length !== 10) throw 'Error: movieId invalid';
    /*------------ Error Handling End ------------*/

    const movieCollection = await movies();

    const findResult = await movieCollection.findOne({ movieId: movieId}, {projection:  { _id: 0, movieName: 1 }});
    const movieName = findResult.movieName;
    return movieName;
}

async function getTopMovies(){

    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbAPIkey}&language=en-US&page=1`;
    const { data } = await axios.get(url);

    const movies = data.results;

    const sortMovies = movies.sort(function (a, b) {
        return a.popularity - b.popularity;
    })
    // console.log(sortMovies.reverse());
    const topMovies = sortMovies.reverse().slice(0,6);
    let topMovieTitles = [];
    let topMovieShowcase = [];

    for (let movie of topMovies){
        let movieObj = {
            movieName: movie.original_title,
            backdrop_path: movie.backdrop_path,
        }
        topMovieShowcase.push(movieObj);
        topMovieTitles.push(movie.original_title);
    }

    return topMovieShowcase;
}

async function getMovieBySlug(slug){

    const movieCollection = await movies();

    const findResult = await movieCollection.findOne({ slug: slug });
    //check findresult
    const movieName = findResult;

    return movieName;
}


async function getNowPlayingMovies(){

    // const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
    // const { data } = await axios.get(url);

    const url = `https://api.amctheatres.com/v2/movies/views/now-playing`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': X_AMC_VENDOR_KEY
        }
    });
    // error handling required
    const moviesData = data._embedded.movies;

    let nowPlayingMovies = [];
    let movieObj;
    for (let movie of moviesData){

        if (! movie.imdbId) {
            const searchTerm = movie.name.split(' ').join('+');

            const url = `http://www.omdbapi.com/?apikey=${omdbAPIkey}&t=${searchTerm}`;
            const { data } = await axios.get(url);
            movie.imdbId = data.imdbID;
        }

        nowPlayingMovies.push(
            {
                amcId: movie.id,
                imdbId: movie.imdbId,
                movieName: movie.name,
                slug: movie.slug,
                hasScheduledShowtimes: movie.hasScheduledShowtimes
            }
        )
    }

    await updateMoviesDB(nowPlayingMovies);
    return nowPlayingMovies;
}

async function updateMoviesDB(nowPlayingMovies) {

    const movieCollection = await movies();

    const findResult = await movieCollection.find().toArray();
    let movieDBIds = [];
    let amcIds = [];

    for (let movie of findResult){
        movieDBIds.push(movie.amcId)
    }
    for (let movie of nowPlayingMovies){
        amcIds.push(movie.amcId)
    }

    const setA = new Set(movieDBIds)
    const setB = new Set(amcIds)
    const moviesToAdd = difference(setB, setA);
    const moviesToUpdate = difference(setA, setB);

    for (let movie of nowPlayingMovies){

        if (moviesToAdd.has(movie.amcId)) {
            const insertQuery = await movieCollection.insertOne(movie);
        }
    }

    for (let movie of moviesToUpdate){
        const updateQuery = await movieCollection.updateOne({amcId: movie},
            { $set: {hasScheduledShowtimes: false }}
        );
    }
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}


module.exports = {
    getAllMovies, getMovieById, getMovieNameById, getTopMovies, getNowPlayingMovies, getMovieBySlug
}