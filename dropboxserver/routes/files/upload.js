var fs = require('fs');
var multer = require('multer');
var mv = require('mv');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');
var mime = require('mime-types');

var storage = multer.diskStorage({
	destination : function(req, file, callback) {
		callback(null, './files');
	},
	filename : function(req, file, callback) {
		callback(null, file.originalname);
	}
});

var upload = multer({
	storage : storage
}).any();



function uploadfile(req,res){

	
 
	
	upload(req, res, function(err) {
		if (err) {
			res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
		}
		else {
			let name = req.files[0].originalname
			console.log("Name : "+ name);
			mv("./files/" + name, "./files/" + req.body.name + req.body.path +"/"+ name, function(err) {

				if (err) {
					res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
				}
				else {

						let checkUsernameQuery = "select * from user where email = ?";
						usermysql.getUser(function(uniqueUsername, err, result) {
							if(!err) {
									let storeFileQuery = "insert into files (name, path, isDirectory, createdBy, dateCreated, isStarred, link) values (?,?,?,?,?,?,?)";
									require('crypto').randomBytes(20, function(err, buffer) {
										var token = buffer.toString('hex');

										mysql.storeFileDetails(function(rss, err, uid) {
											if(!err) {
												let responseJson = {code:200, msg:"File is uploaded"}
												res.send(JSON.stringify(responseJson));
											}
											else {
												console.log(err);
												res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
											}

										}, storeFileQuery, req.files[0].originalname, req.body.path, 0, result[0].id, new Date().getTime(), token);


									});						
								
								
							}
							else {
								console.log(err);
								res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
							}

						}, checkUsernameQuery,req.body.name);

					
				}				

			});			
		}
	});
	
}


function uploadfileToSharedFolder(req,res){

	
 
	
	upload(req, res, function(err) {
		if (err) {
			res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
		}
		else {
			let name = req.files[0].originalname
			let owner = req.body.owner;
			let createdBy = req.body.uploader;

			let userQuery = "select * from user where id = ?";
			usermysql.getUserById(function(user, err) {
				if(!err && user.length > 0) {
					let ownerEmail = user[0].email;
					mv("./files/" + name, "./files/" + ownerEmail + req.body.path +"/"+ name, function(err) {

						if (err) {
							console.log(err);
							res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
						}
						else {


							let storeFileQuery = "insert into files (name, path, isDirectory, createdBy, dateCreated, isStarred, link) values (?,?,?,?,?,?,?)";
								require('crypto').randomBytes(20, function(err, buffer) {
									var token = buffer.toString('hex');

									mysql.storeFileDetails(function(rss, err, uid) {
										if(!err) {
											let responseJson = {code:200, msg:"File is uploaded"}
											res.send(JSON.stringify(responseJson));
										}
										else {
											console.log(err);
											res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
										}

									}, storeFileQuery, req.files[0].originalname, req.body.path, 0, createdBy, new Date().getTime(), token);


								});								
						}				

					});

				}
				else {
					console.log(err);
					res.send(JSON.stringify({code:500, msg:"File Upload Failed"}));
				}
			}, userQuery, owner);

						
		}
	});
	
}

function getDownloadLink(req, res) {

 
		let email = req.param("email");
		let p = req.param("path");
		let index = p.lastIndexOf("/");
		let path = "";
		if(index === 0) {
			path = "/";
		}
		else {
			path = p.substring(0, index);
		}
		let name = p.substring(index+1);

		let getUserQuery = "select * from user where email = ?";
		usermysql.getUser(function(uniqueUsername, err, result) {


			if(!err) {

				let userFilesQuery = "select * from files where createdBy = ? and name = ? and path = ?";

				mysql.getUserFile(function(r, err) {
					if(!err) {
						res.send(JSON.stringify({code:200, link:"http://localhost:3001/filedownload/"+r[0].link}));					
					}
					else {
						res.send(JSON.stringify({code:500, msg:"Unable to fetch file data."}));
					}

				}, userFilesQuery, result[0].id, name, path);			
			}
			else {
				res.send(JSON.stringify({code:500, msg:" Download failed"}));
			}

		}, getUserQuery,email);
	

}



