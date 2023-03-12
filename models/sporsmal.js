const mongoose  = require("mongoose");


const Schema = mongoose.Schema;
const SporsmalSchema = new Schema({
    spør : {
        type : String ,
        require : true ,
    }
})


module.exports = mongoose.model('Sporsmal' , SporsmalSchema)