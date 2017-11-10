var fs = require('fs');
var bcrypt = require('bcrypt');
var User = require('./../model/User');

function signin(userdata, done) {

    var res = {};
    User.find({ email: userdata.email }, function(err, result) {
        if (err) {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        } else {
            if (result.length > 0) {
                let enteredPassword = userdata.password;
                bcrypt.compare(enteredPassword, result[0].password, function(err, isPasswordMatch) {

                    if (isPasswordMatch) {
                        let user = {},
                            pinfo = {},
                            eduInfo = {},
                            interests = [];
                        user = { "id": result[0].id, "fname": result[0].firstname, "lname": result[0].lastname, "email": result[0].email };
                        if (result[0].userinterests !== undefined) {
                            interests = result[0].userinterests.length;
                        }

                        if (result[0].personalInfo !== undefined) {
                            pinfo = result[0].personalInfo;
                        }

                        if (result[0].educationInfo !== undefined) {
                            eduinfo = result[0].educationInfo;
                        }

                        res.code = 200;
                        res.loggedIn = isPasswordMatch;
                        res.user = user;
                        res.pinfo = pinfo;
                        res.eduinfo = eduInfo;
                        res.interests = interests;
                        done(err, res);
                    } else {
                        res.code = 500;
                        res.loggedIn = false;
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
    });


}

function signup(userdata, done) {

    var res = {};
    User.find({ email: userdata.email }, function(err, user) {
        if (err) {
            res.code = 500;
            res.msg = "User Signup failed with error : " + err;
            done(err, res);
        } else {
            console.log("user : " + user.length)
            if (user.length > 0) {
                res.code = 500;
                res.msg = "User with given email already registered. Please use different email";
                done(err, res);
            } else {

                bcrypt.genSalt(10, function(err, salt) {
                    if (!err) {

                        bcrypt.hash(userdata.password, salt, function(err, hash) {

                            if (!err) {

                                var newUser = User({
                                    firstname: userdata.fname,
                                    lastname: userdata.lname,
                                    email: userdata.email,
                                    password: hash
                                });
                                newUser.save(function(err, savedUser) {
                                    if (err) {
                                        res.code = 500;
                                        res.msg = "User Signup failed with error : " + err;
                                        done(err, res);
                                    } else {
                                        fs.mkdir("./files/" + userdata.email, function(err) {

                                            if (err) {
                                                res.code = 500;
                                                res.msg = "User Signup failed with error : " + err;
                                                done(err, res);
                                            } else {
                                                res.code = 200;
                                                res.msg = "User Registered";
                                                res.userId = savedUser.email;
                                                done(null, res);
                                            }
                                        });
                                    }
                                });


                            } else {
                                res.code = 500;
                                res.msg = "User Signup failed with error : " + err;
                                done(err, res);
                            }

                        });
                    } else {
                        res.code = 500;
                        res.msg = "User Signup failed with error : " + err;
                        done(err, res);
                    }

                });


            }

        }

    });

}


function userPersonalInfo(userdata, done) {

    var res = {};
    User.findOne({ email: userdata.email }, function(err, user) {

        if (!err) {
            let pinfo = { contactNumber: userdata.contact, dob: userdata.dob };
            user.personalInfo = pinfo;
            user.save(function(err, savedUser) {

                if (err) {
                    res.code = 500;
                    res.msg = "User Personal Info update failed with : " + err;
                    done(err, res);
                } else {
                    res.code = 200;
                    res.userId = savedUser.userId;
                    res.contact = userdata.contact;
                    res.dob = userdata.dob;
                    res.msg = "User Personal Data Updated";
                    done(null, res);
                }

            });
        } else {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        }

    });


}

function userEduInfo(userdata, done) {

    var res = {};
    User.findOne({ email: userdata.email }, function(err, user) {

        if (!err) {
            let eduinfo = { college: userdata.college, sdate: userdata.sdate, edate: userdata.edate, major: userdata.major, gpa: userdata.gpa };
            user.educationInfo = eduinfo;
            user.save(function(err, savedUser) {

                if (err) {
                    res.code = 500;
                    res.msg = "User Education Info update failed with : " + err;
                    done(err, res);
                } else {
                    res.code = 200;
                    res.msg = "User Education Data Updated";
                    res.userId = savedUser.id;
                    res.college = userdata.college;
                    res.major = userdata.major;
                    res.sdate = userdata.sdate;
                    res.edate = userdata.edate;
                    res.gpa = userdata.gpa;
                    done(null, res);

                }

            });
        } else {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        }

    });
}

function userIntInfo(userdata, done) {

    let userId = userdata.userId;
    let comment = userdata.comment;
    let interest = userdata.interest;
    var res = {};

    User.findOne({ _id: userId }, function(err, user) {

        if (!err) {
            let interestArr = [];
            let interestInfo = { name: interest, comment: comment };
            interestArr.push(interestInfo);
            if (user.userInterests !== undefined) {
                user.userInterests.push(interestInfo);
            } else {
                user.userInterests = interestArr;
            }

            user.save(function(err, savedUser) {

                if (err) {
                    res.code = 500;
                    res.msg = "User interests update failed with : " + err;
                    done(err, res);
                } else {
                    res.code = 200;
                    res.interests = savedUser.userInterests;
                    done(null, res);
                }

            });
        } else {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        }

    });


}

exports.signin = signin;
exports.signup = signup;
exports.userPersonalInfo = userPersonalInfo;
exports.userEduInfo = userEduInfo;
exports.userIntInfo = userIntInfo;