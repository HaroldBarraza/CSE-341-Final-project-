const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ObjectId } = require('mongodb'); // Importa ObjectId

let database;

const intDb = (callback) => {
    if (database) {
        console.log('Database is already initialized');
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
        database = client.db('Final_Project'); // Asegúrate de usar el nombre correcto de tu base de datos
        callback(null, database);
    })
    .catch((err) => {
        callback(err);
    });
};

const getdataBase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = { intDb, getdataBase, ObjectId }; // Exporta ObjectId