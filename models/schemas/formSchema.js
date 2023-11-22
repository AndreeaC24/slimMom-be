const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const formSchema = new mongoose.Schema({ 
  height: {
    type: Number,
    required: [true, "Height is required"],
    minlength: [3, "Height must contain at least 3 characters - in cm"],
    maxlength: [3, "Height is limited to max 3 characters - in cm"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    minlength: [1, "Age must contain at least one character"],
    maxlength: [2, "Age is limited to max 2 characters"],
  },  
  weightC: {
    type: Number,
    required: [true, "Current weight is required"],
    minlength: [2, "Current weight must contain at least 2 characters"],
    maxlength: [3, "Current weight is limited to max 3 characters"],
  },
  weightD: {
    type: Number,
    required: [true, "Desired weight is required"],
    minlength: [2, "Desired weight must contain at least 2 characters"],
    maxlength: [3, "Desired weight is limited to max 3 characters"],
  },
  bloodType: {
    type: [Boolean],
    required: [true, "Your blood type is required"],
  },
  bmr: {
    type: Number,
  },   
  },
  { versionKey: false, timestamps: true }
);
const FormSchema = mongoose.model("formSchema", formSchema);
module.exports = FormSchema;
