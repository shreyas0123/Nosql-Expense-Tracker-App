const mongoose = require("mongoose");

const mongodb = async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test"); //27017 default port number and test is default database name
};
module.exports = mongodb;