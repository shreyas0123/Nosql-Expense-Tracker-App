const expensesPreferenceDropdown = document.getElementById('expensesPreference');
/****************************** pagination ***********************/
// This function generates and displays pagination buttons based on the provided information
function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
  }) {
    // Get the button container element with the ID 'pagination'
    const button = document.getElementById('pagination');
  
    // Create an array to store the HTML content of the pagination buttons
    let buttonsHTML = [];
  
    // If there's a previous page, add a "Previous Page" button
    if (hasPreviousPage) {
      console.log("hasPreviousPage"); // Logging for debugging
      buttonsHTML.push(`<button class="btn btn-dark" onclick="showExpense(${previousPage})">Previous Page</button>`);
    }
  
    // If there's a next page, add a "Next Page" button
    if (hasNextPage) {
      console.log("hasNextPage"); // Logging for debugging
      buttonsHTML.push(`<button class="btn btn-dark" onclick="showExpense(${nextPage})">Next Page</button>`);
    }
  
    // Set the inner HTML of the 'pagination' container to the joined buttons HTML
    //inside the buttton i need to show msg previousPage or nextPage
    //hasPreviousPage and hasNextPage holds boolean value
    button.innerHTML = buttonsHTML.join(' ');
  }
  
  async function showExpense(page) {
    try {
        // Retrieve the user's authentication token from local storage
        const token = localStorage.getItem("token");

        // Retrieve the user's selected expense preference from local storage
        const expensePreference = localStorage.getItem('expensesPreference');

        // Calculate the number of expenses to display per page (page size)
        const pageSize = expensePreference ? parseInt(expensePreference) : 5;

        // If the provided page number is not valid, set it to 1
        if (!page || page < 1) {
            page = 1;
        }

        // Make an asynchronous GET request to fetch expenses from the server
        const result = await axios.get(`http://localhost:3000/get-expense?page=${page}&pagesize=${pageSize}`, {
            // Include the user's authentication token in the request headers
            headers: { Authorization: token },
        });

        // Extract relevant data from the response
        const {
            currentPage,
            hasNextPage,
            nextPage,
            hasPreviousPage,
            previousPage,
            lastPage
        } = result.data;

        // Loop through the retrieved expenses and display each on the screen
        const itemListContainer = document.getElementById('listOfItems');
        itemListContainer.innerHTML = ""; // Clear existing items

        for (let i = 0; i < result.data.expenses.length; i++) {
            showUserOnScreen(result.data.expenses[i]);
        }

        // Call the showPagination function to display pagination buttons
        showPagination({
            currentPage,
            hasNextPage,
            nextPage,
            hasPreviousPage,
            previousPage,
            lastPage
        });
    } catch (err) {
        // If an error occurs during the GET request, throw an error
        console.log('error in get expense method in expensetracker.js', err);
    }
}


function saveToLocalStorage(event) {
    event.preventDefault(); //page link should not change every u refresh the page
    const expens = event.target.expense.value;
    //This line retrieves the value entered in the input field with the name 'expense' from the form.
    //It uses event.target to access the form element and .value to retrieve the entered value.
    const descript = event.target.Description.value;
    const categ = event.target.category.value;

    const obj = {
        expens,
        descript,
        categ
    }
    //post request helps to connect front to backend
    //In order make website dynamic in nature we have to use backend. crudcrud website which provides backend api for free
    //post requires object
    //axios.post it is an asynchronous event it executes after some delay
    const token = localStorage.getItem('token');
    axios.post("http://localhost:3000/add-expense", obj, { headers: { "Authorization": token } })
        //when we make an post request url along with in headers we are passing token
        //backend will recieves token and in the middleware we are dcrypting the token so we will get userId
        //from the userId you will comes to know that who is logged in
        //when we are adding the expenses what we have to do means in expense.create method just add the userId:req.user.id that's it 
        .then((response) => {
            showUserOnScreen(response.data.expensedata);
            console.log(response);
            event.target.reset();
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + '<h4> Something Went Wrong </h4>'
            console.log(err);
        })
    //localStorage.setItem(obj.descript,JSON.stringify(obj)) //obj.descript is keys and stringyfy of object is stored here
    //showUserOnScreen(obj);
    //totalExpense += expens //obj expens
    //document.getElementById('totalExpenses').textContent = totalExpense +' Rs';
}

