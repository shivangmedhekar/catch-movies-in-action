const mongoCollections = require('./../config/mongoCollections');
const orders = mongoCollections.orders;
const showtimes = mongoCollections.showtimes;

async function checkout(orderSummary){

    const ordersCollection = await orders();
    let orderInsert = await ordersCollection.insertOne(orderSummary);
    await updateMovieAvailability(orderSummary.showtimeId, orderSummary.seats)
    return
}

async function updateMovieAvailability(showtimeId, seats){

    const showtimesCollection = await showtimes();
    console.log('here')
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