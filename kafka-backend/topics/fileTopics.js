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


    var data = JSON.parse(message.value);
    files.downloadSharedFile(data.data, function(err, res) {
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

    var data = JSON.parse(message.value);
    filesClient.fileFolderDelete(data.data, function(err, res) {
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

function createFolder(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.createFolder(data.data, function(err, res) {
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

function starFile(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.starFile(data.data, function(err, res) {
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

function userStarredFiles(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.userStarredFiles(data.data, function(err, res) {
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

function generateLink(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.generateLink(data.data, function(err, res) {
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

function share(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.share(data.data, function(err, res) {
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

function sharedFiles(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.sharedFiles(data.data, function(err, res) {
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

function sharedFileLinks(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.sharedFileLinks(data.data, function(err, res) {
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

function userActivity(message, producer) {

    var data = JSON.parse(message.value);
    filesClient.userActivity(data.data, function(err, res) {
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

function userGroups(message, producer) {

      var data = JSON.parse(message.value);
    filesClient.userGroups(data.data, function(err, res) {
        
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

function createGroup(message, producer) {

      var data = JSON.parse(message.value);
    filesClient.createGroup(data.data, function(err, res) {
        
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

function lifeEvents(message, producer) {

      var data = JSON.parse(message.value);
    filesClient.lifeEvents(data.data, function(err, res) {
        
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
exports.userGroups = userGroups;
exports.createGroup = createGroup;
exports.lifeEvents = lifeEvents;