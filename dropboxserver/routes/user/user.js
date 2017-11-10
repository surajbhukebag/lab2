var mysql = require('./../mysql/userMysql');
var fs = require('fs');
var bcrypt = require('bcrypt');
var kafka = require("./../kafka/client");
var passport = require('passport');

function signup(req, res) {

    kafka.make_request('signupTopic', { "email": req.param("email"), "password": req.param("password"), "fname": req.param("fname"), "lname": req.param("lname") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: "User Signup failed with error : " + err }));
        } else {
            if (results.code == 200) {
                res.send(JSON.stringify({ code: 200, userId: results.userId, msg: results.msg }));

            } else {
                res.send(JSON.stringify({ code: 500, msg: results.msg }));
            }
        }
    });
}


function signout(req, res) {
    req.session.destroy();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ code: 200, msg: "Logged out" }));
}


function userPersonalInfo(req, res) {

    kafka.make_request('userPinfoTopic', { "email": req.param("email"), "contact": req.param("contact"), "dob": req.param("dob") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, pinfo: { userId: results.userId, contact: results.contact, dob: results.dob, msg: results.msg } }));
        }
    });

}



function userEduInfo(req, res) {

    kafka.make_request('userEduInfoTopic', {
        "email": req.param("email"),
        "college": req.param("college"),
        "major": req.param("major"),
        "sdate": req.param("sdate"),
        "edate": req.param("edate"),
        "gpa": req.param("gpa")
    }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, eduinfo: { userId: results.userId, college: results.college, sdate: results.sdate, edate: results.edate, major: results.major, gpa: results.gpa, msg: results.msg } }));
        }
    });

}


function userIntInfo(req, res) {

    kafka.make_request('userInterestsTopic', { "userId": req.param("userId"), comment: req.param("comment"), interest: req.param("interest") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, interests: results.interests }));
        }
    });

}

exports.signup = signup;
exports.signout = signout;
exports.userPersonalInfo = userPersonalInfo;
exports.userEduInfo = userEduInfo;
exports.userIntInfo = userIntInfo;