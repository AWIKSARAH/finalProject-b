import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const disasterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["EQ", "FL", "TC", "VO", "DR"],
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Green", "Yellow", "Orange", "Red"],
    required: true,
  },
  eventId: {
    type: Number,
    required: false,
  },
});
disasterSchema.index({ description: "text" });
disasterSchema.plugin(mongoosePaginate);

const DisasterModel = mongoose.model("Disaster", disasterSchema);

export default DisasterModel;
