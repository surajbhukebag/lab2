//var mysql = require('./../mysql/fileMysql_connectionpooled');
//var usermysql = require('./../mysql/userMysql_connectionpooled');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');

var fs = require("fs");
var rmrf = require('rimraf');

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
                var link = "http://localhost:3001/fileDownload/"+files[i].link;
                result.push({ link:link, owner: files[i].createdBy, fileId: files[i].id, path: path, isDirectory: files[i].isDirectory, name: files[i].name, starred: files[i].isStarred });
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

function createFolder(userdata, done) {

    var res = {};
    let checkUsernameQuery = "select * from user where email = ?";
    usermysql.checkUsername(function(uniqueUsername, err, result) {
        if (!err) {
            let storeFileQuery = "insert into files (name, path, isDirectory, createdBy, dateCreated, isStarred) values (?,?,?,?,?,?)";

            fs.mkdir("./files/" + userdata.email + userdata.path + "/" + userdata.folderName, function(err) {
                if (err) {
                    res.code = 500;
                    res.msg = "New folder creation failed";
                    done(err, res);
                } else {
                    mysql.storeFileDetails(function(r, err, uId) {
                        if (!err) {
                            res.code = 200;
                            res.msg = "New folder created";
                            done(null, res);
                        } else {
                            res.code = 500;
                            res.msg = "New folder creation failed";
                            done(err, res);
                        }

                    }, storeFileQuery, userdata.folderName, userdata.path, 1, result[0].id, new Date().getTime());
                }
            });

        } else {
            res.code = 500;
            res.msg = "New folder creation failed";
            done(err, res);
        }

    }, checkUsernameQuery, userdata.email);

}

function fileFolderDelete(userdata, done) {

    var res = {};
    let path = userdata.path;
    let email = userdata.email;
    let isDirectory = userdata.isDirectory;
    let userId = userdata.userId;

    let index = path.lastIndexOf("/");
    let p = "";
    if (index === 0) {
        p = "/";
    } else {
        p = path.substring(0, index);
    }
    let name = path.substring(index + 1);

    let deleteFileQuery = "delete from files where name = ? and path = ? and createdBy = ?";
    mysql.deleteFile(function(r, err) {
        if (!err) {

            if (isDirectory) {

                rmrf("./files/" + email + "/" + path, function(err) {
                    if (err) {
                        res.code = 500;
                        res.msg = "Folder Deletion failed";
                        done(err, res);

                    } else {
                        res.code = 200;
                        res.msg = "Folder Deletion successful";
                        done(null, res);
                    }
                });

            } else {

                fs.unlink("./files/" + email + "/" + path, function(err) {
                    if (err) {
                        res.code = 500;
                        res.msg = "File Deletion failed";
                        done(err, res);
                    } else {
                        res.code = 200;
                        res.msg = "File Deletion successful";
                        done(null, res);
                    }
                });

            }


        } else {
            res.code = 500;
            res.msg = "Folder Deletion failed";
            done(err, res);
        }
    }, deleteFileQuery, name, p, userId);
}

function userStarredFiles(userdata, done) {

    let userId = userdata.userId;
    var res = {};
    let starredFilesQuery = "select * from files where createdBy = ? and isStarred = ?";
    mysql.getStarredFiles(function(result, err) {
        if (!err) {
            let re = [];
            for (var i = 0; i < result.length; i++) {
                let p = "";
                if (result[i].path === "/") {
                    p = result[i].path + result[i].name
                } else {
                    p = result[i].path + "/" + result[i].name
                }

                re.push({ fileId: result[i].id, starred: result[i].isStarred, path: p, isDirectory: result[i].isDirectory, name: result[i].name });
            }
            res.code = 200;
            res.starred = re;
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to fetch starred files.";
            done(err, res);
        }

    }, starredFilesQuery, userId);
}

function userActivity(userdata, done) {

    let userId = userdata.userId;
    var res = {};
    let userActivityQuery = "SELECT f.id as id, f.name as name, f.path as path , l.dateCreated as dateCreated, f.isDirectory as dir, f.isStarred as star FROM files f INNER JOIN fileactivity l on f.id = l.fileId where l.userId = ? order by l.dateCreated desc limit 7";

    mysql.getUserActivity(function(result, err) {
        if (!err) {
            let files = [];
            for (var i = 0; i < result.length; i++) {

                files.push({ name: result[i].name, path: result[i].path + result[i].name, starred: result[i].star, isDirectory: result[i].dir, fileId: result[i].id, date: result[i].dateCreated });

            }
            res.code = 200;
            res.activity = files;
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to get User Activity.";
            done(err, res);
        }
    }, userActivityQuery, userId);
}

