var mysql = require('./../mysql/userMysql_connectionpooled');
var fs = require('fs');
var bcrypt = require('bcrypt');

function signin(userdata, done) {

	var res = {};
	let checkUsernameQuery = "select * from user where email = ?";
	mysql.checkUsername(function(uniqueUsername, err, result) {

		if(result.length > 0) {
			let enteredPassword = userdata.password;
			bcrypt.compare(enteredPassword, result[0].password, function(err, isPasswordMatch) {   
				let code = 500;
					let user = {}, pinfo={}, eduInfo = {} ;
		       if(isPasswordMatch) {

		       		user = {"id":result[0].id ,"fname": result[0].firstname,"lname": result[0].lastname,"email": result[0].email};
		       		let getPInfoQuery = "select * from personalinfo where userId = ?";
					mysql.checkPinfo(function(r, err){

						if(err) {
							res.code = 500;
							res.msg = "Unable to access user data.Please try later.";
							done(err,res);
						}
						else {
							if(r.length > 0) {
								pinfo = {contact:r[0].contactNumber, dob:r[0].dateOfBirth};
							}

							let getEduInfoQuery = "select * from education where userId = ?";
							mysql.checkEduinfo(function(ra, err){

								if(err) {
									res.code = 500;
									res.msg = "Unable to access user data.Please try later.";
									done(err,res);
								}
								else {
									if(ra.length > 0) {
										eduInfo = {college:ra[0].collegeName, sdate:ra[0].startDate, edate:ra[0].endDate, major:ra[0].major, gpa:ra[0].gpa};
									}
									res.code = 200;		        	
		        					res.loggedIn = isPasswordMatch;
		        					res.user = user;
		        					res.pinfo = pinfo;
		        					res.eduinfo = eduInfo;
		        					done(err,res);
								}
							}, getEduInfoQuery, result[0].id);

						}
					}, getPInfoQuery, result[0].id);		       		
		       }
		       else {
		       	res.code = 500;
				res.msg = "Invalid Password";
				done(err,res);
		       }	              
		       
		   	});
		}
		else {
			res.code = 500;
			res.loggedIn = false;
			res.msg = "Invalid Username";
			done(err,res);  
		}
		
	},checkUsernameQuery,userdata.email);

}

exports.signin = signin;