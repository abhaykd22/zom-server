const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    _id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    image : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Mealtype", mealSchema, "Mealtype")