function sharedFileLinks(userdata, done) {

    let email = userdata.email;
    var res = {};
    let getUserQuery = "select * from user where email = ?";
    usermysql.getUser(function(uniqueUsername, err, result) {
        if (!err) {
            let getSharedFileLinksQuery = "SELECT f.name as name, f.path as path , l.linkString as link FROM files f INNER JOIN filelink l on f.id = l.fileId where l.createdBy = ?"
            mysql.getSharedLinkFiles(function(f, err) {

                if (!err) {

                    let links = [];

                    for (var i = 0; i < f.length; i++) {

                        links.push({ name: f[i].name, path: f[i].path + f[i].name, link: "http://localhost:3001/downloadSharedFile/" + f[i].link, owner: result[0].id });

                    }
                    res.code = 200;
                    res.msg = "Retrieved shared data.";
                    res.links = links;
                    done(null, res);
                } else {
                    res.code = 500;
                    res.msg = "Unable to Retrieve shared data.";
                    done(err, res);
                }

            }, getSharedFileLinksQuery, result[0].id);

        } else {
            res.code = 500;
            res.msg = "Unable to Retrieve shared link data.";
            done(err, res);
        }

    }, getUserQuery, email);
}

function starFile(userdata, done) {

    var res = {};
    let createdBy = userdata.id;
    let p = userdata.path;
    let index = p.lastIndexOf("/");
    let path = "";
    let starReq = userdata.star;
    let isStarred = false;
    if (starReq === 'star') {
        isStarred = true;
    }
    if (index === 0) {
        path = "/";
    } else {
        path = p.substring(0, index);
    }
    let name = p.substring(index + 1);

    let starAFileQuery = "update files set isStarred = ? where createdBy = ? and name = ? and path = ?";
    mysql.starFile(function(result, err) {
        if (!err) {

            let fileQuery = "select * from files where createdBy = ? and name = ? and path = ?";
            mysql.getUserFile(function(r, err) {

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

            }, fileQuery, createdBy, name, path);


            if (isStarred) {
                res.code = 200;
                res.msg = "File/Fodler starred.";
                done(null, res);
            } else {
                res.code = 200;
                res.msg = "File/Fodler Unstarred.";
                done(null, res);
            }

        } else {
            res.code = 500;
            res.msg = "Unable to star file/fodler.";
            done(err, res);

        }
    }, starAFileQuery, isStarred, createdBy, name, path);

}

function sharedFiles(userdata, done) {

    let email = userdata.email;
    var res = {};
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
                    res.code = 200;
                    res.msg = "Retrieved shared data.";
                    res.files = files;
                    res.folders = folders;
                    done(null, res);
                } else {
                    res.code = 500;
                    res.msg = "Unable to Retrieve shared data.";
                    done(err, res);
                }

            }, sharedFilesQuery, result[0].id);

        } else {
            res.code = 500;
            res.msg = "Unable to Retrieve shared data.";
            done(err, res);
        }

    }, getUserQuery, email);

}

function share(userdata, done) {

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
    let sharedWithList = [];
    let name = p.substring(index + 1);
    let shareListString = userdata.sharedWith;
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
                                        res.code = 200;
                                        res.msg = "File/Folder is shared";
                                        done(null, res);
                                    } else {
                                        res.code = 500;
                                        res.msg = "Share file/folder failed.";
                                        done(err, res);
                                    }

                                }, shareFileQuery, fileId, uid, sharedWith[0].id);


                            } else {
                                res.code = 500;
                                res.msg = "Share file/folder failed.";
                                done(err, res);
                            }
                        }, getUserQuery, sharedWithList[i]);
                    }
                } else {
                    res.code = 500;
                    res.msg = "Share file/folder failed.";
                    done(err, res);
                }
            }, fileQuery, uid, name, path);
        } else {
            res.code = 500;
            res.msg = "Share file/folder failed.";
            done(err, res);
        }
    }, getUserQuery, email);

}

function generateLink(userdata, done) {

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
                                res.code = 200;
                                res.link = "http://localhost:3001/downloadSharedFile/" + rs[0].linkString;
                                done(null, res);
                            } else {
                                let generateLinkQuery = "insert into filelink(linkString, fileId, dateCreated, createdBy) values (?,?,?,?)";
                                mysql.generateLink(function(token, err) {

                                    if (!err) {
                                        res.code = 200;
                                        res.link = "http://localhost:3001/downloadSharedFile/" + token;
                                        done(null, res);
                                    } else {
                                        res.code = 500;
                                        res.msg = "Unable to Generate Link.";
                                        done(err, res);
                                    }

                                }, generateLinkQuery, r[0].id, result[0].id);
                            }
                        } else {

                        }
                    }, checkLinkQuery, r[0].id);

                } else {
                    res.code = 500;
                    res.msg = "Unable to Generate Link.";
                    done(err, res);
                }

            }, userFilesQuery, result[0].id, name, path);
        } else {
            res.code = 500;
            res.msg = "Unable to Generate Link.";
            done(err, res)
        }

    }, getUserQuery, email);

}

exports.listdir = listdir;
exports.listSharedDir = listSharedDir;
exports.createFolder = createFolder;
exports.fileFolderDelete = fileFolderDelete;
exports.userStarredFiles = userStarredFiles;
exports.userActivity = userActivity;
exports.sharedFileLinks = sharedFileLinks;
exports.starFile = starFile;
exports.sharedFiles = sharedFiles;
exports.share = share;
exports.generateLink = generateLink;