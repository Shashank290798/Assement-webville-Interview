const express= require('express');

const app =express();

const cors = require('cors');

const bodyParser =require('body-parser');

const sequelize = require('./utils/database');

const userRoutes = require('./routes/route');

const customer = require('./models/customer');

app.use(cors());

app.use(bodyParser.json());

app.use(userRoutes);

// using below user can logout and locate to home page

// const logout= document.getElementById('logout')
// logout.addEventListener('onClick',(e)=>{
//     window.location="home.html"
// })
  

sequelize
.sync()
.then(result =>{
    app.listen(3000);
    console.log("Server started on Port 3000")
})
.catch(err =>{
    console.log(err)
})
