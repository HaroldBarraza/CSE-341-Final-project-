const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const intDb = (callback) =>{
    if(database){
        console.log('Data base is already')
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
        database = client;
        callback(null, database);
    })
    .catch((err) => {
        callback(err);
    })
}
const getdataBase = () =>{
    if(!database){
        throw Error ('Database not initialized');
    }
    return database;
}

module.exports = {intDb, getdataBase};