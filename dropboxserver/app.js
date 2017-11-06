
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
  , session = require('client-sessions')
  , passport = require('passport');

var app = express();

var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(expressSessions({
    secret: "my_secret",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));

app.use(passport.initialize());
app.use(passport.session());
require('./routes/passport/passport')(passport); 

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

function isAtuthenticated(req, res, next) {    
    if (req.session.user) {
        next();
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ code: 502, msg: "Invalid Session" }));
    }
}
app.post('/signup', cors(corsOptions), user.signup);
app.post('/signin', cors(corsOptions), function(req, res) {

    passport.authenticate('local-login', function(err, results){
      res.setHeader('Content-Type', 'application/json');
      if(!err) {
        req.session.user = results.user; 
        res.send(JSON.stringify(results)); 
      } 
      else {
        res.send(JSON.stringify({"code":500, "msg":"Login Failed"}));
      }
      
      
    })(req, res);

});

app.post('/signout',cors(corsOptions), isAtuthenticated, user.signout);

app.post('/userPersonalInfo', cors(corsOptions), isAtuthenticated, user.userPersonalInfo);
app.post('/userEduInfo', cors(corsOptions), isAtuthenticated, user.userEduInfo);
app.post('/userIntInfo', cors(corsOptions), isAtuthenticated, user.userIntInfo);

app.post('/listdir',cors(corsOptions), isAtuthenticated, files.listdir);
app.post('/listSharedDir',cors(corsOptions), isAtuthenticated, files.listSharedDir);
app.post('/fileupload',cors(corsOptions), isAtuthenticated, fileupload.uploadfile);
app.post('/getDownloadLink',cors(corsOptions), isAtuthenticated, fileupload.getDownloadLink);
app.post('/getSharedFileDownloadLink',cors(corsOptions), isAtuthenticated, fileupload.getSharedFileDownloadLink);
app.get('/downloadSharedFile/:link',cors(corsOptions), isAtuthenticated, fileupload.downloadSharedFile);
app.post('/uploadfileToSharedFolder',cors(corsOptions), isAtuthenticated, fileupload.uploadfileToSharedFolder);
app.get('/filedownload/:link',cors(corsOptions), isAtuthenticated, fileupload.filedownload);
app.post('/fileFolderDelete',cors(corsOptions), isAtuthenticated, files.fileFolderDelete);
app.post('/createFolder',cors(corsOptions), isAtuthenticated, files.createFolder);
app.post('/starFile',cors(corsOptions), isAtuthenticated, files.starAFile);
app.get('/starredFiles/:userId', cors(corsOptions), isAtuthenticated, files.starredFiles);
app.post('/generateLink',cors(corsOptions), isAtuthenticated, files.generateLink);
app.post('/share',cors(corsOptions), isAtuthenticated, files.share);
app.post('/sharedFiles',cors(corsOptions), isAtuthenticated, files.sharedFiles);
app.post('/sharedFileLinks',cors(corsOptions), isAtuthenticated, files.sharedFileLinks);
app.get('/userActivity/:userId', cors(corsOptions), isAtuthenticated, files.userActivity);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


module.exports = server;