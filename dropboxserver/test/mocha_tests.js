var supertest = require("supertest");
var should = require("should");
var app = require('./../app');
var authenticated;

describe("User Related APIs", function() {

    it("should create a new user account", function(done) {

        supertest(app)
            .post('/signup')
            .send({ "email": "suraj@gmail.com", "password": "suraj", "fname": "Test First Name", "lname": "Test Last Name" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(500);
                done();
            });
    });

    it("should through error for duplicate email", function(done) {
        supertest(app)
            .post('/signup')
            .send({ "email": "suraj@gmail.com", "password": "suraj", "fname": "Test First Name", "lname": "Test Last Name" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(500);
                res.body.msg.should.equals("User with given email already registered. Please use different email");
                done();
            });
    });

    it("should be able to login", function(done) {
        supertest(app)
            .post('/signin')
            .send({ "email": "surajbhukebag@gmail.com", "password": "suraj" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                res.body.loggedIn.should.equals(true);
                done();
            });
    });

});


describe("User Related APIs : authenticated requests", function() {

    beforeEach(function(done) {

        authenticated = supertest.agent(app);
        authenticated.post('/signin')
            .send({
                email: "suraj@gmail.com",
                password: "suraj"
            })
            .end(function(err) {
                done(err);
            });
    });


    it("should get list of files and folders of a specfic user", function(done) {
        authenticated.post('/listdir')
            .send({ "id": "1", "dir": "/" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                let legth = res.body.files.length;
                legth.should.equals(3);
                res.body.files[0].name.should.equals("BEDPB8166G.pdf");
                res.body.files[2].name.should.equals("CollectionExample.java");
                res.body.files[1].name.should.equals("First Level");

                done();
            });
    });

    it("should update personal information of specfic user", function(done) {
        authenticated.post('/userPersonalInfo')
            .send({ "email": "suraj@gmail.com", "contact": "7896541230", "dob": 1508091874578 })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                res.body.pinfo.msg.should.equals("User Personal Data Updated");
                let contact = res.body.pinfo.contact;
                let dob = res.body.pinfo.dob;
                contact.should.equals("7896541230");
                dob.should.equals(1508091874578);
                done();
            });
    });


    it("should update education information of specfic user", function(done) {
        authenticated.post('/userEduInfo')
            .send({ "email": "suraj@gmail.com", "college": "SJSU", "sdate": 1508091874578, "edate": 1508091874578, "gpa": "3.5", "major": "SE" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                res.body.eduinfo.msg.should.equals("User Education Data Updated");
                let college = res.body.eduinfo.college;
                let sdate = res.body.eduinfo.sdate;
                let edate = res.body.eduinfo.edate;
                let gpa = res.body.eduinfo.gpa;
                let major = res.body.eduinfo.major;
                college.should.equals("SJSU");
                sdate.should.equals(1508091874578);
                edate.should.equals(1508091874578);
                major.should.equals("SE");
                gpa.should.equals("3.5");
                done();
            });
    });


    it("should update user interest of specfic user", function(done) {
        authenticated.post('/userIntInfo')
            .send({ "userId": 1, "interest": "Music", "comment": "Life is music" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                done();
            });
    });


    it("should return starred files of specfic user", function(done) {
        authenticated.get('/starredFiles/1')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                let starredFiles = res.body.starred.length;
                let starredFile = res.body.starred[0];
                starredFiles.should.equals(1);
                starredFile.name.should.equals("CollectionExample.java");
                starredFile.fileId.should.equals(3);
                done();
            });
    });

    it("should return link for specific file of specfic user", function(done) {
        authenticated.post('/generateLink')
            .send({ "email": "suraj@gmail.com", "path": "/CollectionExample.java" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                let link = res.body.link;
                link.should.equals("http://localhost:3001/downloadSharedFile/d8ea1f1ed34d9229050a7cd59d95ce38d5dbfb38");
                done();
            });
    });



    it("should star a File of specfic user", function(done) {
        authenticated.post('/starFile')
            .send({ "id": 1, "path": "/CollectionExample.java", "star": "star" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                res.body.msg.should.equals("File/Fodler starred.")
                done();
            });
    });



    it("should list Files/Folders of specfic user", function(done) {
        authenticated.post('/listdir')
            .send({ "id": 1, "dir": "/" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.code.should.equals(200);
                let files = res.body.files;
                let size = files.size();
                size.should.equals(3);
                done();
            });
    });

});