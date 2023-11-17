const forgotButtutton = document.getElementById('forgot-button');
const email = document.getElementById('email');

forgotButtutton.addEventListener("click",forgotPassword);

async function forgotPassword(event){
    try{
        const obj = {
            email:email.value
        }
        event.preventDefault();
        const data = await axios.post("http://localhost:3000/forgot-password",obj);
        console.log(data);
        email.value="";
    }catch(error){
        console.log('error from forgot.js front end',error);
    }
}