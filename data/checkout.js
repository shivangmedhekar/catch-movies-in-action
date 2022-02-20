const mongoCollections = require('./../config/mongoCollections');
const orders = mongoCollections.orders;
const showtimes = mongoCollections.showtimes;

async function checkout(orderSummary, user){

    const ordersCollection = await orders();
    orderSummary.userId = user.userId;
    if (! await checkSeatsAvailability(orderSummary.showtimeId, orderSummary.seats)) throw 'Error: Seats Unavailable'

    let orderInsert = await ordersCollection.insertOne(orderSummary);

    await updateMovieAvailability(orderSummary.showtimeId, orderSummary.seats);

    return orderSummary;
}



async function checkSeatsAvailability(showtimeId, seats){

    const showtimesCollection = await showtimes();

    let showtimeObj = await showtimesCollection.findOne({showtimeId: showtimeId});
    console.log(showtimeObj);
    for (let seat of seats){
        if (showtimeObj.availability[seat]) return false;
    }
    return true;
}

async function updateMovieAvailability(showtimeId, seats){

    const showtimesCollection = await showtimes();

    let showtimeObj = await showtimesCollection.findOne({showtimeId: showtimeId});
    console.log(showtimeObj);
    for (let seat of seats){
        showtimeObj.availability[seat] = 1
    }
    let updateQuery = await showtimesCollection.updateOne({showtimeId: showtimeId},
        {$set: { availability:  showtimeObj.availability }})

}

module.exports = {
    checkout
}