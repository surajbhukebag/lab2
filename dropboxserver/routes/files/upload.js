var fs = require('fs');
var multer = require('multer');
var mv = require('mv');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');
var mime = require('mime-types');
var kafka = require("./../kafka/client");

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './files');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
}).any();



function uploadfile(req, res) {

    upload(req, res, function(err) {
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: "File Upload Failed" }));
        } else {

            kafka.make_request('fileuploadTopic', { "filename": req.files[0].originalname, "email": req.body.name, "path": req.body.path }, function(err, results) {
                res.setHeader('Content-Type', 'application/json');
                if (err) {
                    res.send(JSON.stringify({ code: 500, msg: results.msg }));
                } else {

                    let name = req.files[0].originalname
                    console.log("Name : " + name);
                    mv("./files/" + name, "./files/" + req.body.name + req.body.path + "/" + name, function(err) {

                        if (err) {
                            res.send(JSON.stringify({ code: 500, msg: "File Upload Failed" }));
                        } else {

                            let responseJson = { code: 200, msg: "File is uploaded" }
                            res.send(JSON.stringify(responseJson));
                        }

                    });
                }
            });
        }
    });

}


function uploadfileToSharedFolder(req, res) {


    upload(req, res, function(err) {
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: "File Upload Failed" }));
        } else {
            let name = req.files[0].originalname
            let owner = req.body.owner;
            let createdBy = req.body.uploader;

            kafka.make_request('uploadfileToSharedFolderTopic', { "owner": req.body.owner, "createdBy": createdBy, "path": req.body.path, "filename": name }, function(err, results) {
                res.setHeader('Content-Type', 'application/json');
                if (err) {
                    res.send(JSON.stringify({ code: 500, msg: results.msg }));
                } else {

                    let name = req.files[0].originalname;
                    mv("./files/" + name, "./files/" + results.ownerEmail + req.body.path + "/" + name, function(err) {

                        if (err) {
                            console.log(err);
                            res.send(JSON.stringify({ code: 500, msg: "File Upload Failed" }));
                        } else {
                            let responseJson = { code: 200, msg: "File is uploaded" }
                            res.send(JSON.stringify(responseJson));

                        }

                    });
                }
            });
        }
    });

}

function getDownloadLink(req, res) {

    kafka.make_request('getDownloadLinkTopic', { "email": req.param("email"), "path": req.param("path") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
			res.send(JSON.stringify({ code: 200, link: results.link }));
        }
    });
}



function getSharedFileDownloadLink(req, res) {

    kafka.make_request('getSharedFileDownloadLinkTopic', { "userId": req.param("userId"), "path": req.param("path") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
			res.send(JSON.stringify({ code: 200, link: results.link }));
        }
    });
}



function filedownload(req, res) {

	kafka.make_request('filedownloadTopic', { "link": req.param("link") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
			    let filepath = "files/" + results.email + results.path + "/" + results.name;
                if (results.path === '/') {
                    filepath = "files/" + results.email + results.path + results.name;
                }
                fs.readFile(filepath, function(err, data) {
                    if (!err) {
                        res.contentType(mime.lookup(filepath));
                        res.send(data);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ code: 500, msg: "Unable to download file." }));
                    }

                });
        }
    });
}


function downloadSharedFile(req, res) {

	

    let filelink = req.param("link");
    let fileQuery = "select * from filelink where linkString = ?";
    mysql.getFileLink(function(f, err) {
        let fileQuery = "select * from files where id = ?";
        mysql.getFileLink(function(file, err) {

            let userQuery = "select * from user where id = ?";
            usermysql.getUserById(function(user, err) {
                console.log("users : " + user)
                if (!err) {
                    let filepath = "";
                    console.log("name : " + file[0].name);
                    if (file[0].path === '/') {
                        filepath = "files/" + user[0].email + file[0].path + file[0].name;
                    } else {
                        filepath = "files/" + user[0].email + file[0].path + "/" + file[0].name;
                    }

                    console.log("path : " + filepath);
                    fs.readFile(filepath, function(err, data) {
                        if (!err) {
                            res.contentType(mime.lookup(filepath));
                            res.send(data);
                        } else {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({ code: 500, msg: "Unable to download file." }));
                        }

                    });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ code: 500, msg: "Unable to download file." }));
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