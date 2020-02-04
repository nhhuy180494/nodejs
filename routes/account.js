var express = require('express');
var router = express.Router();

var loginNotYet = function(req, res, next) {
    if (req.session && req.session.email) {
        return res.redirect('/');
    } else {
        return next();
    }
}

const { Client } = require('pg');
const connectionString = 'postgresql://postgres:zzz111@localhost:5432/elearning';

const client = new Client({
    connectionString: connectionString
});

client.connect();

router.get('/login.html', loginNotYet, function(req, res, next) {
    res.render('account/login', { title: 'Express', email: req.session.email, layout: 'shared/layout' });
});

router.get('/register.html', loginNotYet, function(req, res, next) {
    res.render('account/register', { title: 'Express', email: req.session.email, layout: 'shared/layout' });
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.post('/register', function(req, res, next) {
    client.query('SELECT * FROM public."user"', function(err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.send({ title: 'Express', layout: 'shared/layout', data: result.rows });
    });
});

router.post('/login', function(req, res, next) {
    var datas = [req.body.email, req.body.password];
    client.query('SELECT * FROM public."user" WHERE email = $1 AND password = crypt($2, password)', datas, function(err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        if (result.rows.length > 0) {
            req.session.loggedin = true;
            req.session.email = req.body.email;
            res.send({ result: true });
        } else {
            res.send({ result: false });
        }
        res.end();
        // res.send({ data: result.rows });
    });
});



module.exports = router;