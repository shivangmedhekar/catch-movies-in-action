const mongoCollections = require('./../config/mongoCollections');
const axios = require("axios");
const theaters = mongoCollections.theaters;

async function getAllTheaters() {

    const url = `https://api.amctheatres.com/v2/theatres?state=new-york&city=new-york`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': '3E9F23B5-8BE9-4DD1-854D-204A9F3138FB'
        }
    });
    const theatersData = data._embedded.theatres;
    let theaters = [];
    for (let theater of theatersData){

        theaters.push({
            id: theater.id,
            name: theater.name,
            slug: theater.slug
        })
    }
    return theaters
}

async function getTheaterById(theaterId) {
    console.log(theaterId)
    const url = `https://api.amctheatres.com/v2/theatres/${theaterId}`;
    const { data } = await axios.get(url, {
        headers: {
            'X-AMC-Vendor-Key': '3E9F23B5-8BE9-4DD1-854D-204A9F3138FB'
        }
    });
    const theater = {
        theaterId: data.id,
        theaterName: data.longName,
        slug: data.slug
    }
    return theater
}

async function getTheaterNameById(theaterId) {

    /*------------ Error Handling Start ------------*/
    if (arguments.length < 1) throw "Error: less parameters passed then required";
    if (typeof theaterId !== 'string') throw 'Error: theaterId not of type string';
    if (theaterId.length !== 7) throw 'Error: theaterId invalid';
    /*------------ Error Handling End ------------*/

    const theaterCollection = await theaters();

    const findResult = await theaterCollection.findOne({ theaterId: theaterId }, {projection:  { _id: 0, theaterName: 1 }});
    const theaterName = findResult.theaterName;
    return theaterName;
}

module.exports = {
    getTheaterNameById, getAllTheaters, getTheaterById
}