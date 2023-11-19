const mongoose = require("mongoose");
const bCrypt = require("bcryptjs"); 
const Schema = mongoose.Schema;

const user = new Schema({
  name:{
    type: String,
    minlength: [3, "Your name must contain at least 3 characters"],
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    minlength: [10, "Email must contain at least 10 characters"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email should be a valid address",
    ],
    required: [true, "Email is required"],
  }, 
  password: {
    type: String,
    minlength: [7, "The password must contain at least 7 characters"],
    required: [true, 'Password is required'],
  },   
  token: {
    type: String,
    default: null,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
});

user.methods.setPass = function(password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};
 
user.methods.isSamePass = function (pass) {
    return bCrypt.compareSync(pass, this.password);
  }; 

user.methods.setToken = function (token) {
    this.token = token;
  }; 
const User = mongoose.model('User', user);
module.exports = User;

