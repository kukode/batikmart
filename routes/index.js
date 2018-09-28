require('dotenv').config()
const express = require('express');
const route = express.Router();
const {category,user,product} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('../config/passport')

/* API LOGIN */

route.post('/login',async(req,res)=>{
  try {
    const {email} = req.body
    const data = await user.findOne({
      where : {
        email : email
      }
    }
  )
    if(data){
  
      const comparePassword = await bcrypt.compare(req.body.password,data.password)
      if(comparePassword){
        const koin = {
          id: data.id,
          email : data.email,
          password : data.password
        }
        // console.log(koin)
        const token = await jwt.sign(koin,'you_jwt_secret')
        res.json({token})
      }
      else{
        res.json({status : 'error pas'})
      }
      
    }
    else{
      res.json({status : 'erro'})
    }
  
  } catch (error) {
    res.json({status : error})
    console.log(error)
    
  }
  

  
})



/* END API */


/* API CATEGORY */
route.get('/category',passport.authenticate('jwt'), async (req,res) => {
  const data = await category.findAll()
  res.json(data)
});

route.post('/addCategory',async(req,res)=>{

  const {nameCategory} = req.body
  const data = await category.create({
    nameCategory
  })
  res.json(data)


})

route.delete('/removeCategory/:id',async(req,res)=>{
  const id = req.params.id
  await category.destroy({
    where : {id : id}
  })
  res.json('sukses hapus')
})

route.put('/updateCategory/:id',async(req,res)=>{
  const id = req.params.id
  const {nameCategory} = req.body
  const data = await category.update(
      {nameCategory},
     { where :{id :id}}
  )
  res.json(data)
})

/* END */

/* API PRODUCT  */

route.get('/item',async(req,res)=>{
  const data = await product.findAll()
  res.json(data)
})

route.post('/addItem',async(req,res)=>{
  const {name,size,color,material,weight,description,flPhoto,stok,tag,price,discount,categoryId} = req.body
  const data = await product.create({
    name,
    size,
    color,
    material,
    weight,
    description,
    flPhoto,
    stok,
    tag,
    price,
    discount,
    categoryId
  })
  res.json(data)
})

route.delete('/removeItem/:id',async(req,res)=>{
  const id = req.params.id
  const data = await product.destroy({
    where : {id : id}
  })
  res.json(data)
})

route.put('/updateItem/:id',async(req,res)=>{
  const id = req.params.id
  const {name,size,color,material,weight,description,flPhoto,stok,tag,price,discount,categoryId} = req.body
  const data = await product.update(
    {name,
      size,
      color,
      material,
      weight,
      description,
      flPhoto,
      stok,
      tag,
      price,
      discount,
      categoryId},
    {where : {id : id}}
  )
  res.json(data)
})

/* END */

/* API USERS  */

route.get('/users',async(req,res)=>{
  const data = await user.findAll()
  res.json(data)
})

route.post('/addUsers',async(req,res)=>{
  const {firstName,lastName,phoneNumber,address,email,role} = req.body
  const cryptoPass = await bcrypt.hash(req.body.password,parseInt(process.env.SALT_ROUND))
  const data = await user.create({
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    password : cryptoPass,
    role
  })
  res.json(data)
})

route.delete('/removeUsers/:id',async(req,res)=>{
  const id = req.params.id
  const data = await user.destroy(
    {where: {id:id}}
  )
  res.json(data)
})

route.put('/updateUsers/:id',async(req,res)=>{
  const id = req.params.id
  const {firstName,lastName,phoneNumber,address,email,password,role} = req.body
  const data = await user.update(
    {firstName,lastName,phoneNumber,address,email,password,role},
    {where : {id:id}}
  )
  res.json(data)
})

/* END */

module.exports = route;
