var mysql = require('./connection');
var bcrypt = require('bcrypt');

function userSignUp(callback,signupQuery, userdata){
    
    var connection=mysql.getConnection();


    bcrypt.genSalt(10, function(err, salt) {
        if (!err) {
            
            bcrypt.hash(userdata.password, salt, function(err, hash) {

                if(!err) {

                    connection.query(signupQuery, [userdata.fname, userdata.lname, userdata.email, hash], function(err, result) {
                        if(err){
                            callback(null, err);
                        }
                        else 
                        {                               
                            callback(result.insertId, err);                     
                        }
                    });
                    console.log("\nConnection closed..");
                    connection.end();
                }
                else {
                    callback(null, err);    
                }
              
            });
        }
        else {
            callback(null, err);
        }

    });
    
}


function checkUsername(callback,checkUsernameQuery, email){
    
    var connection=mysql.getConnection();


    connection.query(checkUsernameQuery, email, function(err, result) {
            
        if(err){
            console.log(err);
            callback(false, err, result);
        }
        else 
        {           
            if(result.length == 0) {    
                callback(true, err, result);    
            }   
            else {
                callback(false, err, result);
            }               
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}


function getUser(callback,checkUsernameQuery, email){
    
    var connection=mysql.getConnection();


    connection.query(checkUsernameQuery, email, function(err, result) {
            
        if(err){
            callback(false, err, result);
        }
        else 
        {           
            if(result.length == 0) {                    
                callback(true, err, result);    
            }   
            else {
                callback(false, err, result);
            }               
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}

function getUserById(callback,getUserByIdQuery, id){
    
    var connection=mysql.getConnection();


    connection.query(getUserByIdQuery, id, function(err, result) {
            
        if(err){
            callback(false, err, result);
        }
        else 
        {           
            if(result.length == 0) {                    
                callback(result, err);  
            }   
            else {
                callback(result, err);
            }               
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}

function userPinfo(callback, userPinfoQuery, userdata, userId){
    
    var connection=mysql.getConnection();

    connection.query(userPinfoQuery, [userdata.dob, userdata.contact, userId], function(err, result) {
        if(err){
            callback(null, err, userId);
        }
        else 
        {                               
            callback(result, err, userId);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function userPinfoUpdate(callback, userPinfoUpdateQuery, userdata, userId){
    
    var connection=mysql.getConnection();

    connection.query(userPinfoUpdateQuery, [userdata.dob, userdata.contact, userId], function(err, result) {
        if(err){
            callback(null, err, userId);
        }
        else 
        {                               
            callback(result, err, userId);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function checkPinfo(callback,getPInfoQuery, uid){
    
    var connection=mysql.getConnection();


    connection.query(getPInfoQuery, uid, function(err, result) {
            
        if(err){
            callback(null, err);
        }
        else 
        {           
            
            callback(result, err);
                
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}

function checkEduinfo(callback,getEduInfoQuery, uid){
    
    var connection=mysql.getConnection();

    connection.query(getEduInfoQuery, uid, function(err, result) {
            
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {           
            
            callback(result, err);
                
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}

function userEduinfoUpdate(callback, userEduInfoUpdateQuery, userdata, userId){
    
    var connection=mysql.getConnection();

    connection.query(userEduInfoUpdateQuery, [userdata.college, userdata.sdate, userdata.edate, userdata.major, userdata.gpa, userId], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err, userId);
        }
        else 
        {                               
            callback(result, err, userId);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function userEduinfo(callback, userEduinfoQuery, userdata, userId){
    
    var connection=mysql.getConnection();

    connection.query(userEduinfoQuery, [userdata.college, userdata.sdate, userdata.edate, userdata.major, userdata.gpa, userId], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err, userId);
        }
        else 
        {                               
            callback(result, err, userId);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function getInterest(callback,getInterestQuery, name){
    
    var connection=mysql.getConnection();

    connection.query(getInterestQuery, name, function(err, result) {
            
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {           
            
            callback(result, err);
                
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}

function addUserInterest(callback,userInterestQuery, interestId, comment, userId ){
    
    var connection=mysql.getConnection();

    connection.query(userInterestQuery, [interestId, comment, userId], function(err, result) {
            
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {           
            
            callback(result, err);
                
        }
        });
        console.log("\nConnection closed..");
        connection.end();

}

function getAllInterests(callback,allUserInterestQuery, userId ){
    
    var connection=mysql.getConnection();

    connection.query(allUserInterestQuery, userId, function(err, result) {
            
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {           
            
            callback(result, err);
                
        }
        });
        console.log("\nConnection closed..");
        connection.end();

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