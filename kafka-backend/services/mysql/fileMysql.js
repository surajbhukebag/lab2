var mysql = require('./connection');

function storeFileDetails(callback, storeFileQuery, name, path, isDirectory, userId, dateCreated, token){
    
    var connection=mysql.getConnection();

    connection.query(storeFileQuery, [name, path, isDirectory, userId, dateCreated, 0, token], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err, userId);
        }
        else 
        {                               
            callback(result, err, userId);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function getStarredFiles(callback, starredFilesQuery, createdBy){
    
    var connection=mysql.getConnection();

    connection.query(starredFilesQuery, [createdBy, 1], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}


function getUserFile(callback, userFilesQuery, createdBy, name, path){
    
    var connection=mysql.getConnection();

    connection.query(userFilesQuery, [createdBy, name, path], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                   
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}


function getFileById(callback, getFilesQuery, id){
    
    var connection=mysql.getConnection();

    connection.query(getFilesQuery, id, function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                   
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function getFileByPathAndName(callback, getFodlerQuery, userId, name, path){
    
    var connection=mysql.getConnection();

    connection.query(getFodlerQuery, [userId, name, path], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                   
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function getSharedFileList(callback, filesQuery, createdBy, dir){
    
    var connection=mysql.getConnection();

    connection.query(filesQuery, [dir, createdBy, createdBy], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                   
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}


function generateLink(callback, generateLinkQuery, fileId, createdBy){
    
    var connection=mysql.getConnection();

    require('crypto').randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');

        connection.query(generateLinkQuery, [token, fileId, new Date().getTime(), createdBy], function(err, result) {
            if(err){
                console.log(err);
                callback(null, err);
            }
            else 
            {                               
                callback(token, err);                       
            }
        });
        console.log("\nConnection closed..");
        connection.end();

    });
    

}


function getFileLink(callback, checkLinkQuery, fileId){
    
    var connection=mysql.getConnection();

    connection.query(checkLinkQuery, fileId, function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}



function getFileLinkByUser(callback, linkQuery, createdBy){
    
    var connection=mysql.getConnection();

    connection.query(linkQuery, createdBy, function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function createSharedFile(callback, shareFileQuery, fileId, uid, sharedWithId){
    
    var connection=mysql.getConnection();

    connection.query(shareFileQuery, [fileId, uid, sharedWithId, new Date().getTime()], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}


function getSharedFiles(callback, getSharedFilesQuery, id){
    
    var connection=mysql.getConnection();

    connection.query(getSharedFilesQuery, [id, id], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                   
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}


function getSharedLinkFiles(callback, getSharedFilesQuery, id){
    
    var connection=mysql.getConnection();

    connection.query(getSharedFilesQuery, id, function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {                   
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function starFile(callback, starFileQuery, isStarred,createdBy, name, path){
    
    var connection=mysql.getConnection();

    connection.query(starFileQuery, [isStarred, createdBy, name, path], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {           
            console.log("result "+result.affectedRows);
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}


function getFileList(callback, filesQuery, createdBy, path){
    
    var connection=mysql.getConnection();

    connection.query(filesQuery, [createdBy, path], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function deleteFile(callback, deleteFileQuery, name, path, createdBy){
    
    var connection=mysql.getConnection();

    connection.query(deleteFileQuery, [name, path, createdBy], function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

}

function addToFileActivity(callback, addToFileActivityQuery, userId, fileId) {

    var connection=mysql.getConnection();

    connection.query(addToFileActivityQuery, [new Date().getTime(), userId, fileId], function(err, result) {
        callback(err);
    });
    console.log("\nConnection closed..");
    connection.end();

}

function checkFileActivity(callback, checkFileActivityQuery, userId, fileId) {

    var connection=mysql.getConnection();

    connection.query(checkFileActivityQuery, [userId, fileId], function(err, result) {
        callback(result, err);
    });
    console.log("\nConnection closed..");
    connection.end();

}


function getUserActivity(callback, userActivityQuery, userId){
    
    var connection=mysql.getConnection();

    connection.query(userActivityQuery, userId, function(err, result) {
        if(err){
            console.log(err);
            callback(null, err);
        }
        else 
        {               
            callback(result, err);                      
        }
    });
    console.log("\nConnection closed..");
    connection.end();

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