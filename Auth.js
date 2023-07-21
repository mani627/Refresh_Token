const { log } = require("console");
const express = require("express");


const jwt = require('jsonwebtoken');
const { promisify } = require("util");





const auth = async (req, res, next) => {

  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];

  if (!token) {
    res.sendStatus(401)
  } else {

    try {
      let decode = await promisify(jwt.verify)(
        token, process.env.JWT_SECRET
      )

      req.token_decoded = decode;
      res.JWT_result = "is Valid"

      next();
    } catch (error) {

      // Refresh token
      if (error?.message === "jwt expired") {

        try {
          const credentials = req?.headers?.cookie?.split("=")[1];

          //  decode refresh token
          let decode = await promisify(jwt.verify)(
            credentials, process.env.JWT_SECRET
          )

          // new access token created
          const token = jwt.sign({ id: decode.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          })

          // assign to req to do further process
          req.token_decoded = decode

          req.refreshtoken = token
          res.JWT_result = "Valid by Refreshtoken"

          next();

        } catch (err) {
          // err.message={payload:"Refresh token expired",...err.message}
          // console.log(err.message);
          next({ Actual_Error: new Error(err), Custom_Error: "Refresh Token Expired" })
        }











      }
      // next(new Error(error))

    }
  }

}

module.exports = auth;