const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { verify } = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Introduza um username'],
    unique: [true]
  },
  isAdmin: {
    type: Boolean
  },
  password: {
    type: String,
    required: [true, 'Introduza a palavra passe'],
    minlength: [6, 'Tamanho mínimo da password são 6 carateres'],
  },
  tickets: {
    type: [String],
    default: [] // Provide a default empty array
  },
});

// Function used before saving user in the DB, used to encrypt the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.statics.login = async function(username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const verification = await bcrypt.compare(password, user.password);
    if (verification) {
      return user;
    }
    throw new Error('Password Incorreta!');
  }
  throw new Error('Username Incorreto!');
};

const User = mongoose.model("User", userSchema);
module.exports = User;