//used do decode jwt token (how to decode jwt token in front end)
//here we are fixing bug i.e is if user purchased premium membership then if i refresh the page or premium purchased user loggedin again 
//then "Premium Purchased" text will goes off and Buy premium button will showned again this is the bug we need to fix it
//once user purchased premium then if he loggedin again or refreshes the page always show him msg Pemium Purchased instead of Buy premium button

//while creating token along with pass ispremiumUser(this is nothing but payload toekn modification) then pass this along with token to front end , in front end we will decrypt the token
//so that we comes to know which user purchased premium
//this will solves if premium user again loggedin he will show Premium purchased text only now

//when youu refresh the page if the user purchased premium then we need to show him only text premium purchased instead of buy premium button
//create token along with pass isPremium (payload modification) in premium-membership controller method
//before purchasing premium membership from decode token we can see isPremium:null after purchasing premium from decode token isPremium:true
//so token also we need to update(localStorage.setItem) in updatePremium controller method by using true

//this is code for decoding jwt code in front end  function parseJwt(token){---}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//showing saved userdetails on console where inside data you can see saved data eventhough you have refreshed the page,data wont be lost
//get does not requires object
//axios.get it is an asynchronous event it executes after some delay
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    console.log('decodeToken from front end', decodeToken)
    if (decodeToken.isPremium) {
        document.getElementById("Buypremium-button").style.visibility = "hidden";
        const purchaseHeading = document.createElement('h4');
        document.getElementById("addText").innerHTML = "<h4><strong>You are a premium user</strong></h4>";
        document.getElementById("addText").appendChild(purchaseHeading); //below "You are a premium user" text i need to display show leaderboard button
        showLeaderBoard();

        // Show the "Download Files" button
        //You are currently hiding the "Download Files" button in html file when the page loads because you want to ensure that the button is displayed below the "Show LeaderBoard" button
        document.getElementById("downloadexpense").style.display = "block";
    }
    
    showExpense();

    /*
    
    axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } })
        //when we make an get request url along with in headers we are passing token
        //backend will recieves token and in the middleware we are dcrypting the token so we will get userId
        //from the userId backend will comes to know that who's loggedin and backend get the respective user's expense from expense table
        //it send this expense as a respond back to the client

        //as we know that token is stored in localStorage we are accessing that token here using const token
        //whenever we make an get request along with request we pass token in headers as we can see above
        //now request will send to backend and in backend we need to dcrypt the token(decrypt done in middleware) so that we will get userId
        //from the userId backend comes to know that who is logged in so that backend will provide respective users expense from the database 

        .then((response) => {
            console.log(response);
            console.log('length of the response from getexpense method', response.data.getexpense.length);
            console.log('response from getexpense method', response.data.getexpense);
            for (var i = 0; i < response.data.getexpense.length; i++) { //in order to show the saved data on screen eventhough u have refreshed the page data wont be deleted from the screen.
                showUserOnScreen(response.data.getexpense[i]);
            }
        })
        .catch((err) => {
            console.log(err);
        })   */
})
//onscreen data is showing when you hit the submit button
function showUserOnScreen(obj) {
    const parentEle = document.getElementById('listOfItems');

    //parentEle.children.length === 0 means when there was no added expense length ===0 at that time only once we need to create an heading
    //while addidng the expense if condition will false so this time not creating heading

    if (parentEle.children.length === 0) {
        const heading = document.createElement('h4');
        heading.textContent = "Expense :";
        heading.style.fontSize = "35px";
        parentEle.appendChild(heading);
    }

    const childEle = document.createElement('li'); //creating li tag
    const strongEle = document.createElement('strong');
    strongEle.textContent = obj.expens + '-' + obj.descript + '-' + obj.categ + '-';
    childEle.appendChild(strongEle);
    parentEle.appendChild(childEle) //in order show on screen


// This function is called when the user selects a different value in the expenses preference dropdown.
function saveExpensePreference(expensePreference) {
    // Save the selected expense preference value to the local storage.
    localStorage.setItem('expensesPreference', expensePreference);
    
    // After saving the preference, call the showExpense function to update the displayed expenses.
    showExpense();
}

// Add an event listener to the expenses preference dropdown.
expensesPreferenceDropdown.addEventListener('change', function () {
    // Get the selected value from the dropdown.
    const selectedValue = expensesPreferenceDropdown.value;
    
    // Call the saveExpensePreference function with the selected value.
    // This will update the preference in the local storage and refresh the displayed expenses.
    saveExpensePreference(selectedValue);
});


    const delButton = document.createElement('input');
    delButton.type = "button";
    delButton.value = "Delete";
    delButton.classList.add("btn", "btn-danger"); // Use classList.add() to add classes
    childEle.append(delButton); //in order show del button on screen

    //when u click the del button parent ele,li tag also deleted from screen as well as local storage
    delButton.onclick = () => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:3000/delete-expense/${obj._id}`, { headers: { "Authorization": token } })
            //when we make an delete request url along with in headers we are passing token
            //backend will recieved token and in the middleware we are dcrypting the token so we will get userId
            //in expense.destroy where we also pass userId:req.user.id
            //i cannot delete others added expenses in the app,they also not able to delete my added expenses
            //if u want to check this means expense.finAll() keep it like this only so we can get all added expenses
            .then((response) => {
                parentEle.removeChild(childEle)
            })
            .catch((err) => {
                console.log(err);
            })
        //localStorage.removeItem(obj.descript);
        //parentEle.removeChild(childEle)
        //totalExpense -= obj.expens;
        //document.getElementById('totalExpenses').textContent = totalExpense +' Rs';
    }
    /*
    //creating edit button
    const editButton = document.createElement('input');
    editButton.type = "button";
    editButton.value = "Edit";
    childEle.append(editButton); //in order to show edit button on screen

    //when you click the edit button u are able to edit the changes
    editButton.onclick = () => {
        axios.delete(`http://localhost:700/delete-expense/${obj.id}`)
            .then((response) => {
                parentEle.removeChild(childEle)
            })
            .catch((err) => {
                console.log(err);
            })
        //localStorage.removeItem(obj.descript);
        //parentEle.removeChild(childEle);
        document.getElementById('expense').value = obj.expens;
        document.getElementById('Description').value = obj.descript;
        document.getElementById('category').value = obj.categ;  //go through this code.

    } */

}
/***************add premium membeship *************/

