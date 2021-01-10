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
  
  let promotion =  await Promotion.findById({_id: req.params.id}).populate('product').exec()
  let status = await PromotionStatus.find({})
  console.log(status)
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

module.exports = router;
