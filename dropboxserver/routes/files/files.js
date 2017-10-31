var fs = require('fs');
var rmrf = require('rimraf');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');
var kafka = require("./../kafka/client");

function listdir(req, res) {

    kafka.make_request('listdirTopic', { "id": req.param("id"), "dir": req.param("dir") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ code: 500, msg: err }));
        } else {
            let responseJson = { code: 200, files: results.files }
            res.send(JSON.stringify(responseJson));
        }
    });


}

function listSharedDir(req, res) {

    kafka.make_request('listSharedDirTopic', { "id": req.param("id"), "dir": req.param("dir"), "user": req.param("user") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ code: 500, msg: err }));
        } else {
            let responseJson = { code: 200, files: results.files }
            res.send(JSON.stringify(responseJson));
        }
    });

}

function createFolder(req, res) {

    kafka.make_request('createFolderTopic', { "email": req.param("email"), "folderName": req.param("folderName"), "path": req.param("path") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {

            fs.mkdir("./files/" + req.param("email") + req.param("path") + "/" + req.param("folderName"), function(err) {
                if (!err) {
                    let responseJson = { code: 200, msg: "New folder created" };
                    res.send(JSON.stringify(responseJson));
                } else {
                    res.send(JSON.stringify({ code: 500, msg: "New folder creation failed" }));
                }
            });

        }
    });
}

function fileFolderDelete(req, res) {

    let path = req.param("path");
    let email = req.param("email");
    let isDirectory = req.param("isDirectory");

    kafka.make_request('fileFolderDeleteTopic', { "userId": req.param("id"), "email": req.param("email"), "isDirectory": req.param("isDirectory"), "path": req.param("path") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            if (isDirectory) {

                rmrf("./files/" + email + "/" + path, function(err) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({ code: 500, msg: "Folder Deletion failed" }));

                    } else {
                        res.send(JSON.stringify({ code: 200, msg: "Folder Deletion successful" }));
                    }
                });

            } else {

                fs.unlink("./files/" + email + "/" + path, function(err) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({ code: 500, msg: "File Deletion failed" }));
                    } else {
                        res.send(JSON.stringify({ code: 200, msg: "File Deletion successful" }));
                    }
                });

            }
        }
    });
}


function starredFiles(req, res) {

    kafka.make_request('userStarredFilesTopic', { "userId": req.param("userId") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            let responseJson = { code: 200, starred: results.starred };
            res.send(JSON.stringify(responseJson));
        }
    });
}

function generateLink(req, res) {


    let email = req.param("email");
    let p = req.param("path");
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

                    let checkFileActivityQuery = "select * from fileactivity where userId = ? and fileId = ?";
                    mysql.checkFileActivity(function(rr, err) {

                        if (!err) {

                            if (rr.length === 0) {
                                let addToFileActivityQuery = "insert into fileactivity (dateCreated, userId, fileId) values (?,?,?)";
                                mysql.addToFileActivity(function(err) {}, addToFileActivityQuery, result[0].id, r[0].id);
                            } else {

                                let updateFileActivityQuery = "update fileactivity set dateCreated = ? where userId = ? and fileId = ?";
                                mysql.addToFileActivity(function(err) {}, updateFileActivityQuery, result[0].id, r[0].id);
                            }
                        }
                    }, checkFileActivityQuery, result[0].id, r[0].id);

                    let checkLinkQuery = "select * from filelink where fileId = ?";
                    mysql.getFileLink(function(rs, err) {

                        if (!err) {
                            if (rs.length > 0) {
                                let responseJson = { code: 200, link: "http://localhost:3001/downloadSharedFile/" + rs[0].linkString };
                                res.send(JSON.stringify(responseJson));
                            } else {
                                let generateLinkQuery = "insert into filelink(linkString, fileId, dateCreated, createdBy) values (?,?,?,?)";
                                mysql.generateLink(function(token, err) {

                                    if (!err) {
                                        console.log("link : " + token);
                                        let responseJson = { code: 200, link: "http://localhost:3001/downloadSharedFile/" + token };
                                        res.send(JSON.stringify(responseJson));
                                    } else {
                                        console.log("link " + err);
                                        res.send(JSON.stringify({ code: 500, msg: "Unable to Generate Link." }));
                                    }

                                }, generateLinkQuery, r[0].id, result[0].id);
                            }
                        } else {

                        }
                    }, checkLinkQuery, r[0].id);

                } else {
                    console.log("link " + err);
                    res.send(JSON.stringify({ code: 500, msg: "Unable to fetch starred files." }));
                }

            }, userFilesQuery, result[0].id, name, path);
        } else {
            console.log("link " + err);
            res.send(JSON.stringify({ code: 500, msg: "Link Generation failed" }));
        }

    }, getUserQuery, email);



}

