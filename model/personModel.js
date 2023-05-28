import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    index: true,
  },
  dob: {
    type: Date,
    required: false,
    index: true,
  },
  eyes: {
    type: String,
    enum: ["Blue", "Brown", "Green", "Hazel"],
    required: false,
    index: true,
  },
  colorSkin: {
    type: String,
    enum: ["Fair", "Medium", "Dark"],
    required: false,
  },
  colorHair: {
    type: String,
    enum: ["Blonde", "Brown", "Black", "Red"],
    required: false,
  },
  description: {
    type: String,
    required: [false, "Enter a description benificialated"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Enter a gender "],
  },
  specificInfo: {
    type: String,
    required: [true, "Enter a specific info"],
  },
  image: {
    type: String,
    required: false,
  },
  found: {
    type: Boolean,
    default: false,
    // enum: ["found", "Lost"]
  },
});
personSchema.index({ name: "text" });
personSchema.plugin(mongoosePaginate);
const PersonModel = mongoose.model("Person", personSchema);

export default PersonModel;
