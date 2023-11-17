const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    ispremiumUser:{
        type:Boolean,
        required:false
    },
    totalExpense:{
        type:Number,
        default:0
    },
    expenses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Expense"
        }
    ],
    forgotPassword:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"forgotpassword"
        }
    ],
    order:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ],

})
const user = mongoose.model('User',userSchema);
module.exports = user;
