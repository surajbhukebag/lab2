var files = require('./../services/files/upload');
var filesClient = require('./../services/files/files');

function listdir(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.listdir(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });
}


function listSharedDir(message, producer) {

	var data = JSON.parse(message.value);
    filesClient.listSharedDir(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });

}

function fileupload(message, producer) {

    var data = JSON.parse(message.value);
    files.fileUpload(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });

}

function getDownloadLink(message, producer) {

    var data = JSON.parse(message.value);
    files.getDownloadLink(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });

}

function getSharedFileDownloadLink(message, producer) {

    var data = JSON.parse(message.value);
    files.getSharedFileDownloadLink(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });

}

function downloadSharedFile(message, producer) {

}

function uploadfileToSharedFolder(message, producer) {

    var data = JSON.parse(message.value);
    files.uploadfileToSharedFolder(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });

}

function filedownload(message, producer) {
	
	var data = JSON.parse(message.value);
    files.fileDownload(data.data, function(err, res) {
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
        return;
    });

}

function fileFolderDelete(message, producer) {

}

function createFolder(message, producer) {

}

function starFile(message, producer) {

}

function userStarredFiles(message, producer) {

}

function generateLink(message, producer) {

}

function share(message, producer) {

}

function sharedFiles(message, producer) {

}

function sharedFileLinks(message, producer) {

}

function userActivity(message, producer) {

}

exports.listdir = listdir;
exports.listSharedDir = listSharedDir;
exports.fileupload = fileupload;
exports.getDownloadLink = getDownloadLink;
exports.getSharedFileDownloadLink = getSharedFileDownloadLink;
exports.downloadSharedFile = downloadSharedFile;
exports.uploadfileToSharedFolder = uploadfileToSharedFolder;
exports.filedownload = filedownload;
exports.fileFolderDelete = fileFolderDelete;
exports.createFolder = createFolder;
exports.starFile = starFile;
exports.userStarredFiles = userStarredFiles;
exports.generateLink = generateLink;
exports.share = share;
exports.sharedFiles = sharedFiles;
exports.sharedFileLinks = sharedFileLinks;
exports.userActivity = userActivity;