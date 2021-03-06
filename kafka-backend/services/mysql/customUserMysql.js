var pool =  new require('./customConnectionPool');
var bcrypt = require('bcrypt');

function userSignUp(callback, signupQuery, userdata) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {
            bcrypt.genSalt(10, function(err, salt) {
                if (!err) {

                    bcrypt.hash(userdata.password, salt, function(err, hash) {

                        if (!err) {

                            connection.query(signupQuery, [userdata.fname, userdata.lname, userdata.email, hash], function(err, result) {
                                pool.release(connection);
                                if (err) {
                                    callback(null, err);
                                } else {
                                    callback(result.insertId, err);
                                }
                            });
                            console.log("\nConnection closed..");

                        } else {
                            callback(null, err);
                        }

                    });
                } else {
                    callback(null, err);
                }

            });
        }
    });
}


function checkUsername(callback, checkUsernameQuery, email) {

    pool.getConnection(function(err, connection) {

        if (err) {callback(false, err, null);} else {

            connection.query(checkUsernameQuery, email, function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(false, err, result);
                } else {
                    if (result.length == 0) {
                        callback(true, err, result);
                    } else {
                        callback(false, err, result);
                    }
                }
            });
            console.log("\nConnection closed..");


        }
    });
}


function getUser(callback, checkUsernameQuery, email) {



    pool.getConnection(function(err, connection) {
        if (err) {} else {
            connection.query(checkUsernameQuery, email, function(err, result) {
                pool.release(connection);
                if (err) {
                    callback(false, err, result);
                } else {
                    if (result.length == 0) {
                        callback(true, err, result);
                    } else {
                        callback(false, err, result);
                    }
                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function getUserById(callback, getUserByIdQuery, id) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(getUserByIdQuery, id, function(err, result) {
                pool.release(connection);
                if (err) {
                    callback(false, err, result);
                } else {
                    if (result.length == 0) {
                        callback(result, err);
                    } else {
                        callback(result, err);
                    }
                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function userPinfo(callback, userPinfoQuery, userdata, userId) {

    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(userPinfoQuery, [userdata.dob, userdata.contact, userId], function(err, result) {
                pool.release(connection);
                if (err) {
                    callback(null, err, userId);
                } else {
                    callback(result, err, userId);
                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function userPinfoUpdate(callback, userPinfoUpdateQuery, userdata, userId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {
            connection.query(userPinfoUpdateQuery, [userdata.dob, userdata.contact, userId], function(err, result) {
                pool.release(connection);
                if (err) {
                    callback(null, err, userId);
                } else {
                    callback(result, err, userId);
                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function checkPinfo(callback, getPInfoQuery, uid) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(getPInfoQuery, uid, function(err, result) {
                pool.release(connection);
                if (err) {
                    callback(null, err);
                } else {

                    callback(result, err);

                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function checkEduinfo(callback, getEduInfoQuery, uid) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {
            connection.query(getEduInfoQuery, uid, function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {

                    callback(result, err);

                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function userEduinfoUpdate(callback, userEduInfoUpdateQuery, userdata, userId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {
            connection.query(userEduInfoUpdateQuery, [userdata.college, userdata.sdate, userdata.edate, userdata.major, userdata.gpa, userId], function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(null, err, userId);
                } else {
                    callback(result, err, userId);
                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function userEduinfo(callback, userEduinfoQuery, userdata, userId) {

    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(userEduinfoQuery, [userdata.college, userdata.sdate, userdata.edate, userdata.major, userdata.gpa, userId], function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(null, err, userId);
                } else {
                    callback(result, err, userId);
                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function getInterest(callback, getInterestQuery, name) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {
            connection.query(getInterestQuery, name, function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {

                    callback(result, err);

                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function addUserInterest(callback, userInterestQuery, interestId, comment, userId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {
            connection.query(userInterestQuery, [interestId, comment, userId], function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {

                    callback(result, err);

                }
            });
            console.log("\nConnection closed..");

        }
    });

}

function getAllInterests(callback, allUserInterestQuery, userId) {

    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(allUserInterestQuery, userId, function(err, result) {
                pool.release(connection);
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {

                    callback(result, err);

                }
            });
            console.log("\nConnection closed..");


        }
    });
}

exports.userSignUp = userSignUp;
exports.checkUsername = checkUsername;
exports.userPinfo = userPinfo;
exports.checkPinfo = checkPinfo;
exports.userPinfoUpdate = userPinfoUpdate;
exports.checkEduinfo = checkEduinfo;
exports.userEduinfoUpdate = userEduinfoUpdate;
exports.userEduinfo = userEduinfo;
exports.getUser = getUser;
exports.getUserById = getUserById;
exports.getInterest = getInterest;
exports.addUserInterest = addUserInterest;
exports.getAllInterests = getAllInterests;