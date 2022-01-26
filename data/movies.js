const axios = require('axios');

const mongoCollections = require('./../config/mongoCollections');
const movies = mongoCollections.movies;

const X_AMC_VENDOR_KEY = process.env.X_AMC_VENDOR_KEY
const tmdbAPIkey = process.env.TMDB_API_KEY;
const omdbAPIkey = process.env.OMDB_API_KEY;
const imdbId = require('imdb-id');

async function getAllMovies(){

    /*------------ Error Handling Start ------------*/
    if (arguments.length) throw "Error: more parameters passed then required";
    /*------------ Error Handling End ------------*/

    const movieCollection = await movies();

    let movieListDB = await movieCollection.find({}).toArray();

    // error handling

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

async function insertMovieToDB(amcId) {

}

async function getMovieBySlug(slug){

    const url = `https://api.amctheatres.com/v2/movies/${slug}`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': X_AMC_VENDOR_KEY
        }
    });
    if (data.errors) throw 'Error: Movie not found';

    const movieCollection = await movies();
    const movie = await movieCollection.findOne({ slug: slug });

    movie.runTime = data.runTime;
    movie.genre = data.genre
    movie.hasScheduledShowtimes = data.hasScheduledShowtimes;
    movie.onlineTicketAvailabilityDateUtc = data.onlineTicketAvailabilityDateUtc;
    movie.earliestShowing = new Date(data.earliestShowingUtc);

    if(data.synopsis)
        movie.synopsis = data.synopsis.replace(/'/g, '/quote');
    else movie.synopsis = '';

    if (data.mpaaRating)
        movie.mpaaRating = data.mpaaRating

    movie.movieName = movie.movieName.replace(/'/g,'/quote');

    return movie;
}

async function getUpcomingMovies(pageSize){

    /*------------ Error Handling Start ------------*/

    if (arguments.length < 1) throw 'Error: less arguments passed';
    if (!pageSize) throw 'Error: pageSize not passed';
    if (typeof pageSize != 'number') throw 'Error: pageSize not of type number';

    /*------------ Error Handling End ------------*/

    const url = `https://api.amctheatres.com/v2/movies/views/coming-soon?page-size=${pageSize}`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': X_AMC_VENDOR_KEY
        }
    });

    // Error Handling
    if (data.errors) throw "Error: AMC Server not responding";

    const amcNowPlayingMovies = data._embedded.movies;

    const movieCollection = await movies();
    const moviesData = await movieCollection.find({}).project({_id:0}).toArray();

    let moviesHashTableDb = {};
    for (let movie of moviesData){
        moviesHashTableDb[movie.amcId] = movie
    }
    let backdrop, poster;
    let upcomingMovies = [];
    for (let movie of amcNowPlayingMovies){

        if (moviesHashTableDb[movie.id]) upcomingMovies.push(moviesHashTableDb[movie.id]);

        else {
            try{
                if (!movie.imdbId) movie.imdbId = await imdbId(movie.name);

                const url = `https://api.themoviedb.org/3/find/${movie.imdbId}?api_key=${tmdbAPIkey}&external_source=imdb_id`;
                const { data } = await axios.get(url);


                if (data['movie_results'].length){
                    backdrop = data['movie_results'][0].backdrop_path;
                    poster = data['movie_results'][0].poster_path;
                }

            }catch (e) {
                continue;
            }



            const insertQuery = await movieCollection.insertOne({
                amcId: movie.id,
                imdbId: movie.imdbId,
                movieName: movie.name,
                slug: movie.slug,
                releaseDate: new Date(movie.releaseDateUtc),
                backdrop: backdrop,
                poster: poster,
            });

            const InsertedMovie = await movieCollection.findOne({ amcId: movie.id }, {_id:0});
            InsertedMovie.genre = movie.genre;
            InsertedMovie.mpaaRating = movie.mpaaRating;
            InsertedMovie.runTime = movie.runTime;

            upcomingMovies.push(InsertedMovie);
        }
    }

    for (let movie of upcomingMovies){
        movie.movieName = movie.movieName.replace("'", '/qoute');
    }
    return upcomingMovies;
}


