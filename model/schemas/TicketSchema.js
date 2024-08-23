const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Ticket Schema
const ticketSchema = new Schema({
  descricao: {        //descrição
    type: String,
    required: true,
  },

  assunto: {        //Assunto
    type: String,
    required: true,
  },
  solicitante: {        //solicitante
    type: [String],
    //required: true,
  },
  email:{
    type: String,
    required: true,
    lowercase: true,
  },
  categoria:{
    type: String,
    required: true,
  },
  agente:{
    type: String,
    required: true,
  },
  prioridade:{
    type: String,
    required: true,
  },

});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
