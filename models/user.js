var mongoose=require('mongoose')
var passportLocalMongoose=require('passport-local-mongoose')

var userSchema= new mongoose.Schema({
    username:String,
    password:String,
    email: String,
    userType: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserPerm"
    }],
    groupCompany : String,
    resetPasswordToken: {
        type:String,
        default: null
    },
    resetPasswordExpires: Date
  
})

userSchema.plugin(passportLocalMongoose, {
    selectFields : 'username password email groupCompany userType resetPasswordToken resetPasswordExpires' //Space seperate the required fields
});

module.exports=mongoose.model('User',userSchema)