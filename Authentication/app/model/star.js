var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var StarSchema=new Schema({
    rating : {
        type : String,
        required: 'name cannot be blank',
        unique : true
    }
})

module.exports = mongoose.model('Star',StarSchema);