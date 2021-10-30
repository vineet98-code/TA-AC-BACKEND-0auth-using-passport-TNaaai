var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/success', (req, res) => {
   res.render('success');
}) 
  
router.get('/failure', (req, res) => {
  res.render('failure');
  
}) 

// make request to the github server
router.get('/auth/github', passport.authenticate('github'));

// github will return back to our application
// github stragey host application credentials and is used to authenticate our application to github
router.get('/auth/github/callback', passport.authenticate('github', 
{ failureRedirect: '/failure' }),
  (req, res) => {
    // Successful authentication redirect now
  return res.redirect('/success');
  });

module.exports = router;
