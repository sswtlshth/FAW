var mongoose=require('mongoose');
var Schema=mongoose.Schema;

function validatePassword(v){
    //length of password should be more then 8 characters.
    return v.length <=8;
}
var UserSchema=new Schema({
    name : {
        type : String,
        required: 'name cannot be blank',
        unique : true
    },
    password : {
        type : String,
        required: 'Password Cant be blank'
    },
    location : {
        type : String
    },
    meta: {
        age : Number,
        website : String
    },
    created_at : {
        type : Date
    },
    updated_at : {
        type : Date
    },
    admin : {
        type: Boolean
    }
})
/* module.exports = mongoose.model('User',new Schema({
    name : String,
    password: String,
    admin: Boolean
})) */

UserSchema.pre('save' , function(next){
    //get current date
    var current_date= new Date();
    this.updated_at=current_date;
    if(!this.created_at){
        this.created_at=current_date;
    }
    next();
});

module.exports = mongoose.model('User',UserSchema)