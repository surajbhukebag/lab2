var connection = new require('./../kafka/connection');
var user = require('./../services/users/users');

function signinTopic(message, producer) {

    var data = JSON.parse(message.value);
    user.signin(data.data, function(err, res) {
        console.log("err : " + err);
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

function signupTopic(message, producer) {

    var data = JSON.parse(message.value);
    console.log("Data received : " + data);
    user.signup(data.data, function(err, res) {

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

function userPersonalInfo(message, producer) {

    var data = JSON.parse(message.value);
    console.log("Data received : " + data);
    user.userPersonalInfo(data.data, function(err, res) {

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

function userEduInfo(message, producer) {

    var data = JSON.parse(message.value);
    console.log("Data received : " + data);
    user.userEduInfo(data.data, function(err, res) {

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

function userIntInfo(message, producer) {

    var data = JSON.parse(message.value);
    console.log("Data received : " + data);
    user.userIntInfo(data.data, function(err, res) {

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

exports.signinTopic = signinTopic;
exports.signupTopic = signupTopic;
exports.userPersonalInfo = userPersonalInfo;
exports.userEduInfo = userEduInfo;
exports.userIntInfo = userIntInfo;