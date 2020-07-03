import { MongoClient, ObjectID } from 'mongodb';
import users from "../models/userModel";
import mongoose, { ConnectionStates } from "mongoose";
mongoose.set('useFindAndModify', false);

const url = 'mongodb://localhost:27017';
const dbName = 'stackDB';
mongoose.connect(url + '/' + dbName);

const Controller = {
    registration: (request, response) => {
        const newItem = new users(request.body);
        let check = true;
        users.find().then((inf) => {
            for (let item of (inf)) {
                if (newItem.email == item.email) { check = false; break; }
            }
            if (!newItem.email) return response.status(400).send("You did not enter an email!");
            if (!newItem.password) return response.status(400).send("You did not enter a password!");
            if (!newItem.name) return response.status(400).send("You did not enter your name!");
            if (inf.length == 0) newItem.role = "admin";
            else newItem.role = "user";
            if (check)
                newItem.save().then(user => {
                    response.cookie("userId", newItem._id)
                    return response.redirect("/userPage")
                });
            else return response.status(400).send("This email has already been taken!!!")
        });
    },

    logIn: function (req, res) {
        let item = req.body;
        if (!item.email) return res.status(400).send("You did not enter an email!");
        if (!item.password) return res.status(400).send("You did not enter a password!");
        users.findOne({ email: item.email, password: item.password }).then(inf => {
            if (!inf) return res.status(400).send("Check your password or email!!!");
            res.cookie("userId", inf._id);
            return res.redirect("/userPage");
        });
    },

    logOut: (req, res) => {
        res.clearCookie("userId");
        res.redirect("/main");
    },

    deleteById: function (req, res) {
        if (req.query.id) {
            users.findByIdAndDelete(req.query.id).then((deleted) => {
                return res.send(deleted);
            });
        }
    },
};

export default Controller;