async function getNowPlayingMovies(pageSize){

    /*------------ Error Handling Start ------------*/

    if (arguments.length < 1) throw 'Error: less arguments passed';
    if (!pageSize) throw 'Error: pageSize not passed';
    if (typeof pageSize != 'number') throw 'Error: pageSize not of type number';

    /*------------ Error Handling End ------------*/

    const url = `https://api.amctheatres.com/v2/movies/views/now-playing?page-size=${pageSize}`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': X_AMC_VENDOR_KEY
        }
    });

    // Error Handling
    if (data.errors) throw "Error: AMC Server not responding";

    const amcNowPlayingMovies = data._embedded.movies;

    const movieCollection = await movies();
    const moviesData = await movieCollection.find({}).project({_id:0}).toArray();

    let moviesHashTableDb = {};
    for (let movie of moviesData){
        moviesHashTableDb[movie.amcId] = movie
    }

    let nowPlayingMovies = [];
    for (let movie of amcNowPlayingMovies){
        let backdrop, poster
        if (moviesHashTableDb[movie.id]) {

            moviesHashTableDb[movie.id].genre = movie.genre;
            moviesHashTableDb[movie.id].mpaaRating = movie.mpaaRating;
            moviesHashTableDb[movie.id].runTime = movie.runTime;
            nowPlayingMovies.push(moviesHashTableDb[movie.id]);
        }

        else {
            try{
                if (!movie.imdbId) movie.imdbId = await imdbId(movie.name);
                const url = `https://api.themoviedb.org/3/find/${movie.imdbId}?api_key=${tmdbAPIkey}&external_source=imdb_id`;
                const { data } = await axios.get(url);


                if (data['movie_results'].length){
                    poster = data['movie_results'][0].poster_path;
                    backdrop = data['movie_results'][0].backdrop_path;
                }
            }
            catch ( e ){ continue; }

            const insertQuery = await movieCollection.insertOne({
                amcId: movie.id,
                imdbId: movie.imdbId,
                movieName: movie.name,
                slug: movie.slug,
                releaseDate: new Date(movie.releaseDateUtc),
                backdrop: backdrop,
                poster: poster,
            });

            const InsertedMovie = await movieCollection.findOne({ amcId: movie.id }, {_id:0});

            InsertedMovie.genre = movie.genre;
            InsertedMovie.mpaaRating = movie.mpaaRating;
            InsertedMovie.runTime = movie.runTime;

            nowPlayingMovies.push(InsertedMovie);
        }

    }


    for (let movie of nowPlayingMovies){
        movie.movieName = movie.movieName.replace("'", '/qoute');
    }

    const latestReleases = nowPlayingMovies.sort(function(a,b){
        return new Date(b.releaseDate) - new Date(a.releaseDate);
    }).slice(0, 5);

    return [nowPlayingMovies, latestReleases];
}

async function updateMoviesDB(moviesList) {

    const movieCollection = await movies();

    const findResult = await movieCollection.find().toArray();
    let movieDBIds = [];
    let amcIds = [];

    for (let movie of findResult){
        movieDBIds.push(movie.amcId)
    }
    for (let movie of moviesList){
        amcIds.push(movie.amcId)
    }

    const setA = new Set(movieDBIds);
    const setB = new Set(amcIds);
    const moviesToAdd = difference(setB, setA);

    for (let movie of moviesList){

        if (moviesToAdd.has(movie.amcId)) {
            const insertQuery = await movieCollection.insertOne(movie);
        }
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
    getAllMovies,
    getMovieById,
    getMovieNameById,
    getNowPlayingMovies,
    getMovieBySlug,
    getUpcomingMovies
}