//i have used token because backend needs to know who is going purchase the membership for eg:thanush or shivan
document.getElementById("Buypremium-button").onclick = async (e) => {
    try {

        // When the "Buy Premium" button is clicked, this function will be executed.
        // The 'async' keyword is used to indicate that this function contains asynchronous code.

        // Retrieve the token from local storage. It is used to authorize the user.
        const token = localStorage.getItem("token");

        // Make a GET request to the server to fetch premium membership details.
        const resource = await axios.get("http://localhost:3000/premium-membership", { headers: { "Authorization": token } });

        // Log the fetched data for debugging purposes.
        console.log(resource.data.key_id);
        console.log(resource.data.order.id);

        // Prepare the options for the Razorpay payment.
        //here key_id,order.id im recieving from backend while logged in backend connect to razorpay so orderId created initially before payment,key_id we got while reating razorpya account
        //those we need to send as response to the fron end hence front end will use these for proceeding with payment
        let option = {
            "key": resource.data.key_id, // The Razorpay key provided by the server.
            "order_id": resource.data.order.id, // The unique order ID generated by the server.

            // The "handler" is a callback function that will be executed when the payment is successful.
            "handler": async function (res) {
                // The 'res' object contains the details of the successful payment, including the payment ID.

                // Send a POST request to the server to update the transaction status with the payment details.
                const data = await axios.post("http://localhost:3000/updateTransactionStaus", {
                    "order_id": option.order_id, // Pass the order ID to identify the transaction.
                    "payment_id": res.razorpay_payment_id // Pass the payment ID received from Razorpay.
                }, { headers: { "Authorization": token } }); // Include the token in the request headers for authorization.

                // If the server responds with a success message, it means the payment was successful.

                alert("payment successfully done"); // Show an alert to notify the user of the successful payment.
                document.getElementById("Buypremium-button").style.visibility = "hidden"
                document.getElementById("addText").innerHTML = "<strong>Premium purchased</strong>";
                localStorage.setItem("token", data.data.token)
            },
        };
        // Create a new instance of Razorpay with the prepared options.
        const raz1 = new Razorpay(option);

        // Open the Razorpay payment window.
        raz1.open();

        // Prevent the default click event to avoid any unexpected behavior.
        e.preventDefault();


        // Handle the case when the payment fails.
        raz1.on("payment.failed", async function () {
            try {
                // If the payment fails, try to retrieve the order ID from the fetched data.
                const key = resource.data.order.id;

                // Send a POST request to the server to update the transaction status with the payment failure details.
                const response = await axios.post("http://localhost:3000/updateTransactionStaus", {
                    "order_id": key, // Pass the order ID to identify the transaction.
                    "payment_id": null // Set the payment ID to null since the payment failed.
                }, { headers: { "Authorization": token } });

                // Show an alert to notify the user of the payment failure.
                alert(response.data.message)
            } catch (error) {
                console.log('error in payment section', error);
            }
        });
    } catch (error) {
        console.log('error in razorpay frontend', error);
    }
}

