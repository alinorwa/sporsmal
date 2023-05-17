const mongoose  = require("mongoose");


const Schema = mongoose.Schema;
const dataSchema = new Schema({
    ask : {
        type : String ,
        require : true ,
    },
    answer:{
        type : String,
        require : true,
    }
})


module.exports = mongoose.model('askAndtheAnser' , dataSchema)