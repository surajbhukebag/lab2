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
            let name = req.files[0].originalname
            fs.readFile("./files/" + name, "utf8", function(err, data) {
                kafka.make_request('fileuploadTopic', { "data": data, "filename": req.files[0].originalname, "email": req.body.name, "path": req.body.path }, function(err, results) {
                    res.setHeader('Content-Type', 'application/json');
                    if (err) {
                        res.send(JSON.stringify({ code: 500, msg: results.msg }));
                    } else {

                        fs.unlink("./files/" + name, function(err) {
                            if (err) {
                                res.send(JSON.stringify({ code: 500, msg: results.msg }));
                            } else {
                                let responseJson = { code: 200, msg: "File is uploaded" }
                                res.send(JSON.stringify(responseJson));
                            }
                        });


                    }

                });

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

            fs.readFile("./files/" + name, "utf8", function(err, data) {
                kafka.make_request('uploadfileToSharedFolderTopic', { "data": data, "owner": req.body.owner, "createdBy": createdBy, "path": req.body.path, "filename": name }, function(err, results) {
                    res.setHeader('Content-Type', 'application/json');
                    if (err) {
                        res.send(JSON.stringify({ code: 500, msg: results.msg }));
                    } else {

                        fs.unlink("./files/" + name, function(err) {
                            if (err) {
                                res.send(JSON.stringify({ code: 500, msg: results.msg }));
                            } else {
                                let responseJson = { code: 200, msg: "File is uploaded" }
                                res.send(JSON.stringify(responseJson));
                            }
                        });
                    }
                });
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
            res.contentType(results.mimeType);
            res.send(results.data);
        }
    });
}


function downloadSharedFile(req, res) {

    kafka.make_request('downloadSharedFileTopic', { "link": req.param("link") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.contentType(results.mimeType);
            res.send(results.data);
        }
    });


}

exports.uploadfile = uploadfile;
exports.filedownload = filedownload;
exports.getDownloadLink = getDownloadLink;
exports.downloadSharedFile = downloadSharedFile;
exports.getSharedFileDownloadLink = getSharedFileDownloadLink;
exports.uploadfileToSharedFolder = uploadfileToSharedFolder;