function share(req, res) {


    let email = req.param("email");
    let p = req.param("path");
    let index = p.lastIndexOf("/");
    let path = "";
    if (index === 0) {
        path = "/";
    } else {
        path = p.substring(0, index);
    }
    let sharedWithList = [];
    let name = p.substring(index + 1);
    let shareListString = req.param("sharedWith");
    if (shareListString.includes(',')) {
        let splitArr = shareListString.split(',');
        for (var j = 0; j < splitArr.length; j++) {
            sharedWithList.push(splitArr[j].trim());
        }
    } else {
        sharedWithList.push(shareListString.trim());
    }

    let getUserQuery = "select * from user where email = ?";
    usermysql.getUser(function(uniqueUsername, err, result) {
        if (!err) {
            let uid = result[0].id;
            let fileQuery = "select * from files where createdBy = ? and name = ? and path = ?";
            mysql.getUserFile(function(r, err) {
                if (!err) {
                    let fileId = r[0].id;
                    let shareFileQuery = "insert into sharedfiles (fileId, sharedBy, sharedWith, dateCreated) values (?, ?, ?, ?)";
                    for (var i = 0; i < sharedWithList.length; i++) {
                        usermysql.getUser(function(uniqueUsername, err, sharedWith) {
                            console.log("ssss : " + sharedWith.length);
                            if (!err && sharedWith.length !== 0) {

                                let checkFileActivityQuery = "select * from fileactivity where userId = ? and fileId = ?";
                                mysql.checkFileActivity(function(rr, err) {

                                    if (!err) {

                                        if (rr.length === 0) {
                                            let addToFileActivityQuery = "insert into fileactivity (dateCreated, userId, fileId) values (?,?,?)";
                                            mysql.addToFileActivity(function(err) {}, addToFileActivityQuery, uid, fileId);
                                        } else {

                                            let updateFileActivityQuery = "update fileactivity set dateCreated = ? where userId = ? and fileId = ?";
                                            mysql.addToFileActivity(function(err) {}, updateFileActivityQuery, uid, fileId);
                                        }
                                    }
                                }, checkFileActivityQuery, uid, fileId);


                                mysql.createSharedFile(function(succ, err) {
                                    if (!err) {
                                        res.send(JSON.stringify({ code: 200, msg: "File/Folder is shared" }));
                                    } else {
                                        res.send(JSON.stringify({ code: 500, msg: "Share file/folder failed." }));
                                    }

                                }, shareFileQuery, fileId, uid, sharedWith[0].id);


                            } else {
                                res.send(JSON.stringify({ code: 500, msg: "Share file/folder failed." }));
                            }
                        }, getUserQuery, sharedWithList[i]);
                    }
                } else {
                    res.send(JSON.stringify({ code: 500, msg: "Share file/folder failed." }));
                }
            }, fileQuery, uid, name, path);
        } else {
            res.send(JSON.stringify({ code: 500, msg: "Share file/folder failed." }));
        }
    }, getUserQuery, email);


}

function sharedFiles(req, res) {


    let email = req.param("email");
    let getUserQuery = "select * from user where email = ?";
    usermysql.getUser(function(uniqueUsername, err, result) {
        if (!err) {

            let sharedFilesQuery = "select * from files where id in (select fileId from sharedfiles where sharedBy = ? or sharedWith = ?)";
            mysql.getSharedFiles(function(f, err) {

                if (!err) {

                    let files = [],
                        folders = [],
                        links = [];

                    for (var i = 0; i < f.length; i++) {

                        if (f[i].isDirectory) {
                            folders.push({ name: f[i].name, path: f[i].path + f[i].name, owner: f[i].createdBy, isStarred: f[i].isStarred, isDirectory: true });
                        } else {
                            files.push({ name: f[i].name, link: "http://localhost:3001/fileDownload/" + f[i].link, path: f[i].path + f[i].name, owner: f[i].createdBy, isStarred: f[i].isStarred, isDirectory: false });
                        }

                    }

                    res.send(JSON.stringify({ code: 200, msg: "Retrieved shared data.", files: files, folders: folders }));
                } else {
                    res.send(JSON.stringify({ code: 500, msg: "Unable to Retrieve shared data." }));
                }

            }, sharedFilesQuery, result[0].id);

        } else {
            res.send(JSON.stringify({ code: 500, msg: "Unable to Retrieve shared data." }));
        }

    }, getUserQuery, email);



}

function sharedFileLinks(req, res) {

    kafka.make_request('sharedFileLinksTopic', { "email": req.param("email") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, msg: "Retrieved shared data.", links: results.links }));
        }
    });
}

function starAFile(req, res) {

    kafka.make_request('starFileTopic', { "id": req.param("id"), "path": req.param("path"), "star": req.param("star") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, msg: results.msg }));
        }
    });
}

function userActivity(req, res) {

    kafka.make_request('userActivityTopic', { "userId": req.param("userId") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, activity: results.activity }));
        }
    });

}

exports.listdir = listdir;
exports.createFolder = createFolder;
exports.fileFolderDelete = fileFolderDelete;
exports.starredFiles = starredFiles;
exports.generateLink = generateLink;
exports.share = share;
exports.sharedFiles = sharedFiles;
exports.sharedFileLinks = sharedFileLinks;
exports.starAFile = starAFile;
exports.userActivity = userActivity;
exports.listSharedDir = listSharedDir;