const mongoose = require('mongoose')
const refData = require('./data/reference.json')
const userData = require('./data/usergroup.json')
const pStatus = require('./data/promostatus.json')

const User = require('./models/user')
const Promotion = require('./models/promo')
const PromotionStatus = require('./models/promostatus')
const Reference = require('./models/reference')
const UserGroup = require('./models/userPerm')

Reference.deleteMany({}).then((c) => console.log('deleted reference data')) 
UserGroup.deleteMany({}).then((c) => console.log('deleted group data')) 
// User.deleteMany({}).then((c) => console.log('deleted group data')) 
UserGroup.insertMany(userData).then((c) =>{
    console.log(c)
})

Reference.insertMany(refData).then((c) =>{
    console.log(c)
})
PromotionStatus.deleteMany({}).then((c) => console.log('deleted promo data')) 
console.log(pStatus)
PromotionStatus.insertMany(pStatus).then((c) => console.log(c))

// Promotion.deleteMany({}).then((c) => console.log('deleted promotions '))