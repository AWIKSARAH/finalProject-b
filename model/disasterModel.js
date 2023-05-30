import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const disasterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  type: {
    type: String,
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
  url: {
    type: String,
    required: false,
  },
  end_time: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  eventId: {
    type: Number,
    required: false,
  },
});
disasterSchema.plugin(mongoosePaginate);
disasterSchema.index({ description: "text" });

const DisasterModel = mongoose.model("Disaster", disasterSchema);

export default DisasterModel;
