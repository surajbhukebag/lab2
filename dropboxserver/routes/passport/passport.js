var LocalStrategy = require("passport-local").Strategy;
var kafka = require("./../kafka/client");

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log("serializeUser : "+ user.username);
        done(null, user.id);

    });

    passport.deserializeUser(function(id, done) {

        console.log("deserializeUser L: "+id);
    });

    
    passport.use('local-login', new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
        var res = {};
        kafka.make_request('signinTopic', { "email": email, "password": password }, function(err, results) {
            console.log("error : "+err);
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