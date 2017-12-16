var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var morgon = require('morgan');
var jwt = require('jsonwebtoken');
var User = require('./app/model/user');
var star = require('./app/model/star');
var users= require('./app/controller/users.server.controller');
var config= require('./config');
var apiRoutes = express.Router();
var port = 8000;
app.set('secret',config.secret);

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(morgon('dev'));

//routes
apiRoutes.get('/', function(req,res){
    res.json({ message: 'WElcome'});
})

apiRoutes.post('/register',function(req,res){
    console.log('Register post request');
    users.saveUser(req,res); 
});

apiRoutes.route('/authenticate').post(users.authenticateUser);

//middleware to verify token
apiRoutes.use(function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token,app.get('secret'),function(err,decoded){
            if(err){
                return res.json({ success : false , message : 'Failed To Authenticate'})
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.status(403).send({
            success: false,
            message: 'forbidden'
        });
    }
});

apiRoutes.get('/users',function(req,res){
   /*  User.find({},function(err,users){
        res.json(users);
    }); */
    users.list(req,res);

});

app.use('/api',apiRoutes);
app.listen(port);