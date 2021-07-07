const express = require('express');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const users = require('../models/users');
const config = require('../config');

const app = express();

app.get('/', isAuthenticated, (req, res) => {
    jwt.verify(req.token, config.secretkey, (err, user) => {
        if (err) {
            res.send({ "redirect": "/login" });
        } else {
            res.json(user[0]);
        }
    });
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var userpass = req.body.password;
    users.findUserByEmail(email, function (user) {
        user = user[0];
        if(user){
            var pass = bcryptjs.compareSync(userpass, user.password);
            if (pass) {
                console.log("OK");
                jwt.sign({ user }, config.secretkey, { expiresIn: '7 days' }, (err, token) => {
                    return res.send(token);
                });
            } else {
                return res.send({ "status": 401 });
            }
        } else {
            return res.send({ "status": 401 });
        }
    });
});

app.post('/register', (req, res) => {
    console.log(req.body);
    var user = req.body;
    user.password = bcryptjs.hashSync(user.password, 10);
    users.createUser(user, function (err) {
        if (err) {
            res.send({ "status": 409 });
        } else {
            res.send({ "redirect": "/login" });
        }
    })
});

app.post('/unregister', (req, res) => {
    var email = req.body.email;
    var userpass = req.body.userpass;
    users.findUserByEmail(email, function (user) {
        if (user[0] != null) {
            var pass = bcryptjs.compareSync(userpass, user[0].userpass);
            if (pass) {
                users.deleteUserByEmail(email, function (err) {
                    if (err) {
                        res.send({ "status": 403 });
                    } else {
                        res.send({ "redirect": "/login" });
                    }
                });
            } else {
                res.send({ "status": 401 });
            }
        } else {
            res.send({ "status": 404 });
        }
    });
});

function isAuthenticated(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send({ "redirect": "/login" });
    }
}

module.exports.app = app;