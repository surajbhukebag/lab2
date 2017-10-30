var {pool} = require('./connection');

function storeFileDetails(callback, storeFileQuery, name, path, isDirectory, userId, dateCreated, token) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(storeFileQuery, [name, path, isDirectory, userId, dateCreated, 0, token], function(err, result) {

                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err, userId);
                } else {
                    callback(result, err, userId);
                }
            });


        }
    });

}

function getStarredFiles(callback, starredFilesQuery, createdBy) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(starredFilesQuery, [createdBy, 1], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });


        }
    });
}


function getUserFile(callback, userFilesQuery, createdBy, name, path) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(userFilesQuery, [createdBy, name, path], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });


        }
    });
}


function getFileById(callback, getFilesQuery, id) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(getFilesQuery, id, function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}

function getFileByPathAndName(callback, getFodlerQuery, userId, name, path) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(getFodlerQuery, [userId, name, path], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}

function getSharedFileList(callback, filesQuery, createdBy, dir) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(filesQuery, [dir, createdBy, createdBy], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}


function generateLink(callback, generateLinkQuery, fileId, createdBy) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            require('crypto').randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');

                connection.query(generateLinkQuery, [token, fileId, new Date().getTime(), createdBy], function(err, result) {
                    connection.release();
                    if (err) {
                        console.log(err);
                        callback(null, err);
                    } else {
                        callback(token, err);
                    }
                });


            });
        }
    });

}


function getFileLink(callback, checkLinkQuery, fileId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(checkLinkQuery, fileId, function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}



function getFileLinkByUser(callback, linkQuery, createdBy) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(linkQuery, createdBy, function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}

function createSharedFile(callback, shareFileQuery, fileId, uid, sharedWithId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(shareFileQuery, [fileId, uid, sharedWithId, new Date().getTime()], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}


function getSharedFiles(callback, getSharedFilesQuery, id) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(getSharedFilesQuery, [id, id], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}


function getSharedLinkFiles(callback, getSharedFilesQuery, id) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(getSharedFilesQuery, id, function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}

function starFile(callback, starFileQuery, isStarred, createdBy, name, path) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(starFileQuery, [isStarred, createdBy, name, path], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    console.log("result " + result.affectedRows);
                    callback(result, err);
                }
            });

        }
    });
}


function getFileList(callback, filesQuery, createdBy, path) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(filesQuery, [createdBy, path], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}

function deleteFile(callback, deleteFileQuery, name, path, createdBy) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(deleteFileQuery, [name, path, createdBy], function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}

function addToFileActivity(callback, addToFileActivityQuery, userId, fileId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(addToFileActivityQuery, [new Date().getTime(), userId, fileId], function(err, result) {
                connection.release();
                callback(err);
            });

        }
    });
}

function checkFileActivity(callback, checkFileActivityQuery, userId, fileId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(checkFileActivityQuery, [userId, fileId], function(err, result) {
                connection.release();
                callback(result, err);
            });

        }
    });
}


function getUserActivity(callback, userActivityQuery, userId) {


    pool.getConnection(function(err, connection) {
        if (err) {} else {

            connection.query(userActivityQuery, userId, function(err, result) {
                connection.release();
                if (err) {
                    console.log(err);
                    callback(null, err);
                } else {
                    callback(result, err);
                }
            });

        }
    });
}


exports.storeFileDetails = storeFileDetails;
exports.getStarredFiles = getStarredFiles;
exports.getUserFile = getUserFile;
exports.generateLink = generateLink;
exports.getFileLink = getFileLink;
exports.createSharedFile = createSharedFile;
exports.getFileLinkByUser = getFileLinkByUser;
exports.getFileById = getFileById;
exports.getSharedFiles = getSharedFiles;
exports.getSharedLinkFiles = getSharedLinkFiles;
exports.starFile = starFile;
exports.getFileList = getFileList;
exports.deleteFile = deleteFile;
exports.addToFileActivity = addToFileActivity;
exports.getFileByPathAndName = getFileByPathAndName;
exports.checkFileActivity = checkFileActivity;
exports.getUserActivity = getUserActivity;
exports.getSharedFileList = getSharedFileList;