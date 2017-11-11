//var mysql = require('./../mysql/fileMysql_connectionpooled');
//var usermysql = require('./../mysql/userMysql_connectionpooled');
var mysql = require('./../mysql/fileMysql');
var usermysql = require('./../mysql/userMysql');
var File = require('./../model/File');
var User = require('./../model/User');
var FileActivity = require('./../model/FileActivity');
var FileLink = require('./../model/FileLink');
var SharedFile = require('./../model/SharedFile');

var fs = require("fs");
var rmrf = require('rimraf');

function listdir(userdata, done) {

 let isRoot = true;
 let dir = userdata.dir;
 let createdBy = userdata.id;
 var res = {};

 if (dir !== '/' && dir.lastIndexOf('/') === 0) {
     let n = dir.substring(1);
     File.findOne({ createdBy: createdBy, name: n, path: "/" }, function(err, file) {

             if (!err) {

                 FileActivity.findOne({ 'file.id': file.id }, function(err, fileActivity) {

                         if (!err) {
                             if (fileActivity) {
                                 fileActivity.dateCreated = new Date().getTime();
                                 fileActivity.save(function(err) {

                                 });

                             } else {

                                 var newFileActivity = FileActivity({
                                     userId: createdBy,
                                     file: {id:file.id ,name: file.name, path: file.path, isDirectory: file.isDirectory, createdBy: file.createdBy, dateCreated: file.dateCreated, isStarred: file.isStarred, link: file.link},
                                     dateCreated: new Date().getTime()
                                 });
                                 newFileActivity.save(function(err) {

                                 });

                             }

                         } else {
                             res.code = 500;
                             res.msg = "Unable to fetch files.";
                             done(err, res);
                         }

                     });
                 }
                 else {

                     res.code = 500;
                     res.msg = "Unable to fetch files.";
                     done(err, res);
                 }

             });
     }

     File.find({ createdBy: createdBy, path: dir }, function(err, files) {

         if (!err) {
             var result = [];
             for (var i = 0; i < files.length; i++) {
                 let path = "";
                 if (files[i].path === '/') {
                     path = files[i].path + files[i].name;
                 } else {
                     path = files[i].path + "/" + files[i].name;
                 }
                 let st = 0;
                 if(files[i].isStarred) {
                    st = 1;
                 }
                 result.push({ fileId: files[i].id, path: path, isDirectory: files[i].isDirectory, name: files[i].name, starred: st });
             }
             res.code = 200;
             res.files = result;
             done(null, res);
         } else {
             res.code = 500;
             res.msg = "Unable to fetch files.";
             done(err, res);
         }

     });
}

