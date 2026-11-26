const mongoose = require("mongoose");

let connection; // reused between requests

const connectDB = () => {
  if (!connection) {
    connection = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => {
        connection = null; // allow a retry on the next request
        throw err;
      });
  }
  return connection;
};

module.exports = connectDB;