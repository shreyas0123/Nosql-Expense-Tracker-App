const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadSchema = new Schema({
    url:{
        type:String,
        required:true
    }
})

const download = mongoose.model("download",downloadSchema);
module.exports = download;