const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require("uuid");

const forgotpasswordSchema = new Schema({
    isactive: {
        type: Boolean,
        required: true
    },
    id: {
        type: String, // Change this to String
        default: () => uuid.v4()
    }
});

const forgotpassword = mongoose.model("forgotpassword", forgotpasswordSchema);
module.exports = forgotpassword;
