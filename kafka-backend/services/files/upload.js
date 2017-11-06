//var mysql = require('./../mysql/fileMysql_connectionpooled');
//var usermysql = require('./../mysql/userMysql_connectionpooled');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');

var mime = require('mime-types');
var fs = require("fs");

function fileUpload(userdata, done) {

    var res = {};
    let checkUsernameQuery = "select * from user where email = ?";
    usermysql.getUser(function(uniqueUsername, err, result) {
        if (!err) {
            let storeFileQuery = "insert into files (name, path, isDirectory, createdBy, dateCreated, isStarred, link) values (?,?,?,?,?,?,?)";
            require('crypto').randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');

                mysql.storeFileDetails(function(rss, err, uid) {
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

                }, storeFileQuery, userdata.filename, userdata.path, 0, result[0].id, new Date().getTime(), token);

            });

        } else {
            res.code = 500;
            res.msg = "File Upload Failed";
            done(err, res);
        }

    }, checkUsernameQuery, userdata.email);
}


function uploadfileToSharedFolder(userdata, done) {

    var res = {};
    let userQuery = "select * from user where id = ?";
    usermysql.getUserById(function(user, err) {
        if (!err && user.length > 0) {
            let ownerEmail = user[0].email;

            let storeFileQuery = "insert into files (name, path, isDirectory, createdBy, dateCreated, isStarred, link) values (?,?,?,?,?,?,?)";
            require('crypto').randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');

                mysql.storeFileDetails(function(rss, err, uid) {
                    if (!err) {
                        let p = "./files/" + ownerEmail + userdata.path + "/" + userdata.filename;
                        if (userdata.path === '/') {
                            p = "./files/" + ownerEmail + userdata.path + userdata.filename;
                        }
                        fs.appendFile(p, userdata.data, "utf8", function(err) {
                            if (!err) {
                                res.ownerEmail = ownerEmail;
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

                }, storeFileQuery, userdata.filename, userdata.path, 0, userdata.createdBy, new Date().getTime(), token);

            });

        } else {
            res.code = 500;
            res.msg = "File Upload Failed";
            done(err, res);
        }
    }, userQuery, userdata.owner);
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

    let getUserQuery = "select * from user where email = ?";
    usermysql.getUser(function(uniqueUsername, err, result) {

        if (!err) {

            let userFilesQuery = "select * from files where createdBy = ? and name = ? and path = ?";

            mysql.getUserFile(function(r, err) {
                if (!err) {
                    res.code = 200;
                    res.link = "http://localhost:3001/filedownload/" + r[0].link;
                    done(null, res);
                } else {
                    res.code = 500;
                    res.msg = "Unable to fetch file data.";
                    done(err, res);
                }

            }, userFilesQuery, result[0].id, name, path);
        } else {
            res.code = 500;
            res.msg = "Download failed.";
            done(err, res);
        }

    }, getUserQuery, email);
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

    let userFilesQuery = "select * from files where createdBy = ? and name = ? and path = ?";

    mysql.getUserFile(function(r, err) {
        if (!err) {
            res.code = 200;
            res.link = "http://localhost:3001/filedownload/" + r[0].link;
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to fetch file data.";
            done(err, res);
        }

    }, userFilesQuery, userId, name, path);

}

function fileDownload(userdata, done) {

    var res = {};
    let filelink = userdata.link;
    let fileQuery = "select * from files where link = ?";
    mysql.getFileLink(function(file, err) {

        let userQuery = "select * from user where id = ?";
        usermysql.getUserById(function(user, err) {

            if (!err) {

                let checkFileActivityQuery = "select * from fileactivity where userId = ? and fileId = ?";
                mysql.checkFileActivity(function(rr, err) {
                    if (!err) {

                        if (rr.length === 0) {
                            let addToFileActivityQuery = "insert into fileactivity (dateCreated, userId, fileId) values (?,?,?)";
                            mysql.addToFileActivity(function(err) {


                                let filepath = "files/" + user[0].email + file[0].path + "/" + file[0].name;
                                if (file[0].path === '/') {
                                    filepath = "files/" + user[0].email + file[0].path + file[0].name;
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


                            }, addToFileActivityQuery, user[0].id, file[0].id);
                        } else {

                            let filepath = "files/" + user[0].email + file[0].path + "/" + file[0].name;
                            if (file[0].path === '/') {
                                filepath = "files/" + user[0].email + file[0].path + file[0].name;
                            }
                            let updateFileActivityQuery = "update fileactivity set dateCreated = ? where userId = ? and fileId = ?";
                            mysql.addToFileActivity(function(err) {

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

                            }, updateFileActivityQuery, user[0].id, file[0].id);
                        }
                    }
                }, checkFileActivityQuery, user[0].id, file[0].id);

            } else {
                res.code = 500;
                res.msg = "Unable to download file.";
                done(err, res);
            }

        }, userQuery, file[0].createdBy);


    }, fileQuery, filelink);
}

function downloadSharedFile(userdata, done) {
    var res = {};
    let filelink = userdata.link;
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
                } else {
                    res.code = 500;
                    res.msg = "Unable to download file.";
                    done(err, res);
                }

            }, userQuery, file[0].createdBy);


        }, fileQuery, f[0].fileId);


    }, fileQuery, filelink);
}

exports.fileUpload = fileUpload;
exports.uploadfileToSharedFolder = uploadfileToSharedFolder;
exports.getDownloadLink = getDownloadLink;
exports.getSharedFileDownloadLink = getSharedFileDownloadLink;
exports.fileDownload = fileDownload;
exports.downloadSharedFile = downloadSharedFile;