function getSharedFileDownloadLink(req, res) {

 
		let userId = req.param("userId");
		let p = req.param("path");
		let index = p.lastIndexOf("/");
		let path = "";
		if(index === 0) {
			path = "/";
		}
		else {
			path = p.substring(0, index);
		}
		let name = p.substring(index+1);

		let userFilesQuery = "select * from files where createdBy = ? and name = ? and path = ?";

		mysql.getUserFile(function(r, err) {
			if(!err) {
				res.send(JSON.stringify({code:200, link:"http://localhost:3001/filedownload/"+r[0].link}));					
			}
			else {
				res.send(JSON.stringify({code:500, msg:"Unable to fetch file data."}));
			}

		}, userFilesQuery, userId, name, path);			
			

	

}



function filedownload(req, res) {

 

	let filelink = req.param("link");
	let fileQuery = "select * from files where link = ?";
	mysql.getFileLink(function(file, err){

		let userQuery = "select * from user where id = ?";
		usermysql.getUserById(function(user, err) {
			console.log("users : "+user)
			if(!err) {

				let checkFileActivityQuery = "select * from fileactivity where userId = ? and fileId = ?";
				mysql.checkFileActivity(function(rr, err) {					
					if(!err) {
						
						if(rr.length === 0) {
							let addToFileActivityQuery  = "insert into fileactivity (dateCreated, userId, fileId) values (?,?,?)";
							mysql.addToFileActivity(function(err){
							}, addToFileActivityQuery,  user[0].id, file[0].id);	
						}
						else {
							
							let updateFileActivityQuery  = "update fileactivity set dateCreated = ? where userId = ? and fileId = ?";
							mysql.addToFileActivity(function(err){
							}, updateFileActivityQuery,  user[0].id, file[0].id);	
						}
					}
				}, checkFileActivityQuery, user[0].id, file[0].id);	


				let filepath = "files/"+user[0].email+file[0].path+"/"+file[0].name;
				if(file[0].path === '/') {
				console.log("sssss");
					filepath = "files/"+user[0].email+file[0].path+file[0].name;
				}
				
				console.log("path : llll "+filepath);
				fs.readFile(filepath, function(err, data) {
					if (!err) {
						res.contentType(mime.lookup(filepath));
						res.send(data);
					}
					else {
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify({code:500, msg:"Unable to download file."}));
					}

				});
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({code:500, msg:"Unable to download file."}));
			}

		}, userQuery, file[0].createdBy);

		
	}, fileQuery, filelink);

	}


function downloadSharedFile(req, res) {

 

	let filelink = req.param("link");
	let fileQuery = "select * from filelink where linkString = ?";
	mysql.getFileLink(function(f, err){
		let fileQuery = "select * from files where id = ?";
		mysql.getFileLink(function(file, err){

		let userQuery = "select * from user where id = ?";
		usermysql.getUserById(function(user, err) {
			console.log("users : "+user)
			if(!err) {
				let filepath = "";
				console.log("name : "+file[0].name);
				if(file[0].path === '/') {
					filepath = "files/"+user[0].email+file[0].path+file[0].name;
				}
				else {
					filepath = "files/"+user[0].email+file[0].path+"/"+file[0].name;
				}
				
				console.log("path : "+filepath);
				fs.readFile(filepath, function(err, data) {
					if (!err) {
						res.contentType(mime.lookup(filepath));
						res.send(data);
					}
					else {
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify({code:500, msg:"Unable to download file."}));
					}

				});
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({code:500, msg:"Unable to download file."}));
			}

		}, userQuery, file[0].createdBy);

		
	}, fileQuery, f[0].fileId);
			
		
	}, fileQuery, filelink);
	
}

exports.uploadfile = uploadfile;
exports.filedownload = filedownload;
exports.getDownloadLink = getDownloadLink;
exports.downloadSharedFile = downloadSharedFile;
exports.getSharedFileDownloadLink = getSharedFileDownloadLink;
exports.uploadfileToSharedFolder = uploadfileToSharedFolder;