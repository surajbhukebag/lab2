//var mysql = require('./../mysql/fileMysql_connectionpooled');
//var usermysql = require('./../mysql/userMysql_connectionpooled');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');
var File = require('./../model/PoolFile');
var User = require('./../model/PoolUser');
var FileActivity = require('./../model/PoolFileActivity');
var FileLink = require('./../model/PoolFileLink');
var SharedFile = require('./../model/PoolSharedFile');
var LifeEvents = require('./../model/PoolLifeEvents');
var Groups = require('./../model/PoolGroups');

var mime = require('mime-types');
var fs = require("fs");

function fileUpload(userdata, done) {

    var res = {};

     User.findOne({ email: userdata.email }, function(err, user) {

        if (!err) {

            require('crypto').randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                var newFile = File({
                                name: userdata.filename,
                                path: userdata.path,
                                isDirectory: false,
                                createdBy: user.id,
                                dateCreated: new Date().getTime(),
                                isStarred: 0,
                                link: token
                            });
                newFile.save(function(err, savedFile) {
                
                 if (!err) {
                        let p = "./files/" + userdata.email + userdata.path + "/" + userdata.filename;
                        if (userdata.path === '/') {
                            p = "./files/" + userdata.email + userdata.path + userdata.filename;
                        }

                        fs.appendFile(p, userdata.data, 'utf8', function(err) {
                            if (!err) {
                                res.code = 200;
                                res.msg = "File is uploaded";
                                done(null, res);
                            } else {
                                res.code = 500;
                                res.msg = "File Upload Failed";
                                done(err, res);
                            }
                        });


                    } else {
                        res.code = 500;
                        res.msg = "File Upload Failed";
                        done(err, res);
                    }

                });
            });
           
        } else {
            res.code = 500;
            res.msg = "Unable to access user data.Please try later.";
            done(err, res);
        }

    });

}


function uploadfileToSharedFolder(userdata, done) {

    var res = {};

    User.findOne({_id: userdata.owner}, function(err, user) {

        if(!err) {
            let ownerEmail = user.email;

            require('crypto').randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                var newFile = File({
                                name: userdata.filename,
                                path: userdata.path,
                                isDirectory: false,
                                createdBy:  userdata.createdBy,
                                dateCreated: new Date().getTime(),
                                isStarred: 0,
                                link: token
                            });
                newFile.save(function(err, savedFile) {
                
                 if (!err) {
                        let p = "./files/" + ownerEmail + userdata.path + "/" + userdata.filename;
                        if (userdata.path === '/') {
                            p = "./files/" + ownerEmail + userdata.path + userdata.filename;
                        }

                        fs.appendFile(p, userdata.data, 'utf8', function(err) {
                            if (!err) {
                                res.code = 200;
                                res.msg = "File is uploaded";
                                done(null, res);
                            } else {
                                res.code = 500;
                                res.msg = "File Upload Failed";
                                done(err, res);
                            }
                        });


                    } else {
                        res.code = 500;
                        res.msg = "File Upload Failed";
                        done(err, res);
                    }

                });
            });
        }
        else {

        }
    });


}

function getDownloadLink(userdata, done) {

    var res = {};
    let email = userdata.email;
    let p = userdata.path;
    let index = p.lastIndexOf("/");
    let path = "";
    if (index === 0) {
        path = "/";
    } else {
        path = p.substring(0, index);
    }
    let name = p.substring(index + 1);

    User.findOne({ email: email }, function(err, user) {

        if (!err) {

            File.findOne({ createdBy: user.id, name: name, path: path }, function(err, file) {

                if (!err) {

                    res.code = 200;
                    res.link = "http://localhost:3001/filedownload/" + file.link;
                    done(null, res);

                } else {

                    res.code = 500;
                    res.msg = "Unable to fetch file data.";
                    done(err, res);

                }
            });
        } else {

            res.code = 500;
            res.msg = "Download failed.";
            done(err, res);

        }
    });
}

function getSharedFileDownloadLink(userdata, done) {

    var res = {};
    let userId = userdata.userId;
    let p = userdata.path;
    let index = p.lastIndexOf("/");
    let path = "";
    if (index === 0) {
        path = "/";
    } else {
        path = p.substring(0, index);
    }
    let name = p.substring(index + 1);

    File.findOne({ createdBy: userId, name: name, path: path }, function(err, file) {

        if (!err) {

            res.code = 200;
            res.link = "http://localhost:3001/filedownload/" + file.link;
            done(null, res);

        } else {

            res.code = 500;
            res.msg = "Unable to fetch file data.";
            done(err, res);

        }
    });


}

function download(user, file, done, res) {

    let filepath = "files/" + user.email + file.path + "/" + file.name;
    if (file.path === '/') {
        filepath = "files/" + user.email + file.path + file.name;
    }
    console.log(filepath);
    fs.readFile(filepath, "utf8", function(err, data) {
        if (!err) {
            res.code = 200;
            res.data = data;
            res.mimeType = mime.lookup(filepath);
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to download file.";
            done(err, res);
        }

    });

}

function fileDownload(userdata, done) {

    var res = {};
    let filelink = userdata.link;
    
    File.findOne({link: filelink}, function(err, file) {

        if(!err) {
            let userId = file.createdBy;

            User.findOne({_id: userId}, function(err, user) {

                FileActivity.findOne({ 'file.id': file.id }, function(err, fileActivity) {

                         if (!err) {
                             if (fileActivity) {
                                 fileActivity.dateCreated = new Date().getTime();
                                 fileActivity.save(function(err) {
                                    if(!err) {
                                        download(user, file, done, res);
                                    }
                                    else {
                                        res.code = 500;
                                        res.msg = "Unable to download file.";
                                        done(err, res);
                                    }
                                 });

                             } else {

                                 var newFileActivity = FileActivity({
                                     userId: createdBy,
                                     file: {id:file.id ,name: file.name, path: file.path, isDirectory: file.isDirectory, createdBy: file.createdBy, dateCreated: file.dateCreated, isStarred: file.isStarred, link: file.link},
                                     dateCreated: new Date().getTime()
                                 });
                                 newFileActivity.save(function(err) {
                                     if(!err) {
                                        download(user, file, done, res);
                                    }
                                    else {
                                        res.code = 500;
                                        res.msg = "Unable to download file.";
                                        done(err, res);
                                    }
                                 });

                             }

                         } else {
                             res.code = 500;
                             res.msg = "Unable to fetch files.";
                             done(err, res);
                         }

                });

            });
        }
        else {
               res.code = 500;
                res.msg = "Unable to download file.";
                done(err, res);
        }

    });


  
}

function downloadSharedFile(userdata, done) {
    var res = {};
    let filelink = userdata.link;

    FileLink.findOne({ linkString: filelink }, function(err, userfile) {

        File.findOne({ _id: userfile.fileId }, function(err, file) {

            if (!err) {
                let userId = file.createdBy;

                User.findOne({ _id: userId }, function(err, user) {

                    if (!err) {
                        download(user, file, done, res);
                    } else {
                        res.code = 500;
                        res.msg = "Unable to download file.";
                        done(err, res);
                    }

                });
            } else {
                res.code = 500;
                res.msg = "Unable to download file.";
                done(err, res);
            }

        });

    });
}

exports.fileUpload = fileUpload;
exports.uploadfileToSharedFolder = uploadfileToSharedFolder;
exports.getDownloadLink = getDownloadLink;
exports.getSharedFileDownloadLink = getSharedFileDownloadLink;
exports.fileDownload = fileDownload;
exports.downloadSharedFile = downloadSharedFile;