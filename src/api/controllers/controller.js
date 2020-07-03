import { MongoClient, ObjectID } from 'mongodb';
import users from "../models/userModel";
import quations from "../models/quationModel"
import mongoose, { ConnectionStates } from "mongoose";
mongoose.set('useFindAndModify', false);

const url = 'mongodb://localhost:27017';
const dbName = 'stackDB';
mongoose.connect(url + '/' + dbName);

const Controller = {
    allUsers: (req, res) => {
        users.find().then(inf => {
            res.send(inf)
        });
    },

    main: (req, res) => {
        quations.find().then(inf => {
            let item = [];
            for (let q of inf) {
                let obj = {};
                obj.title = q.quation;
                obj.id = q._id;
                item.push(obj);
            }
            return res.render("main.ejs", { data: item });
        });
    },

    logo: (req, res) => {
        res.sendFile(__dirname + "/logo.png")
    },

    registrationPage: (req, res) => {
        return res.render("registrationPage.ejs");
    },

    userPage: (req, res) => {
        let cookie = req.cookies;
        if (!cookie.userId) return res.send("<h1>You are not logged in!</h1>");
        users.findById(cookie.userId).then(item => {
            let myQuations = [];
            for (let q of item.myQuations) {
                myQuations.push(String(q))
            }
            let userQuations = []
            quations.find().then(inf => {
                console.log(typeof (item.myQuations[0]))
                for (let quat of inf) {
                    if (myQuations.includes(String(quat._id))) {
                        let obj = {};
                        obj.title = quat.quation;
                        obj.id = quat._id;
                        userQuations.push(obj)
                    }
                }
            });
            setTimeout(() => {
                return res.render("userPage.ejs", { data: userQuations });
            }, 100)
        });
    },

    newQuation: (req, res) => {
        let newQuation = new quations(req.body);
        let userId = req.cookies.userId;
        quations.find().then(inf => {
            if (!newQuation.quation) return res.send("You did not enter your quation!");
            if (!newQuation.description) return res.send("You did not enter description!");
            users.findById(userId).then(item => {
                item.myQuations.unshift(newQuation._id);
                users.findByIdAndUpdate(userId, { myQuations: item.myQuations }, { new: true }, (error, user) => {
                    if (error) return res.send(error);
                });
            });
            newQuation.save().then(quation => {
                return res.redirect("/userPage");
            });
        });
    },

    allQuations: (req, res) => {
        quations.find().then(inf => {
            return res.send(inf)
        });
    },

    quationPage: (req, res) => {
        quations.findById(req.query.id).then(inf => {
            res.cookie("quationId", inf._id);
            if (req.cookies.userId) return res.render("quationPage.ejs", { data: inf, isLoggedIn: true });
            return res.render("quationPage.ejs", { data: inf, isLoggedIn: false })
        });
    },

    addAnswer: (req, res) => {
        let newAnswer = req.body;
        let cookies = req.cookies;
        if (!newAnswer.description) return res.send("You did not enter description");
        quations.findById(cookies.quationId).then(inf => {
            inf.answers.push(newAnswer);
            quations.findByIdAndUpdate(cookies.quationId, { answers: inf.answers }, { new: true }, (error, user) => {
                return res.redirect(307, `/quationPage?id=${cookies.quationId}`)
            });
        });
    },
}

export default Controller;