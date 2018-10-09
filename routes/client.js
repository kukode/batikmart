require('dotenv').config()
const express = require('express');
const route = express.Router();
const {user,product,transaction} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('../config/passport')

route.post('/registerUser',async(req,res)=>{
    const {firstName,lastName,phoneNumber,address,email,role,status} = req.body
    const cryptopass = await bcrypt.hash(req.body.password,parseInt(process.env.SALT_ROUND))

    const data = await user.create({
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password : cryptopass,
        role : 2,
        status : 2
    })
    res.json(data)
})





module.exports = route;