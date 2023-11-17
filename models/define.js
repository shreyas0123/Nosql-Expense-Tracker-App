const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    expens:{
        type:Number,
        required:true
    },
    descript:{
        type:String,
        required:true
    },
    categ:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
})

const expense = mongoose.model("Expense",expenseSchema);
module.exports = expense;