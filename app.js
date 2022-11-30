require('dotenv').config()
require("./config/database").connect();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')

//custom middleware
const auth = require("./middleware/auth")


//import model - user
const User = require("./model/user")

const app = express();
//go to express documentation => basic routing => req.body

//middleware => whenevr we want to extract/use some information from req.body
app.use(express.json()) //grabs the JSON or send the JSON
app.use(express.urlencoded({extended:true}));
app.use(cookieParser()) //pre-defined middlewares which takes control and help us to grab the cookies


//routes
app.get("/",(req, res)=>{
    res.send("Hello ...")
})

//register
app.post("/register", async (req, res)=>{
   try{
        //collect all information
        const {firstName, lastName, email, password} = req.body;

        //validate data if it exists
        if(!(email && password &&  firstName && lastName)){
           console.log("Missing requied fields");
           res.status(401).send("All fields required..")
        }

      //check if user exists
        let existingUser = await User.findOne({email: email})
            if(existingUser)
            {
               res.status(401).send("User is already in the database");
            }
      //TODO: check email is in correct format

          //encryption of password
          const encryptedPass = await bcrypt.hash(password,10);

          //create a new Entry in Database
         const newUser = await User.create({
                                 firstname : firstName,
                                 lastname : lastName,
                                 email : email,
                                 password : encryptedPass
                              })
       
          //create a token and send it to user
        const token =  jwt.sign({
            id : newUser._id //passing id in the payload to differentaite tokens of respective user
          }, 'shhhhh', {expiresIn: '2h'})
       
      
       //adding one more key to our userr
        newUser.token = token
       //dont wanna send the original pass
        newUser.password = null

        res.status(201).json(newUser)

   }catch(err){
       console.log(err);
       console.log("Error in response route!!!");
   }
   console.log(req.body);
})

//login route
app.post("/login", async (req, res)=> {
 /*ToDo: 1. Collect the information from frontend
         2. validate 
         3. check if user exists in database
         4. match the password
         5. create token and send */
    
         //collect info
    try{
        const {email, password} = req.body
         
         //validate
        if(!(email && password)){
          res.status(401).send("Email and password is required!!!")
        }
       
        //check if exists in DB
       const user = await User.findOne({email})
        if(!user){
         res.status(400).send("User doesn't exists!!!!")
        }

        //match the password
        if(user && (await bcrypt.compare(password, user.password))) {

          const token = jwt.sign({id: user._id, email}, 'shhhhh', {expiresIn: '2h'})
          
          //just in case you are sending user to frontend and dont wanna send the password and token 
          user.password = null;
          user.token = null;

          //creating a cookie and send it too browser
          const options = {
            expires  : new Date(Date.now() + 3*24*60*60*1000),
            httpOnly : true
            //this is for 3 days
          }
          
          res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
          })

        }
   
        res.status(400).send("Email or pass incorrect!!!")
    }
      catch(err){
      console.log("Erorrr!!!1");
      }
        
       

})

//dashboard 

app.get("/dashboard", auth, (req, res) => {
    res.status(201).send("Welcome to the dashboard")
})

app.get("/profile", (req, auth, res) => {
  //if auth gets successfully executed we will be having the req.user


  res.status("Welcome to the profile")
})



module.exports = app;