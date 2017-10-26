
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  ,	cors = require('cors')
  , bodyParser = require('body-parser')
  , user = require('./routes/user/user')
  , files = require('./routes/files/files')
  , fileupload = require('./routes/files/upload')
  , session = require('client-sessions');

var app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(session({   
  cookieName: 'session',    
  secret: 'dropbox_secret',    
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,  }));


//Enable CORS
app.use(cors(corsOptions));

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


app.post('/signup', cors(corsOptions), user.signup);
app.post('/signin', cors(corsOptions), user.signin);
app.post('/signout',cors(corsOptions), user.signout);

app.post('/userPersonalInfo', cors(corsOptions), user.userPersonalInfo);
app.post('/userEduInfo', cors(corsOptions), user.userEduInfo);
app.post('/userIntInfo', cors(corsOptions), user.userIntInfo);

app.post('/listdir',cors(corsOptions), files.listdir);
app.post('/listSharedDir',cors(corsOptions), files.listSharedDir);
app.post('/fileupload',cors(corsOptions), fileupload.uploadfile);
app.post('/getDownloadLink',cors(corsOptions), fileupload.getDownloadLink);
app.post('/getSharedFileDownloadLink',cors(corsOptions), fileupload.getSharedFileDownloadLink);
app.get('/downloadSharedFile/:link',cors(corsOptions), fileupload.downloadSharedFile);
app.post('/uploadfileToSharedFolder',cors(corsOptions), fileupload.uploadfileToSharedFolder);
app.get('/filedownload/:link',cors(corsOptions), fileupload.filedownload);
app.post('/fileFolderDelete',cors(corsOptions), files.fileFolderDelete);
app.post('/createFolder',cors(corsOptions), files.createFolder);
app.post('/starFile',cors(corsOptions), files.starAFile);
app.get('/starredFiles/:userId', cors(corsOptions), files.starredFiles);
app.post('/generateLink',cors(corsOptions), files.generateLink);
app.post('/share',cors(corsOptions), files.share);
app.post('/sharedFiles',cors(corsOptions), files.sharedFiles);
app.post('/sharedFileLinks',cors(corsOptions), files.sharedFileLinks);
app.get('/userActivity/:userId', cors(corsOptions), files.userActivity);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


module.exports = server;