/***********************leaderBoard feature---premium membership****************/
//Steps in front end:
//show the leaderboard Button - Dom manipulations
//when you click on this button make a api call 
//you will get data(response) in sorted order from backend
//do Dom manipulation to show the data on the frontend

// Define an asynchronous function called showLeaderBoard
//when user purchased premuim membership we show him an extra features like when he click on show leaderboard button he can see all users name, total expnese
async function showLeaderBoard() {
    try {
        // Create a new button element for the leaderboard
        const buttonLeaderBoard = document.createElement('input');
        buttonLeaderBoard.type = "button"
        buttonLeaderBoard.classList.add("btn","btn-warning");
        buttonLeaderBoard.value = "Show LeaderBoard"
        buttonLeaderBoard.id = "leaderBoardButton";

        // Append the button to the 'addText' element in the DOM
        document.getElementById('addText').appendChild(buttonLeaderBoard);

        // Add an onclick event listener to the button
        buttonLeaderBoard.onclick = async function (e) {
            // Prevent the default behavior of the button click (avoid page reload)
            e.preventDefault();

            // Get the authorization token from local storage
            const token = localStorage.getItem('token');

            // Send an asynchronous GET request to the server's "leaderboard" endpoint
            const response = await axios.get("http://localhost:3000/leaderboard", { headers: { "Authorization": token } });

            // Log the server response to the console
            console.log(response);

            // Get the 'LeaderBoard' element from the DOM
            const leaderBoardEle = document.getElementById('LeaderBoard');

            // Set the inner HTML of 'LeaderBoard' element to include a heading
            leaderBoardEle.innerHTML = `<h1>Leader Board :</h1>`

            // Iterate over the response data (leaderboard data received from the server)
            response.data.forEach(ele => {
                // Check if the 'total_amount' property is null and set it to 0 if null
                /*if (ele.totalExpense === null) {
                    ele.totalExpense = 0;
                }*/

                // Append the leaderboard data to the 'LeaderBoard' element's inner HTML
                leaderBoardEle.innerHTML = leaderBoardEle.innerHTML + `<li><strong>Name:</strong><strong>${ele.name}</strong>,<strong>Total_Amount:</strong><strong>${ele.totalExpense}</strong></li>`;
                //where totalExpense is the user table newly added column for final leaderboard optimisation
            });
        }

    } catch (err) {
        // Catch any errors that occur during the execution of the function
        console.log('error in leaderBoard front end', err);
    }
}
/********************download premium feature **********************/


async function download() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3000/download', { headers: { "Authorization": token } })
        //when you click on download file button backend is sending responses along with fileurl to the front end
        // and file will be automatically gets downloaded to the local disk
        //  which if we open in browser, the file would download

        var a = document.createElement("a");// Create an <a> element to simulate a click action for downloading the file
        a.href = response.data.fileURL; //backend is sending responses along with fileurl and a.href means creating anchor tag for fileurl
        //a.download = 'myexpense.csv';
        a.click();

    }
    catch (err) {
        console.log('error from download frontend', err);
    };
}

