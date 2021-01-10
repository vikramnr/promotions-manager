var mongoose=require('mongoose')

var refDataSchema= new mongoose.Schema({
    pcode:String,
    department:String,
    title: String,
    publishedDate: Date,
    thumbnailUrl: String,
    longDescription: String,
    status: String,
    departement: String,
    dCode:String
})

module.exports=mongoose.model('Reference',refDataSchema)