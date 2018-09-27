const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const {user} = require('../models')
const ExtractJwt = require('passport-jwt').ExtractJwt

const opts =  {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'you_jwt_secret'

passport.use(new JwtStrategy(opts,async(jwt_payload,done)=>{

    try {
        const users = await user.findOne({where : {email : jwt_payload.email}})    
        if(users) {
            return done(null,users)
        }
        else {
            return done(null,false)
        }
    
    } catch (error) {
        return done(error,false)
    }

}))

passport.serializeUser(function(users,done){
    done(null,users.email)
})

passport.deserializeUser(function(id,done){
    users.findById(id,function(err,users){
        done(err,users)
    })
})

module.exports = passport
