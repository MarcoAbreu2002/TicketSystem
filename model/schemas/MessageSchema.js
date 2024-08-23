const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message = new Schema({
    messagem:{
        type:String,
    },
});


const Mensagem = mongoose.model("Messages", message);
module.exports = Mensagem;