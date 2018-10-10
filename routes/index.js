require('dotenv').config()
const express = require('express');
const route = express.Router();
const {user,product,transaction,transactionDetails} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('../config/passport')
const multer = require('multer')
const storage  = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,'uploads/')
  },
  filename : function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + '.jpg')
  }
})
const upload = multer({ storage: storage })
const Base64 = require('js-base64').Base64;
const request = require('request')


/* API PAYMENT */


route.post('/pay', async (req,res)=>{
 
  try {
   
    const { transaction_details:{order_id,gross_amount}} = req.body
    const { item_details,status}= req.body
    console.log(status)

 const trans = await transaction.create({
    order_id : order_id,
    gross_amount : gross_amount,
    transaction_status : status
  })

  item_details.map(x=>{
    transactionDetails.create({
      price: x.price,
      quantity:x.quantity,
      name: x.name
    })
   
        
        

    });

    res.json(trans)

  } catch (error) {
    console.log(error)
  }
  
   
})


route.post('/getToken',async(req,res) => {
  try {
    const { transaction_details:{order_id,gross_amount}} = req.body
    const { item_details}= req.body
    const options =  {
      method: 'POST',
      url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
      headers: {
          authorization: `Basic ${Base64.encode('SB-Mid-server-esexY5jhFOA4l6lu--Vqmkt7:')}` ,
          'content-type': 'application/json',
          accept: 'application/json'
      },
      body: {
          transaction_details: {
              order_id : order_id,
              gross_amount : gross_amount
          },  
          item_details
      },
      json: true
    };

    request(options, function(error, response, body) {
        if(error){
          res.json(error)
        }
        
        res.json(response)
    })
  } catch (error) {
    console.log(error)
  }

route.p
  

})







/* API LOGIN */

route.post('/login',async(req,res)=>{
  try {
    const {email,role} = req.body
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
      res.json({status : 'error'})
    }
  
  } catch (error) {
    res.json({status : error})
    console.log(error)
    
  }
  

  
})



/* END API */




/* API PRODUCT  */

route.get('/item',async(req,res)=>{
  const data = await product.findAll()
  res.json(data)
})

route.get('/item/:id',async(req,res)=>{
  const id = req.params.id
  const data = await product.findAll({where :{id : id}})
  res.json(data)
})


route.post('/addItem',upload.single('flPhoto'),async(req,res)=>{
  const {name,size,color,material,weight,description,stok,tag,price,discount,categoryName} = req.body
  const photo = req.file.filename
  console.log(photo)

  const data = await product.create({
    name,
    size,
    color,
    material,
    weight,
    description,
    flPhoto : photo,
    stok,
    tag,
    price,
    discount,
    categoryName
  })
  res.json(data)
})


route.delete('/removeItem/:id',passport.authenticate('jwt'),async(req,res)=>{
  const id = req.params.id
  const data = await product.destroy({
    where : {id : id}
  })
  res.json(data)
})

route.put('/updateItem/:id',upload.single('flPhoto'),async(req,res)=>{
  const id = req.params.id
  const {name,size,color,material,weight,description,stok,tag,price,discount,categoryName} = req.body
  const photo = req.file
  
  const data = {name,
    size,
    color,
    material,
    weight,
    description,
    stok,
    tag,
    price,
    discount,
    categoryName}
  if(photo){

    data.flPhoto = req.file.filename
    await product.update(
      data,
      {where : {id : id}}
    )
  }
 
  else {
     await product.update(
      data,
      {where : {id : id}}
    )
  }
  res.json(data)
})

/* END */

/* API USERS  */

route.get('/users',async(req,res)=>{
  const data = await user.findAll()
  res.json(data)
})

route.post('/addUsers',async(req,res)=>{
  const {firstName,lastName,phoneNumber,address,email,role,status} = req.body
  const cryptoPass = await bcrypt.hash(req.body.password,parseInt(process.env.SALT_ROUND))
  const data = await user.create({
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    password : cryptoPass,
    role,
    status
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
