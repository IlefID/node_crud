const mongoose = require("mongoose");
const userSchema =new mongoose.Schema({
    nom:{
        type: String,
        required: true,
    },
    prenom:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    telephone:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now,
    },
});
module.exports = mongoose.model("user", userSchema);