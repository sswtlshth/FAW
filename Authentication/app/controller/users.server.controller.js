'use strict';
var should = require('should'),
mongoose = require('mongoose'),
User=mongoose.model('User');
var config = require('../../config');
var secret=config.secret;
mongoose.connect(config.database);
var jwt = require('jsonwebtoken');

exports.saveUser = function(req,res){
    if( !req.body.name || !req.body.password){
        res.json({
            success : false,
            message : 'Please enter username and password'
        })
    }else{
        var newUser = new User({
            name: req.body.name,
            password: req.body.password,
            admin: false
        })
        newUser.save(function(err){
            if(err){
                res.json({
                    success : false,
                    message : 'user didnt save'
                });
            }
            res.json({
                success : true,
                message : 'User Registered'
            })   
        })
    }
};

//authneticate users
exports.authenticateUser= function(req,res){
    User.findOne({
        name: req.body.name
    },function(err, user) {
        if(err) throw err;

        if(!user) {
            console.log("Authentication failed");
            res.json({success: false , message: 'Authentication Failed,User Not Found'});
        }else if(user){
            console.log('Details:', user.name);
            if(user.password != req.body.password){
                res.json({success: false , message: 'Authentication Failed,Wrong Password'});
            }else{
                const payload = {
                    admin : user.admin
                };
                var token = jwt.sign(payload,secret,{
                    expiresIn : 100
                });
                res.json({
                    success: true,
                    message: 'Authenticated',
                    token : token
                });
            }
        }
    });
}
//get list of all users
exports.list = function(req,res) {
    User.find({},function(err,users){
        if(err){
            return res.status(400).send({
                message : "Not Found"
            });
        }else{
            res.json(users);
        }
    });
};