const MongoClient = require('mongodb').MongoClient;

const settings = {
    "mongoConfig": {
        "serverUrl": process.env.ATLAS_SERVER_URL,
        "database": process.env.ATLAS_DATABASE
    }
}

const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
}

