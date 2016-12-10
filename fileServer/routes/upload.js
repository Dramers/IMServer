var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.body);
  console.log(req.files);

  
});

module.exports = router;