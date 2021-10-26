const { MongoClient } = require("mongodb");
const connectionString = process.env.DB_URL;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("todoapp");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};