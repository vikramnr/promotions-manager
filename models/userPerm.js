const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    groupName: String,
    groupCompany: String
})

module.exports=mongoose.model('UserPerm',userSchema)