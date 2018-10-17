require('dotenv').config()
const express = require('express');
const route = express.Router();
const {user,transaction} = require('../models')
const bcrypt = require('bcrypt')
const passport = require('../config/passport')

route.post('/registerUser',async(req,res)=>{
    const {firstName,lastName,phoneNumber,address,email} = req.body
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

route.get('/getStatus',passport.authenticate('jwt'),async(req,res)=>{
    const {id} = req.user
    const data = await transaction.findAll(
        {
            include:user,
            where:
            {
                userId:id
            }
        
        }
    )
    res.json(data)    
})
route.get('/getHistory',passport.authenticate('jwt'),async(req,res)=>{
    
})





module.exports = route;