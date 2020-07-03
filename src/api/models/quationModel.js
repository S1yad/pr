import { Schema, model } from "mongoose";

const ProfileSchema = new Schema({
    quation: String,
    description: String,
    answers: {
        type: Object,
        default: []
    }
})

const quations = model("quations", ProfileSchema);

export default quations;