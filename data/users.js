const mongoCollections = require('./../config/mongoCollections');
const {ObjectId} = require("mongodb");
const users = mongoCollections.users;
const orders = mongoCollections.orders;

const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createUser(firstName, lastName, email, phoneNo, dob, password, confirmPassword) {

    email = email.toLowerCase();
    const usersCollection = await users();
    const checkEmail = await usersCollection.findOne({ email: email });

    if (checkEmail) throw "Error: Account with this email exists";
    /*------------ Error Handling End -------------*/

    const hashPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNo: phoneNo,
        dateOfBirth: dob,
        password: hashPassword
    }

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add User';

    const user = await usersCollection.findOne({ email: email });
    if (!user) throw "Error: could not add user";

    user._id = String(user._id);
    return {userInserted: true, user: user};
}

async function checkUser(email, password){

    const usersCollection = await users();
    const user = await usersCollection.findOne({ email: email });

    if (!user) throw "Error: either the username or password is invalid";

    let comparePasswords = false;

    comparePasswords = await bcrypt.compare(password, user.password);

    user._id = String(user._id);
    if (comparePasswords) return {authenticated: true, user: user};

    else throw "Error: either the username or password is invalid";
}

async function getOrderHistory(userId){

    const ordersCollection = await orders();

    const orderHistory = await ordersCollection.find({userId: userId}).toArray();

    return orderHistory;

}

function isValid(str){
    return !/[~`!#@$%\^&*+=\-\[\]\\';.,/{}()[]|\\":<>\?\s]/g.test(str);
}

module.exports = {
    createUser, checkUser, getOrderHistory
}