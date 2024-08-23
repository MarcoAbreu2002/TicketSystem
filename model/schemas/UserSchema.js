const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const {verify} = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Introduza um username'],
    unique: [true]
  },
  password: {
    type: String,
    required: [true, 'Introduza a palavra passe'],
    minlength:[6, 'Tamanho mínimo da password são 6 carateres'],
  },
  tickets: {
    type: [String],
    required: true,
  },
});


//function usada antes de armazenar user na db, usada para encriptar a password
userSchema.pre('save', async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})


userSchema.statics.login = async function(username, password){
  const user = await this.findOne({username});
  if(user){
    const verification = await bcrypt.compare(password, user.password);

  if(verification) {
    return user;
  }
  throw Error('Password Incorreta!')
  }
  throw Error('Username Incorreto!')
};



const User = mongoose.model("User", userSchema);
module.exports = User;
