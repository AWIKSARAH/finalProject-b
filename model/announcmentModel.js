import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    tel: {
      type: String,
      required: [true, "Please enter a valid tel"],
      validate: {
        validator: function (value) {
          const telPattern = /^\d{10}$/;
          return telPattern.test(value);
        },
        message: "Please enter a valid telephone number",
      },
    },
    country: {
      type: String,
      required: [true, "Please enter a country"],
    },
    report: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ["lost", "find"],
      required: [true, "Please enter a valid type"],
    },
    idPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: [true, "Please provide a valid person ID"],
    },
    dateLastSeen: {
      type: Date,
      default: null,
    },
    placeLastSeen: {
      type: String,
      default: null,
    },
    idDisaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disaster",
      required: false,
    },
    reactionId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reaction",
        required: false,
      },
    ],
    relationships: {
      type: String,
      enum: [
        "friend",
        "family",
        "colleague",
        "acquaintance",
        "neighbor",
        "son",
        "daughter",
      ],
    },
  },
  { timestamps: true }
);

announcementSchema.plugin(mongoosePaginate);
announcementSchema.index({ title: "text" });

announcementSchema.pre(/^find/, function (next) {
  this.populate("idPerson").populate("idDisaster").populate("reactionId");
  next();
});
announcementSchema.virtual('totalComments').get(function() {
  return this.reactionId.length;
});

announcementSchema.virtual("disasterDuration").get(function () {
  if (this.idDisaster && this.idDisaster.start_time && this.idDisaster.end_time) {
    const start = this.idDisaster.start_time.getTime();
    const end = this.idDisaster.end_time.getTime();
    const durationInMilliseconds = end - start;
    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
    return durationInSeconds;
  }
  return null;
});

const AnnouncementModel = mongoose.model("Announcement", announcementSchema);

export default AnnouncementModel;
