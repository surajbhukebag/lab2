var connection =  new require('./kafka/connection');
var signin = require('./topics/signinTopic');

var producer = connection.getProducer();

var signinConsumer = connection.getConsumer("signinTopic");
signinConsumer.on('message', function (message) { signin.signinTopic(message, producer); });



console.log('server is running');