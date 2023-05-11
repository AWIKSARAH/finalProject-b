import mongoose from "mongoose";

function validateURL(url) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(url);
}
const Social = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Please enter a name of th social media"],
    trim: true,
  },
  url: {
    type: "string",
    validate: {
        validator: validateURL,
        message: 'Invalid URL',
      },
      required: [true, "Please enter a url"]
  },
});
export default mongoose.model("Socials", Social);