function listSharedDir(userdata, done) {

    let isRoot = true;
    let dir = userdata.dir;
    let createdBy = userdata.id;
    let loggedInUser = userdata.user;

    console.log("Created by : "+createdBy+" Loggedin user : "+loggedInUser+" Dir : "+dir)
    var res = {};

    if (dir !== '/' && dir.lastIndexOf('/') === 0) {
        let n = dir.substring(1);
        let getFodlerQuery = "select * from files where createdBy = ? and name = ? and path = ?";
        File.findOne({ createdBy: createdBy, name: n, path: "/" }, function(err, file) {

            if (!err) {

                FileActivity.findOne({ userId: createdBy, 'file.id': file.id }, function(err, fileActivity) {

                    if (!err) {
                        if (fileActivity) {
                            fileActivity.dateCreated = new Date().getTime();
                            fileActivity.save(function(err) {

                            });

                        } else {

                            var newFileActivity = FileActivity({
                                userId: createdBy,
                                fileId: { name: file.name, path: file.path, isDirectory: file.isDirectory, createdBy: file.createdBy, dateCreated: file.dateCreated, isStarred: file.isStarred, link: file.link },
                                dateCreated: new Date().getTime()
                            });
                            newFileActivity.save(function(err) {

                            });

                        }

                    } else {
                        res.code = 500;
                        res.msg = "Unable to fetch files.";
                        done(err, res);
                    }

                });
            } else {

                res.code = 500;
                res.msg = "Unable to fetch files.";
                done(err, res);
            }

        });

    }

    SharedFile.find({ 'file.path': dir, $or: [{ sharedBy: createdBy, sharedWith: createdBy }] }, function(err, sharedFiles) {

        if (!err) {

            var result = [];
            for (var i = 0; i < sharedFiles.length; i++) {
                let path = "";
                if (sharedFiles[i].file.path === '/') {
                    path = sharedFiles[i].file.path + sharedFiles[i].file.name;
                } else {
                    path = sharedFiles[i].file.path + "/" + sharedFiles[i].file.name;
                }
                var link = "http://localhost:3001/fileDownload/" + sharedFiles[i].file.link;
                result.push({ link: link, owner: sharedFiles[i].file.createdBy, fileId: sharedFiles[i].file.id, path: path, isDirectory: sharedFiles[i].file.isDirectory, name: sharedFiles[i].file.name, starred: sharedFiles[i].file.isStarred });
            }
            res.code = 200;
            res.files = result;
            done(null, res);

        } else {

            res.code = 500;
            res.msg = "Unable to fetch files.";
            done(err, res);

        }

    });

}
function createFolder(userdata, done) {

    var res = {};

    User.findOne({ email: userdata.email }, function(err, user) {

        if (!err) {

            var newFolder = File({ name: userdata.folderName, path: userdata.path, isDirectory: true, createdBy: user.id, dateCreated: new Date().getTime(), isStarred: false });
            newFolder.save(function(err, folder) {

                if (!err) {

                    fs.mkdir("./files/" + userdata.email + userdata.path + "/" + userdata.folderName, function(err) {
                        if (err) {
                            res.code = 500;
                            res.msg = "New folder creation failed";
                            done(err, res);
                        } else {
                            res.code = 200;
                            res.msg = "New folder created";
                            done(null, res);
                        }
                    });

                } else {
                    res.code = 500;
                    res.msg = "New folder creation failed";
                    done(err, res);
                }

            });
        } else {
            res.code = 500;
            res.msg = "Unable to fetch user data.";
            done(err, res);
        }

    });
   

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

    File.remove({ name: name, path: p, createdBy: userId }, function(err) {

            if (!err) {

                if (isDirectory) {

                    rmrf("./files/" + email + "/" + path, function(err) {
                        if (err) {
                            res.code = 500;
                            res.msg = "Folder Deletion failed";
                            done(err, res);

                        } else {

                            FileActivity.remove({'file.name': name, 'file.path':p, 'file.createdBy': userId}, function(err) {
                                
                                if(!err) {
                                    
                                    res.code = 200;
                                    res.msg = "Folder Deletion successful";
                                    done(null, res);
                                }
                                else {
                                    res.code = 500;
                                    res.msg = "Folder Deletion failed";
                                    done(err, res);
                                }
                            });
                    
                        }
                    });

                } else {

                    fs.unlink("./files/" + email + "/" + path, function(err) {
                        if (err) {
                            res.code = 500;
                            res.msg = "File Deletion failed";
                            done(err, res);
                        } else {
                             FileActivity.remove({'file.name': name, 'file.path':p, 'file.createdBy': userId}, function(err) {
                                
                                if(!err) {
                                    
                                    res.code = 200;
                                    res.msg = "Folder Deletion successful";
                                    done(null, res);
                                }
                                else {
                                    res.code = 500;
                                    res.msg = "Folder Deletion failed";
                                    done(err, res);
                                }
                            });
                        }
                    });

                }

            } else {
                res.code = 500;
                res.msg = "Folder Deletion failed";
                done(err, res);
            }
        });


}

