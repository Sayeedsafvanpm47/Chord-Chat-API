          const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
          const ffmpeg = require("fluent-ffmpeg");
          const path = require("path");
          const { v4: uuidv4 } = require("uuid");
          ffmpeg.setFfmpegPath(ffmpegInstaller.path);

          async function compressVideo(videoPath) {
                    return new Promise((resolve, reject) => {
                      const randomName = uuidv4(); 
                      const outputPath = path.join(__dirname, "video", `${randomName}.mp4`);
                  
                   
                      ffmpeg(videoPath)
                        .videoCodec('libx264') 
                        .audioCodec('aac') 
                        .outputOptions([
                          "-preset veryslow", 
                          "-crf 28", 
                          "-movflags +faststart" 
                        ])
                        .on("error", (err) => {
                          reject(err);
                        })
                        .on("end", () => {
                          resolve(outputPath);
                        })
                        .save(outputPath);
                    });
                  }
                  
                  module.exports = compressVideo;
                  

       
