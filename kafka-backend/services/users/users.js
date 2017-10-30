var mysql = require('./../mysql/userMysql_connectionpooled');
var fs = require('fs');
var bcrypt = require('bcrypt');

function signin(userdata, done) {

    var res = {};
    let checkUsernameQuery = "select * from user where email = ?";
    console.log("lll");
    mysql.checkUsername(function(uniqueUsername, err, result) {

        if (err) {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        } else {
            if (result.length > 0) {
                let enteredPassword = userdata.password;
                bcrypt.compare(enteredPassword, result[0].password, function(err, isPasswordMatch) {
                    let code = 500;
                    let user = {},
                        pinfo = {},
                        eduInfo = {};
                    if (isPasswordMatch) {

                        user = { "id": result[0].id, "fname": result[0].firstname, "lname": result[0].lastname, "email": result[0].email };
                        let getPInfoQuery = "select * from personalinfo where userId = ?";
                        mysql.checkPinfo(function(r, err) {

                            if (err) {
                                res.code = 500;
                                res.msg = "Unable to access user data.Please try later.";
                                done(err, res);
                            } else {
                                if (r.length > 0) {
                                    pinfo = { contact: r[0].contactNumber, dob: r[0].dateOfBirth };
                                }

                                let getEduInfoQuery = "select * from education where userId = ?";
                                mysql.checkEduinfo(function(ra, err) {

                                    if (err) {
                                        res.code = 500;
                                        res.msg = "Unable to access user data.Please try later.";
                                        done(err, res);
                                    } else {
                                        if (ra.length > 0) {
                                            eduInfo = { college: ra[0].collegeName, sdate: ra[0].startDate, edate: ra[0].endDate, major: ra[0].major, gpa: ra[0].gpa };
                                        }
                                        res.code = 200;
                                        res.loggedIn = isPasswordMatch;
                                        res.user = user;
                                        res.pinfo = pinfo;
                                        res.eduinfo = eduInfo;
                                        done(err, res);
                                    }
                                }, getEduInfoQuery, result[0].id);

                            }
                        }, getPInfoQuery, result[0].id);
                    } else {
                        res.code = 500;
                        res.msg = "Invalid Password";
                        done(err, res);
                    }

                });
            } else {
                res.code = 500;
                res.loggedIn = false;
                res.msg = "Invalid Username";
                done(err, res);
            }
        }


    }, checkUsernameQuery, userdata.email);

}

function signup(userdata, done) {

    var res = {};
    let checkUsernameQuery = "select * from user where email = ?";
    mysql.checkUsername(function(uniqueUsername, err, result) {

        if (uniqueUsername) {

            let signupQuery = "insert into user (firstname, lastname, email, password) values (?,?,?,?)";
            mysql.userSignUp(function(userId, err) {

                if (err) {
                    res.code = 500;
                    res.msg = "User Signup failed with error : " + err;
                    done(err, res);
                } else {

                    res.code = 200;
                    res.msg = "User Registered";
                    res.userId = userId;
                    done(null, res);

                }
            }, signupQuery, userdata);

        } else {
            res.code = 500;
            res.msg = "User with given email already registered. Please use different email";
            done(err, res);
        }

    }, checkUsernameQuery, userdata.email);
}


function userPersonalInfo(userdata, done) {

    var res = {};
    let getUserId = "select * from user where email = ?";
    mysql.checkUsername(function(uniqueUsername, err, result) {

        let uId = result[0].id;
        if (!err) {

            let getPInfoQuery = "select * from personalinfo where userId = ?";
            mysql.checkPinfo(function(r, err) {

                if (err) {
                    res.code = 500;
                    res.msg = "Unable to access user data.Please try later.";
                    done(err, res);
                } else {
                    if (r.length > 0) {

                        let userPinfoUpdateQuery = "update personalinfo SET dateOfBirth = ?, contactNumber= ? where userId = ?";
                        mysql.userPinfoUpdate(function(reslt, err, userId) {

                            if (err) {
                                res.code = 500;
                                res.msg = "User Personal Info update failed with : " + err;
                                done(err, res);
                            } else {
                                res.code = 200;
                                res.userId = userId;
                                res.contact = userdata.contact;
                                res.dob = userdata.dob;
                                res.msg = "User Personal Data Updated";
                                done(null, res);

                            }
                        }, userPinfoUpdateQuery, userdata, uId);

                    } else {

                        let userPinfoQuery = "insert into personalinfo (dateOfBirth, contactNumber, userId) values (?,?,?)";
                        mysql.userPinfo(function(reslt, err, userId) {

                            if (err) {
                                res.code = 500;
                                res.msg = "User Personal Info update failed with : " + err;
                                done(err, res);
                            } else {
                                res.code = 200;
                                res.userId = userId;
                                res.contact = userdata.contact;
                                res.dob = userdata.dob;
                                res.msg = "User Personal Data Updated";
                                done(null, res);

                            }
                        }, userPinfoQuery, userdata, uId);

                    }

                }

            }, getPInfoQuery, uId);

        } else {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        }

    }, getUserId, userdata.email);
}

