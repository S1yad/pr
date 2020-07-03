import { Schema, model } from "mongoose";

const ProfileSchema = new Schema({
    email: String,
    password: String,
    name: String,
    role: String,
    myQuations: {
        type: Object,
        default: []
    }
})

const users = model("allUsers", ProfileSchema);

export default users;