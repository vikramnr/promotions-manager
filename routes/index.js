var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Promotion Management Systems' });
});

router.get('/support',(req,res,next) => {
  res.render('error', { title: 'Promotion Management Systems' });
})

module.exports = router;
