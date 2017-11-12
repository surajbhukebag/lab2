var connection =  new require('./kafka/connection');
var userTopics = require('./topics/userTopics');
var fileTopics = require('./topics/fileTopics');
var mongoose = require('mongoose');

var options = {
  poolSize: 10
 }

mongoose.connect("mongodb://localhost:27017/dropbox", options);

var producer = connection.getProducer();


//user topics
var signinConsumer = connection.getConsumer("signinTopic");
signinConsumer.on('message', function (message) { console.log("kkk"); userTopics.signinTopic(message, producer); });

var signupConsumer = connection.getConsumer("signupTopic");
signupConsumer.on('message', function (message) { userTopics.signupTopic(message, producer); });

var userPinfoConsumer = connection.getConsumer("userPinfoTopic");
userPinfoConsumer.on('message', function (message) { userTopics.userPersonalInfo(message, producer); });

var userEduInfoConsumer = connection.getConsumer("userEduInfoTopic");
userEduInfoConsumer.on('message', function (message) { userTopics.userEduInfo(message, producer); });

var userInterestsConsumer = connection.getConsumer("userInterestsTopic");
userInterestsConsumer.on('message', function (message) { userTopics.userIntInfo(message, producer); });

//files topics
var listdirConsumer = connection.getConsumer("listdirTopic");
listdirConsumer.on('message', function (message) { fileTopics.listdir(message, producer); });

var listSharedDirConsumer = connection.getConsumer("listSharedDirTopic");
listSharedDirConsumer.on('message', function (message) { fileTopics.listSharedDir(message, producer); });

var fileuploadConsumer = connection.getConsumer("fileuploadTopic");
fileuploadConsumer.on('message', function (message) { fileTopics.fileupload(message, producer); });

var getDownloadLinkConsumer = connection.getConsumer("getDownloadLinkTopic");
getDownloadLinkConsumer.on('message', function (message) { fileTopics.getDownloadLink(message, producer); });

var getSharedFileDownloadLinkConsumer = connection.getConsumer("getSharedFileDownloadLinkTopic");
getSharedFileDownloadLinkConsumer.on('message', function (message) { fileTopics.getSharedFileDownloadLink(message, producer); });

var downloadSharedFileConsumer = connection.getConsumer("downloadSharedFileTopic");
downloadSharedFileConsumer.on('message', function (message) { fileTopics.downloadSharedFile(message, producer); });

var uploadfileToSharedFolderConsumer = connection.getConsumer("uploadfileToSharedFolderTopic");
uploadfileToSharedFolderConsumer.on('message', function (message) { fileTopics.uploadfileToSharedFolder(message, producer); });

var filedownloadConsumer = connection.getConsumer("filedownloadTopic");
filedownloadConsumer.on('message', function (message) { fileTopics.filedownload(message, producer); });

var fileFolderDeleteConsumer = connection.getConsumer("fileFolderDeleteTopic");
fileFolderDeleteConsumer.on('message', function (message) { fileTopics.fileFolderDelete(message, producer); });

var createFolderConsumer = connection.getConsumer("createFolderTopic");
createFolderConsumer.on('message', function (message) { fileTopics.createFolder(message, producer); });

var starFileConsumer = connection.getConsumer("starFileTopic");
starFileConsumer.on('message', function (message) { fileTopics.starFile(message, producer); });

var userStarredFilesConsumer = connection.getConsumer("userStarredFilesTopic");
userStarredFilesConsumer.on('message', function (message) { fileTopics.userStarredFiles(message, producer); });

var generateLinkConsumer = connection.getConsumer("generateLinkTopic");
generateLinkConsumer.on('message', function (message) { fileTopics.generateLink(message, producer); });

var shareConsumer = connection.getConsumer("shareTopic");
shareConsumer.on('message', function (message) { fileTopics.share(message, producer); });

var sharedFilesConsumer = connection.getConsumer("sharedFilesTopic");
sharedFilesConsumer.on('message', function (message) { fileTopics.sharedFiles(message, producer); });

var sharedFileLinksConsumer = connection.getConsumer("sharedFileLinksTopic");
sharedFileLinksConsumer.on('message', function (message) { fileTopics.sharedFileLinks(message, producer); });

var userActivityConsumer = connection.getConsumer("userActivityTopic");
userActivityConsumer.on('message', function (message) { fileTopics.userActivity(message, producer); });

var userGroupsConsumer = connection.getConsumer("userGroupsTopic");
userGroupsConsumer.on('message', function (message) { fileTopics.userGroups(message, producer); });

var createGroupConsumer = connection.getConsumer("createGroupTopic");
createGroupConsumer.on('message', function (message) { fileTopics.createGroup(message, producer); });


var lifeEventsConsumer = connection.getConsumer("lifeEventsTopic");
lifeEventsConsumer.on('message', function (message) { fileTopics.lifeEvents(message, producer); });



console.log('server is running');