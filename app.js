const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongodb = require('./util/database');
//expenseDetails: This is a middleware function that you have defined in another file (probably ./routes/addexpense)
// Middleware functions are often used to handle specific aspects of the request-response cycle, such as route handling, authentication, error handling, etc.
const expenseDetails = require('./routes/addexpense');
const signupORDetails = require('./routes/signupORlogin');
const purchasePremium = require('./routes/purchase-mebership');
const premium_leaderBoard = require('./routes/premium');
const password = require('./routes/forgotpassword');
const helmet = require('helmet'); //it will provide essential http headers
const compression = require('compression'); //it used to reduce the size of an front end files such as expense.js,css etc
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

require("dotenv").config(); // Load environment variables from .env file

// creating an instance of an Express application
const app = express();

app.use(cors());
app.use(bodyparser.json());
// you are adding a middleware function named expenseDetails to your Express application's middleware stack
//app.use() will be executed for every incoming request.
app.use(expenseDetails);
app.use(signupORDetails);
app.use(purchasePremium);
app.use(premium_leaderBoard);
app.use(password);

const accessLogStream = fs.createWriteStream(path.join(__dirname,"request.log"),{flags:"a"})

app.use(helmet());
app.use(compression());
//morgan package is used to log http request and we are creating file called "request.log" in order to store the http request
app.use(morgan('combined', {stream:accessLogStream}));

mongodb()
  .then((respose) => {
    console.log(`database is connected to mongodb`);
    app.listen(3000, console.log(`listening on port 3000`));
  })
  .catch((err) => console.log(err));

