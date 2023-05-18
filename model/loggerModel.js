const { json } = require("express");

const logSchema = new mongoose.Schema({
  level: String,
  message: json,
  timestamp: Date,
});

const loggerModel = mongoose.model('Log', logSchema);

function model() {
    return loggerModel;
}

module.exports = {
    model
}