function userEduInfo(userdata, done) {

    var res = {};
    let getUserId = "select * from user where email = ?";
    mysql.checkUsername(function(uniqueUsername, err, result) {

        let uId = result[0].id;
        if (!err) {

            let getEduInfoQuery = "select * from education where userId = ?";
            mysql.checkEduinfo(function(r, err) {

                if (err) {
                    res.code = 500;
                    res.msg = "Unable to access user data.Please try later.";
                    done(err, res);
                } else {
                    if (r.length > 0) {

                        let userEduInfoUpdateQuery = "update education SET collegeName = ?, startDate = ?, endDate = ?, major = ?, gpa = ? where userId = ?";
                        mysql.userEduinfoUpdate(function(reslt, err, userId) {

                            if (err) {
                                res.code = 500;
                                res.msg = "User Education Info update failed with : " + err;
                                done(err, res);
                            } else {
                                res.code = 200;
                                res.msg = "User Education Data Updated";
                                res.userId = userId;
                                res.college = userdata.college;
                                res.major = userdata.major;
                                res.sdate = userdata.sdate;
                                res.edate = userdata.edate;
                                res.gpa = userdata.gpa;
                                done(null, res);
                            }
                        }, userEduInfoUpdateQuery, userdata, uId);

                    } else {

                        let userEduinfoQuery = "insert into education (collegeName, startDate, endDate, major, gpa, userId) values (?,?,?,?,?,?)";
                        mysql.userEduinfo(function(reslt, err, userId) {

                            if (err) {
                                res.code = 500;
                                res.msg = "User Education Info update failed with : " + err;
                                done(err, res);
                            } else {

                                res.code = 200;
                                res.msg = "User Education Data Updated";
                                res.userId = userId;
                                res.college = userdata.college;
                                res.major = userdata.major;
                                res.sdate = userdata.sdate;
                                res.edate = userdata.edate;
                                res.gpa = userdata.gpa;
                                done(null, res);

                            }
                        }, userEduinfoQuery, userdata, uId);

                    }

                }

            }, getEduInfoQuery, uId);



        } else {
            res.send(JSON.stringify({ code: 500, msg: "Unable to access user data.Please try later." }));
        }

    }, getUserId, userdata.email);

}

function userIntInfo(userdata, done) {

    let userId = userdata.userId;
    let comment = userdata.comment;
    let interest = userdata.interest;
    var res = {};
    let inteQuery = "select id from interests where name = ?";
    mysql.getInterest(function(result, err) {

        if (!err && result.length > 0) {

            let query = "insert into userinterests (interestId, comment, userId) values (?,?,?)";
            mysql.addUserInterest(function(userint, err) {
                if (!err) {
                    let getAllInterests = "SELECT i.name as name, u.comment as comment FROM userinterests u INNER JOIN interests i on u.interestId = i.id where u.userId = ?";
                    mysql.getAllInterests(function(ui, err) {
                        if (!err) {
                            let responseJson = [];
                            for (var i = 0; i < ui.length; i++) {
                                responseJson.push({ name: ui[i].name, comment: ui[i].comment });
                            }
                            res.code = 200;
                            res.interests = responseJson;
                            done(null, res);
                        } else {
                            res.code = 500;
                            res.msg = "Unable to access user interest data.Please try later.";
                            done(err, res);
                        }

                    }, getAllInterests, userId);
                } else {
                    res.code = 500;
                    res.msg = "Unable to access user interest data.Please try later.";
                    done(err, res);
                }
            }, query, result[0].id, comment, userId);

        } else {
            res.code = 500;
            res.msg = "Unable to access user interest data.Please try later.";
            done(err, res);
        }
    }, inteQuery, interest);
}

exports.signin = signin;
exports.signup = signup;
exports.userPersonalInfo = userPersonalInfo;
exports.userEduInfo = userEduInfo;
exports.userIntInfo = userIntInfo;