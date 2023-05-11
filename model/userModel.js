import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Please enter a Name, this is required"],
    maxLength: [25, "U can't exceed more than 25 characters"],
    trim: true,
  },
  email: {
    type: "string",
    required: [true, "Please enter a Email, this is required"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid Email",
    },
    unique: true,
  },
  IsAdmin: {
    type: "boolean",
    default: false,
  },
  password: {
    type: "string",
    minLenght: 8,
    required: [true, "Please enter a Password, this is required"],
    trim: true,   
  },
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt)
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    const salt = await bcryptjs.genSalt(10);
    this._update.password = await bcryptjs.hash(this._update.password, salt);
  }
  next();
});


UserSchema.methods.createJWT = function(){
  console.log(this._id);
  return jwt.sign({_id:this._id}, process.env.SECRET_KEY,{expiresIn:process.env.JWT_LIFETIME})

}

UserSchema.methods.comparePassword = async function(candidate){
  const isMatch = await bcryptjs.compare(candidate,this.password);
  return isMatch ;
}

UserSchema.plugin(mongoosePaginate);


export default mongoose.model("Users", UserSchema);
