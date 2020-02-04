var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express', layout: 'shared/layout' });
    if (req.session.loggedin) {
        res.render('index', { title: 'Express', email: req.session.email, layout: 'shared/layout' });
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});

module.exports = router;