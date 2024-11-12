const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);  // Return the existing database if it's already initialized
  }
  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      _db = client.db("contactsDB");
      callback(null, _db);  // Pass the db object to the callback
    })
    .catch((err) => {
      callback(err);  // Pass any error to the callback
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

module.exports = { initDb, getDb };  // Export both functions
