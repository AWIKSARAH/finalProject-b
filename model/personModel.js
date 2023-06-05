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

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Enter a gender "],
  },
  specificInfo: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  found: {
    type: String,
    enum: ["found", "lost"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});
personSchema.index({ name: "text" });
personSchema.plugin(mongoosePaginate);
const PersonModel = mongoose.model("Person", personSchema);

export default PersonModel;
