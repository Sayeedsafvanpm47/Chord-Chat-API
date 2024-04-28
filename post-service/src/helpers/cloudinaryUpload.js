const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const {BadRequestError} = require('chordchat-common')

async function uploadCloudinary(path,folder)
{
    const result = cloudinary.uploader.upload(
                    path,
                    { folder: folder },
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        throw new BadRequestError("Image upload failed!");
                      }
                      fs.unlink(path, (unlinkErr) => {
                        if (unlinkErr) {
                          console.log("Error deleting file:", unlinkErr);
                        }
                      });
                    }
                  );
                  return (await result).secure_url
}

async function uploadVideo(path, folder) {
          try {
              const result = await cloudinary.uploader.upload(
                  path,
                  {
                      resource_type: "video",
                      folder: folder,
                      eager: [
                          { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                          { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
                      ],
                      eager_async: true
                  }
              );
              return result.secure_url;
          } catch (err) {
              console.error(err);
              throw new BadRequestError("Video upload failed!");
          }
      }
//     eager_notification_url: "https://mysite.example.com/notify_endpoint" }) - route to send notification after finsihing up
module.exports = {uploadCloudinary,uploadVideo}