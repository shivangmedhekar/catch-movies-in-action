const mongoCollections = require('./../config/mongoCollections');
const {ObjectId} = require("mongodb");
const users = mongoCollections.users;
const orders = mongoCollections.orders;

const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createUser(firstName, lastName, email, phoneNo, dob, password, confirmPassword) {

    /*------------ Error Handling Start -------------*/

    if (!firstName || !lastName || !email || !phoneNo || !dob || !password || !confirmPassword) throw 'Error: All fields are required';

    if (!firstName.trim().length) throw 'Error: first name empty';
    if (!lastName.trim().length) throw 'Error: last name empty';
    if (!email.trim().length) throw 'Error: email empty';
    if (!phoneNo.trim().length) throw 'Error: phone No empty';
    if (!dob.trim().length) throw 'Error: dob empty';
    if (!password.trim().length) throw 'Error: password empty';
    if (!confirmPassword.trim().length) throw 'Error: confirm password empty';

    if (typeof firstName !== 'string') throw 'Error: firstName should be of type String';
    if (typeof lastName !== 'string') throw 'Error: lastName should be of type String';
    if (typeof email !== 'string') throw 'Error: email should be of type String';
    if (typeof phoneNo !== 'string') throw 'Error: phoneNo should be of type String';
    if (typeof dob !== 'string') throw 'Error: dob should be of type String';
    if (typeof password !== 'string') throw 'Error: password should be of type String';
    if (typeof confirmPassword !== 'string') throw 'Error: confirmPassword should be of type String';

    if(!(firstName.match(/^[a-zA-Z]+$/))) throw 'Error: Invalid first name, only alphabets allowed';
    if(!(lastName.match(/^[a-zA-Z]+$/))) throw 'Error: Invalid last name, only alphabets allowed';
    if (!ValidateEmail(email)) throw 'Error: Invalid email';
    if (!phoneNo.match(/^\d{10}$/)) throw 'Error: Invalid phone number';

    if (!Date.parse(dob)) throw 'Error: Invalid Date of Birth';

    const todaysDate = new Date();
    if (new Date(dob) - todaysDate > 0) throw 'Error: Invalid Date of Birth';

    if (password !== confirmPassword) throw 'Error: password and confirm password do not match';

    email = email.toLowerCase();
    const usersCollection = await users();
    const checkEmail = await usersCollection.findOne({ email: email });

    if (checkEmail) throw "Error: Account with this email exists";
    /*------------ Error Handling End -------------*/

    const dateOfBirth = new Date(dob);
    const hashPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNo: phoneNo,
        dateOfBirth: dateOfBirth,
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

    /*------------ Error Handling Start -------------*/

    if (!email || !password ) throw 'Error: email or password not provided';

    if (!email.trim().length) throw 'Error: email empty';
    if (!password.trim().length) throw 'Error: password empty';

    if (typeof email !== 'string') throw 'Error: email should be of type String';
    if (typeof password !== 'string') throw 'Error: password should be of type String';

    if (!ValidateEmail(email)) throw 'Error: Invalid email';

    /*------------ Error Handling End -------------*/


    const usersCollection = await users();
    const user = await usersCollection.findOne({ email: email });

    if (!user) throw "Error: Either the username or password is invalid";

    let comparePasswords = false;

    comparePasswords = await bcrypt.compare(password, user.password);

    user._id = String(user._id);
    if (comparePasswords) return {authenticated: true, user: user};

    else throw "Error: Either the username or password is invalid";
}

async function getOrderHistory(userId){

    const ordersCollection = await orders();

    const orderHistory = await ordersCollection.find({userId: userId}).toArray();

    return orderHistory;

}

function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
    return false;
}

module.exports = {
    createUser, checkUser, getOrderHistory, ValidateEmail
}