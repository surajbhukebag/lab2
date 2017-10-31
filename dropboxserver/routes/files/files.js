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

    kafka.make_request('generateLinkTopic', { "email": req.param("email"), "path": req.param("path") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, link: results.link }));
        }
    });
}

function share(req, res) {

    kafka.make_request('shareTopic', { "email": req.param("email"), "path": req.param("path"), "sharedWith": req.param("sharedWith") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, msg: results.msg, files: results.files, folders: results.folders }));
        }
    });

}

function sharedFiles(req, res) {

    kafka.make_request('sharedFilesTopic', { "email": req.param("email") }, function(err, results) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.send(JSON.stringify({ code: 500, msg: results.msg }));
        } else {
            res.send(JSON.stringify({ code: 200, msg: results.msg, files: results.files, folders: results.folders }));
        }
    });
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