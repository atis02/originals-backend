const {User,Basket} = require ('../models/model')
const ApiError = require("../error/apiError")

class UserController {
    async registration(req,res,next){
        const {email,password,role} = req.body;
        if(!email||!password){
            next(ApiError.badRequest('Email ýa-da açar söz nädogry!'))
        }
        const user = await User.findOne({where:{email}})
        if(user){
            next(ApiError.badRequest('Ulanyjy  !'))
        }
    }

    async login(req,res){
        res.json({success:'message'})
        
    }

    async check(req,res,next){

        const {id}= req.query
        if(!id){
           return next(ApiError.badRequest('Ýalňyş id'))
        }
        res.json(id)
    }
}
module.exports = new UserController ()
