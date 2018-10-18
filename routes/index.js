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
const axios = require('axios')



/**
  * endpoint transaction
  * 
  */

 route.get('/transaction',async(req,res)=>{
  try {
    const data = await transaction.findAll()
    res.json(data)
  } catch (error) {
    res.json(error)
  }
})

route.post('/finish',async(req,res)=>{
  try {
    const {transaction_status,order_id} = req.body
    const data = await transaction.update( {transaction_status},{
     
      where : {order_id}
    })
    // console.log(req.body) 
    res.json(data)
  } catch (error) {
    res.json(error)
  }
})

/**
 * finish endpoint
 */


/* API PAYMENT */


route.post('/pay',passport.authenticate('jwt') ,async (req,res)=>{
 
  try {
   
    // console.log(req.body, 'ini pay')
    const { transaction_details:{order_id,gross_amount}} = req.body
    const { item_details,status}= req.body
    const {id} = req.user
    
 
    // console.log(item_details)
    const ongkirs = item_details.find(function(element){
      return element.id === 99
    })
    const itemDetails = item_details.filter(function(e) {
      return e.id !== 99
    })
    // console.log('ongkir ' + ongkirs)
    // console.log('details ' + itemDetails)


 const trans = await transaction.create({
   
    order_id : order_id,
    gross_amount : gross_amount,
    transaction_status : status,
    province : ongkirs.name,
    ongkir : ongkirs.price,
    userId : id
   

  })

  // console.log('dari trans ' + trans)

  itemDetails.map(x=>{
    transactionDetails.create({

      transId : trans.id,
      price: x.price,
      quantity:x.quantity,
      name: x.name

    
    })

    });
    // console.log(item_details)
    res.json(trans)

  } catch (error) {
    console.log(error)
  }
  
   
})


route.post('/getToken',async(req,res) => {
  try {
    const { transaction_details:{order_id,gross_amount}} = req.body
    const { item_details}= req.body
    // const {customer_details:{first_name}} = req.body

    // console.log(req.body)
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
              gross_amount : gross_amount,
              
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

})

route.get('/getProvince',async(req,res)=>{
     /**
     * raja ongkir province
     */
    try {
      let provinsi = '	https://api.rajaongkir.com/starter/province'
      let dataProv = await axios.get(provinsi,{
        headers : {
          key : '7eb26c54aaa3f27370d9ff728a1c8eec',
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      let hasilongkir = dataProv.data.rajaongkir
      res.json(hasilongkir)
    } catch (error) {
      console.log(error)
    }
     
})

route.get('/getCity',async(req,res)=>{
    /**
     * raja ongkir city
     */
    try {
      const id = req.query.province
      // console.log(req.query)
      let city =`https://api.rajaongkir.com/starter/city?province=${id}`
        let dataCity = await axios.get(city,{
          headers : {
            key : '7eb26c54aaa3f27370d9ff728a1c8eec',
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        let hasilongkir = dataCity.data.rajaongkir
        res.json(hasilongkir)
    } catch (error) {
      console.log(error)
    }
     
})

route.post('/cost',async(req,res)=>{
  /**
     * raja ongkir cost
     */
    try {
      let tujuan = req.body.destination
      console.log(req.body)
      let cost = 'https://api.rajaongkir.com/starter/cost'
            await axios.post(cost, {
              "origin":79,
             "destination":tujuan,
             "weight":1700,
             "courier":"jne"
      
            },{
              headers : {
                key : '7eb26c54aaa3f27370d9ff728a1c8eec'
              }
            } )
            .then(function (response) {
              res.json(response.data.rajaongkir.results);
              // console.log(response.data.rajaongkir.results)
            })
            .catch(function (error) {
              res.json(error);
            });
           
                  
    } catch (error) {
      console.log(error)
    }
})



/**
 * 
 * list api kurir internasional
 */
route.get('/listcourierindo',async(req,res)=>{
  try {
    let link = 'https://api.aftership.com/v4/couriers'
    await axios.get(link,{
      headers:{
        "aftership-api-key" : "5c7e1d79-2146-4020-8784-2cefb9042c49",
        "Content-Type": "application/json"
      }
    })
    .then((response)=>{
        res.json(response.data)
    })
    
  } catch (error) {
    res.json(error)
  }
 
  
})

/**
 * end list kurir
 */


 

/* API LOGIN */

route.post('/login',async(req,res)=>{
  try {
    const {email,role} = req.body
    const data = await user.findOne({
      where : {
        email : email,
        $or : {
          role : role
        }
      }
    }
  )
  console.log(data)
    if(data){
      
        const comparePassword = await bcrypt.compare(req.body.password,data.password)
        console.log(comparePassword)
        if(comparePassword){
          const koin = {
            id: data.id,
            email : data.email,
            password : data.password,
            role: data.role
          }
          console.log(koin)
          
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
  const {firstName,lastName,phoneNumber,address,email,role} = req.body
  const cryptoPass = await bcrypt.hash(req.body.password,parseInt(process.env.SALT_ROUND))
  const data = await user.update(
    {firstName,lastName,phoneNumber,address,email,password : cryptoPass,role},
    {where : {id:id}}
  )
  res.json(data)
})

/* END */

module.exports = route;
