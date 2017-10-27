var connection =  new require('./../kafka/connection');
var user = require('./../services/users/users');



function signinTopic(message, producer) {
    console.log('message received ---------- ');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log("dddddd : "+data.data);
    user.signin(data.data, function(err,res){
        
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
}

exports.signinTopic = signinTopic;