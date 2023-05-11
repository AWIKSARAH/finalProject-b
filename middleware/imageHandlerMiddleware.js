import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const destinationPath = "./uploads";
    callback(null, destinationPath);
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + "." + file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage });

export default function uploadImage(imageName) {
  return function (req, res, next) {
    // Use the `upload.none()` middleware for requests without an image file

    // Use the `upload.single()` middleware for requests with an image file
    try {
      upload.single(imageName)(req, res, function (err) {
        if (err) {
          console.log(err);
        }
        // Check if a file has been uploaded
        if (req.file) {
          req.body.image = "/uploads/" +req.file.filename;
        }
        next();
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteImage(imagePath) {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Error deleting image file: ${err}`);
    } else {
      console.log(`Image file ${imagePath} has been deleted`);
    }
  });
}