function userStarredFiles(userdata, done) {

    let userId = userdata.userId;
    var res = {};
    let starredFilesQuery = "select * from files where createdBy = ? and isStarred = ?";

    File.find({ createdBy: userId, isStarred: true }, function(err, result) {

        if (!err) {
            let re = [];
            for (var i = 0; i < result.length; i++) {
                let p = "";
                if (result[i].path === "/") {
                    p = result[i].path + result[i].name
                } else {
                    p = result[i].path + "/" + result[i].name
                }
                let st = 0;
                if(result[i].isStarred) {
                    st = 1;
                }
                re.push({ fileId: result[i].id, starred: st, path: p, isDirectory: result[i].isDirectory, name: result[i].name });
            }
            res.code = 200;
            res.starred = re;
            done(null, res);
        } else {
            res.code = 500;
            res.msg = "Unable to fetch starred files.";
            done(err, res);
        }

    });

}

function userActivity(userdata, done) {

    let userId = userdata.userId;
    var res = {};
    let userActivityQuery = "SELECT f.id as id, f.name as name, f.path as path , l.dateCreated as dateCreated, f.isDirectory as dir, f.isStarred as star FROM files f INNER JOIN fileactivity l on f.id = l.fileId where l.userId = ? order by l.dateCreated desc limit 7";

    var q = FileActivity.find({userId: userId}).sort({'dateCreated': -1}).limit(7);
    q.exec(function(err, fileActivities) {

        if(!err) {
            let files = [];
            for (var i = 0; i < fileActivities.length; i++) {

                files.push({ name: fileActivities[i].file.name, path: fileActivities[i].file.path + fileActivities[i].file.name, starred: fileActivities[i].file.star, isDirectory: fileActivities[i].file.dir, fileId: fileActivities[i].file.id, date: fileActivities[i].file.dateCreated });

            }
            res.code = 200;
            res.activity = files;
            done(null, res);

        }
        else {
             res.code = 500;
            res.msg = "Unable to get User Activity.";
            done(err, res);
        }
         
    });

}

