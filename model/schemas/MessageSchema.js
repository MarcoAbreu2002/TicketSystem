const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    messagem: {
        type: String,
        required: true
    },
    solicitante: {
        type: String,
        required: true
    },
    room: { // New field to specify the room
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
