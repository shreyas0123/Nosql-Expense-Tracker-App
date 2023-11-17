const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentId:{
        type:String,
        default:null
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Order = mongoose.model("Order",orderSchema); 
module.exports = Order;

