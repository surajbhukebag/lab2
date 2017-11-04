var LocalStrategy = require("passport-local").Strategy;
var kafka = require("./../kafka/client");

module.exports = function(passport) {
    
    passport.use('local-login', new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
        var res = {};
        console.log("l");
        kafka.make_request('signinTopic', { "email": email, "password": password }, function(err, results) {

            if (err) {
                res.code = 500;
                res.msg = "Login Failed";
                done(err, res);
            } else {
                if (results.code == 200) {                    
                    res.code = results.code;
                    res.loggedIn = true;
                    res.user = results.user;
                    res.pinfo = results.pinfo;
                    res.eduinfo = results.eduinfo;
                    res.interests = results.interests
                    done(null, res);
                } else {
                    res.code = 500;
                    res.msg = results.msg;
                    done(err, res);
                }
            }
        });
    }));

}