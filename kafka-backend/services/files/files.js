var mysql = require('./../mysql/fileMysql_connectionpooled');
var usermysql = require('./../mysql/userMysql_connectionpooled');


function listdir(userdata, done) {

    let isRoot = true;
    let dir = userdata.dir;
    let createdBy = userdata.id;
    var res = {};

    if (dir !== '/' && dir.lastIndexOf('/') === 0) {
        let n = dir.substring(1);
        let getFodlerQuery = "select * from files where createdBy = ? and name = ? and path = ?";
        mysql.getFileByPathAndName(function(r, err) {
            if (!err) {
                let checkFileActivityQuery = "select * from fileactivity where userId = ? and fileId = ?";
                mysql.checkFileActivity(function(rr, err) {

                    if (!err) {

                        if (rr.length === 0) {
                            let addToFileActivityQuery = "insert into fileactivity (dateCreated, userId, fileId) values (?,?,?)";
                            mysql.addToFileActivity(function(err) {}, addToFileActivityQuery, createdBy, r[0].id);
                        } else {

                            let updateFileActivityQuery = "update fileactivity set dateCreated = ? where userId = ? and fileId = ?";
                            mysql.addToFileActivity(function(err) {}, updateFileActivityQuery, createdBy, r[0].id);
                        }
                    }
                }, checkFileActivityQuery, createdBy, r[0].id);
            }

        }, getFodlerQuery, createdBy, n, "/");

    }

    let filesQuery = "select * from files where createdBy = ? and path = ?";
    mysql.getFileList(function(files, err) {

        if (!err) {
            var result = [];
            for (var i = 0; i < files.length; i++) {
                let path = "";
                if (files[i].path === '/') {
                    path = files[i].path + files[i].name;
                } else {
                    path = files[i].path + "/" + files[i].name;
                }

                result.push({ fileId: files[i].id, path: path, isDirectory: files[i].isDirectory, name: files[i].name, starred: files[i].isStarred });
            }
            res.code = 200;
            res.files = result;
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to fetch files.";
            done(err, res);
        }
    }, filesQuery, createdBy, dir);
}

function listSharedDir(userdata, done) {

    let isRoot = true;
    let dir = userdata.dir;
    let createdBy = userdata.id;
    let loggedInUser = userdata.user;

    var res = {};

    if (dir !== '/' && dir.lastIndexOf('/') === 0) {
        let n = dir.substring(1);
        let getFodlerQuery = "select * from files where createdBy = ? and name = ? and path = ?";
        mysql.getFileByPathAndName(function(r, err) {
            if (!err) {
                if (createdBy == loggedInUser) {

                    let checkFileActivityQuery = "select * from fileactivity where userId = ? and fileId = ?";
                    mysql.checkFileActivity(function(rr, err) {

                        if (!err) {

                            if (rr.length === 0) {
                                let addToFileActivityQuery = "insert into fileactivity (dateCreated, userId, fileId) values (?,?,?)";
                                mysql.addToFileActivity(function(err) {}, addToFileActivityQuery, createdBy, r[0].id);
                            } else {

                                let updateFileActivityQuery = "update fileactivity set dateCreated = ? where userId = ? and fileId = ?";
                                mysql.addToFileActivity(function(err) {}, updateFileActivityQuery, createdBy, r[0].id);
                            }
                        }
                    }, checkFileActivityQuery, createdBy, r[0].id);

                }

            }

        }, getFodlerQuery, createdBy, n, "/");

    }

    let filesQuery = "select * from files where path = ? and (createdBy = ? or createdBy in (select sharedWith from sharedfiles where sharedBy = ?))";
    mysql.getSharedFileList(function(files, err) {

        if (!err) {
            var result = [];
            for (var i = 0; i < files.length; i++) {
                let path = "";
                if (files[i].path === '/') {
                    path = files[i].path + files[i].name;
                } else {
                    path = files[i].path + "/" + files[i].name;
                }

                result.push({ owner: files[i].createdBy, fileId: files[i].id, path: path, isDirectory: files[i].isDirectory, name: files[i].name, starred: files[i].isStarred });
            }
            res.code = 200;
            res.files = result;
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to fetch files.";
            done(err, res);
        }
    }, filesQuery, createdBy, dir);


}

exports.listdir = listdir;
exports.listSharedDir = listSharedDir;