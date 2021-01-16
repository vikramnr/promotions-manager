const express = require('express');
const router = express.Router();
const Promotion = require('../models/promo')
const ReferenceData = require('../models/reference')
const PromotionStatus = require('../models/promostatus')
const _ = require('lodash');
const { DateTime } = require('luxon');



/* GET home page. */
router.get('/',  async (req,res,next) => {
  res.render('promotions/index',{ title: 'Promotion Management Systems'})
})


router.get('/view',async(req,res,next) => {
  let promotions =  await Promotion.find({}).populate('product').exec()
  let updatedPromotions = []
  promotions.forEach(p => {
    let date = DateTime.fromJSDate(p.createdAt)
    let promo = _.cloneDeep(p);
    promo.createdAtStr= date.toRelativeCalendar()
    updatedPromotions.push(promo)
  })
  //console.log(updatedPromotions)
  res.render('promotions/view',{ title: 'Promotion Management Systems', promotions: updatedPromotions})
})

router.get('/view/:id',async(req,res,next) => {
  
  let promotion =  await Promotion.findOne({_id: req.params.id}).populate('product').exec()
  let status = await PromotionStatus.find({})
  // console.log(status)
  let date = DateTime.fromJSDate(promotion.createdAt)
  let updatedPromotion = _.cloneDeep(promotion);
  updatedPromotion.createdAtStr= date.toRelativeCalendar()
  res.render('promotions/edit',{ title: 'Promotion Management Systems', promotion: updatedPromotion, promotionStatus: status })

})

router.get('/create', async (req, res, next) => {
  const referenceData = await ReferenceData.find({})
  // const promotionStatus = await PromotionStatus.find({})
  const promotions = await Promotion.find({}).populate('product').exec()
  
  let pcodeDisplay = []
  referenceData.forEach(r => 
    pcodeDisplay.push({value: r.pcode+'-'+r.title, code: r._id }))
  
  let departments= []
  referenceData.forEach((item) => {
  var i = departments.findIndex(x => x == item.dCode);
  if(i <= -1){
    departments.push(item.dCode);
  }
});

  res.render('promotions/create', { title: 'Promotion Management Systems', pcodeDisplay , departments, promotionStatus: 'Created'});
});

router.post('/', async(req, res, next) => {
  console.log(req.body.upc[0])
  const promoObj = {
    name : req.body.name,
    description: req.body.description,
    comments : [req.body.comment],
    product: req.body.upc[0],
    status: req.body.status,
    costPrice: req.body.costPrice,
    sellingPrice: req.body.sellingPrice,
    marginLost: req.body.marginLost,
    share: req.body.share,
    supplierShare: req.body.supplierShare,
    endDate : Date.now(),
  }
  const newPromtion = new Promotion(promoObj)
  await newPromtion.save()
  res.redirect('/pm')
})


router.put('/:id',async(req,res,next) => {
  console.log(req.body.status)
  const promo = await Promotion.findById({_id: req.params.id})
  promo.description= req.body.description,
  promo.comments = promo.comments.concat(req.body.comment)
  promo.status =req.body.status
  promo.costPrice=  req.body.costPrice
  promo.sellingPrice= req.body.sellingPrice
  promo.marginLost= req.body.marginLost
  promo.share= req.body.share
  promo.supplierShare = req.body.supplierShare
  await promo.save()
  console.log(promo,'updated one')
  res.redirect('/pm/view/'+req.params.id)
})

router.delete('/:id',async(req,res,next) => {
  const result = await Promotion.findByIdAndDelete(req.params.id)
  console.log(result)
  res.redirect('/pm/view')
})

module.exports = router;