function sharedFileLinks(userdata, done) {

    let email = userdata.email;
    var res = {};

    User.findOne({ email: email }, function(err, user) {

        if (!err) {
            FileLink.find({ createdBy: user.id }, function(err, fileLinks) {
                if (!err) {
                    
                    let links = [];
                    let sendRes = false;
                    let cnt = 0;
                    for (var i = 0; i < fileLinks.length; i++) {

                        let l = fileLinks[i].linkString;

                        File.findOne({ _id: fileLinks[i].fileId }, function(err, file) {

                            if(cnt == fileLinks.length-1) {
                                sendRes = true;
                             }
                             else {
                                cnt++;
                             }
                            if (!err) {

                                links.push({ name: file.name, path: file.path + file.name, link: "http://localhost:3001/downloadSharedFile/" + l, owner: user.id });
                                console.log("ss : "+sendRes)
                                if (sendRes) {
                                    res.code = 200;
                                    res.msg = "Retrieved shared data.";
                                    res.links = links;
                                    done(null, res);
                                }
                            } else {
                                res.code = 500;
                                res.msg = "Unable to Retrieve shared link data.";
                                done(err, res);
                            }

                        });


                    }


                } else {
                    res.code = 500;
                    res.msg = "Unable to Retrieve shared link data.";
                    done(err, res);
                }
            });
        } else {
            res.code = 500;
            res.msg = "Unable to Retrieve shared link data.";
            done(err, res);
        }

    });

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

    File.findOne({ name: name, path: path, createdBy: createdBy }, function(err, file) {
        if (!err) {
            file.isStarred = isStarred;
            file.save(function(err, updatedFile) {

                if (!err) {
                    FileActivity.findOne({ 'file.id': updatedFile.id }, function(err, fileActivity) {
                        console.log("id : "+err)
                        if (!err) {
                            if (fileActivity) {
                                fileActivity.dateCreated = new Date().getTime();
                                fileActivity.save(function(err) {

                                    if (!err) {
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
                                        res.msg = "Unable to star files.";
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
                                    if (!err) {
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
                                        res.msg = "Unable to star files.";
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
                } else {
                    res.code = 500;
                    res.msg = "Unable to star file/fodler.";
                    done(err, res);
                }
            });

        } else {
            res.code = 500;
            res.msg = "Unable to star file/fodler.";
            done(err, res);
        }

    });

}

function sharedFiles(userdata, done) {

    let email = userdata.email;
    var res = {};

    User.findOne({ email: email }, function(err, user) {
            if (!err) {

                SharedFile.find({$or: [{ sharedBy: user.id }, { sharedWith: user.id }]},
                        function(err, sharedFiles) {

                            if (!err) {

                                let files = [],
                                    folders = [];

                                for (var i = 0; i < sharedFiles.length; i++) {

                                    if (sharedFiles[i].file.isDirectory) {
                                        folders.push({ name: sharedFiles[i].file.name, path: sharedFiles[i].file.path + sharedFiles[i].file.name, owner: sharedFiles[i].file.createdBy, isStarred: sharedFiles[i].file.isStarred, isDirectory: true });
                                    } else {
                                        files.push({ name: sharedFiles[i].file.name, link: "http://localhost:3001/fileDownload/" + sharedFiles[i].file.link, path: sharedFiles[i].file.path + sharedFiles[i].file.name, owner: sharedFiles[i].file.createdBy, isStarred: sharedFiles[i].file.isStarred, isDirectory: false });
                                    }

                                }
                                res.code = 200;
                                res.msg = "Retrieved shared data.";
                                res.files = files;
                                res.folders = folders;
                                console.log("kkkk"+res);
                                done(null, res);

                            } else {
                                res.code = 500;
                                res.msg = "Unable to Retrieve shared data.";
                                done(err, res);
                            }

                        });

                }
                else {
                    res.code = 500;
                    res.msg = "Unable to Retrieve shared data.";
                    done(err, res);

                }

            });

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

    User.findOne({ email: email }, function(err, user) {

        if (!err) {
            let uid = user.id;
            File.findOne({ name: name, path: path, createdBy: uid }, function(err, file) {

                if (!err) {
                    let sendRes = false;
                    for (var i = 0; i < sharedWithList.length; i++) {
                        if(i == sharedWithList.length-1) {
                            sendRes = true;
                        }
                        User.findOne({ email: sharedWithList[i] }, function(err, sharedWithUser) {

                            if (!err) {
                                console.log("ii : "+i);
                                FileActivity.findOne({ 'file.id': file.id }, function(err, fileActivity) {
                                    
                                    if (!err) {
                                        if (fileActivity) {
                                            fileActivity.dateCreated = new Date().getTime();
                                            fileActivity.save(function(err) {

                                                if (err) {
                                                    res.code = 500;
                                                    res.msg = "Unable to share files.";
                                                    done(err, res);
                                                }
                                                else {
                                                    saveShareFile(file, done, sharedWithUser, uid, i, sharedWithList, sendRes, res );
                                                }
                                            });

                                        } else {

                                            var newFileActivity = FileActivity({
                                                userId: uid,
                                                file: { id: file.id, name: file.name, path: file.path, isDirectory: file.isDirectory, createdBy: file.createdBy, dateCreated: file.dateCreated, isStarred: file.isStarred, link: file.link },
                                                dateCreated: new Date().getTime()
                                            });
                                            newFileActivity.save(function(err) {
                                                if (err) {
                                                    res.code = 500;
                                                    res.msg = "Unable to share files.";
                                                    done(err, res);
                                                }
                                                 else {
                                                    saveShareFile(file, done, sharedWithUser, uid, i, sharedWithList, sendRes, res );
                                                }
                                            });

                                        }

                                    } else {
                                        res.code = 500;
                                        res.msg = "Unable to fetch files.";
                                        done(err, res);
                                    }

                                });


  
                            } else {

                                res.code = 500;
                                res.msg = "Share file/folder failed.";
                                done(err, res);

                            }

                        });
                    }
                } else {
                    res.code = 500;
                    res.msg = "Share file/folder failed.";
                    done(err, res);
                }

            });

        } else {

            res.code = 500;
            res.msg = "Share file/folder failed.";
            done(err, res);

        }
    });
}

function saveShareFile(file, done, sharedWithUser, uid, i, sharedWithList, sendRes, res ) {

      var sharedFile = SharedFile({
        file: {
            id: file.id,
            name: file.name,
            path: file.path,
            isDirectory: file.isDirectory,
            createdBy: file.createdBy,
            dateCreated: file.dateCreated,
            isStarred: file.isStarred,
            link: file.link
        },
        sharedBy: uid,
        sharedWith: sharedWithUser.id,
        dateCreated: new Date().getTime()
    });

    sharedFile.save(function(err) {
        
        if (!err) {
            
            if (sendRes) {
                res.code = 200;
                res.msg = "File/Folder is shared";
                done(null, res);
            }

        } else {

            res.code = 500;
            res.msg = "Share file/folder failed.";
            done(err, res);

        }
    });
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

    User.findOne({ email: email }, function(err, user) {

        if (!err) {

            File.findOne({ createdBy: user.id, name: name, path: path }, function(err, file) {

                if (!err) {

                    FileActivity.findOne({ userId: user.id, 'file.id': file.id }, function(err, fileActivity) {

                        if (fileActivity) {
                            fileActivity.dateCreated = new Date().getTime();
                            fileActivity.save(function(err) {

                                if (!err) {
                                    FileLink.findOne({ fileId: file.id }, function(err, fileLink) {

                                        if (fileLink) {

                                            res.code = 200;
                                            res.link = "http://localhost:3001/downloadSharedFile/" + fileLink.linkString;
                                            done(null, res);

                                        } else {

                                            require('crypto').randomBytes(20, function(err, buffer) {
                                                var token = buffer.toString('hex');
                                                var newFileLink = FileLink({ linkString: token, fileId: file.id, createdBy: user.id, dateCreated: new Date().getTime() });
                                                newFileLink.save(function(err) {

                                                    res.code = 200;
                                                    res.link = "http://localhost:3001/downloadSharedFile/" + token;
                                                    done(null, res);
                                                });

                                            });

                                        }
                                    });
                                } else {
                                    res.code = 500;
                                    res.msg = "Unable to Generate Link.";
                                    done(err, res);
                                }

                            });

                        } else {

                            var newFileActivity = FileActivity({
                                userId: user.id,
                                file: { id: file.id, name: file.name, path: file.path, isDirectory: file.isDirectory, createdBy: file.createdBy, dateCreated: file.dateCreated, isStarred: file.isStarred, link: file.link },
                                dateCreated: new Date().getTime()
                            });
                            newFileActivity.save(function(err) {


                                if (!err) {
                                    FileLink.findOne({ fileId: file.id }, function(err, fileLink) {

                                        if (fileLink) {

                                            res.code = 200;
                                            res.link = "http://localhost:3001/downloadSharedFile/" + fileLink.linkString;
                                            done(null, res);

                                        } else {

                                            require('crypto').randomBytes(20, function(err, buffer) {
                                                var token = buffer.toString('hex');
                                                var newFileLink = FileLink({ linkString: token, fileId: file.id, createdBy: user.id, dateCreated: new Date().getTime() });
                                                newFileLink.save(function(err) {

                                                    res.code = 200;
                                                    res.link = "http://localhost:3001/downloadSharedFile/" + token;
                                                    done(null, res);
                                                });

                                            });

                                        }
                                    });
                                }

                            });

                        }

                    });
                } else {

                    res.code = 500;
                    res.msg = "Unable to Generate Link.";
                    done(err, res);
                }
            });
        } else {

            res.code = 500;
            res.msg = "Unable to Generate Link.";
            done(err, res);
        }
    });
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