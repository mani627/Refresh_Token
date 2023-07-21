require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const datas = require("./Datas")
const jwt = require('jsonwebtoken');
const Auth=require("./Auth")

// /Middleware
app.use(express.json());


console.log("sec");

// Login
app.post('/Login', (req, res) => {
    try {
        const Exist = datas.filter(e => e.username === req.body.username).length;
        console.log(Exist);
        if (Exist !== 0) {
            const token = jwt.sign({ id: req.body.username }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })

            const refresh_token = jwt.sign({ id: req.body.username }, process.env.JWT_SECRET, {
                expiresIn: '10m'
            })
            res.cookie('refreshToken', refresh_token, { httpOnly: true, 
                sameSite: 'None', secure: true, 
                maxAge: 42*24 * 60 * 60 * 1000 });

            res.send({
                token: token,
                mssg: "Successfully logged in"
            })
        } else {
            res.send("User Not Exist")
        }
    } catch (er) {
        next(new Error(er))
    }



})



// Add user by Admin
app.post('/Adding_User', Auth,(req, res) => {
   
    try {
        res.send({
            accesstoken:req?.refreshtoken,
            mssg:"new acces token created",
            JWT_verified_By:res.JWT_result

        })
        // const Exist = datas.filter(e => e.username === req.body.username).length;
        
        // if (Exist !== 0) {
        //     const token = jwt.sign({ id: req.body.username }, process.env.JWT_SECRET, {
        //         expiresIn: process.env.JWT_EXPIRES_IN
        //     })

        //     res.send({
        //         token: token,
        //         mssg: "Successfully logged in"
        //     })
        // } else {
        //     res.send("User Not Exist")
        // }
    } catch (er) {
        next(new Error(er))
    }



})



// Error Handler
app.use((err, req, res, next) => {

    if (err) {
        res.send({
            status:err.Actual_Error.status||500,
            mssg:err.Actual_Error.message+" "+err.Custom_Error,

        })
    }

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})