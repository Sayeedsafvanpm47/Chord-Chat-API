const userService = require("../services/userService");
const { BadRequestError } = require("chordchat-common");
const {
  decryptPassword,
  encryptPassword,
} = require("../helpers/encryptPassword");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const Consumer = require('../messaging/consumer')
const consumer = new Consumer()
const Producer = require('../messaging/producer')
const producer = new Producer()

const editUserProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      oldpassword,
      newpassword,
      confirmpassword,
    } = req.body;
    let _id = req.currentUser._id;
    let imageData;
    let encryptedPassword;
    let user = await userService.findUser(_id);
    if (!user) throw new BadRequestError("User not found!");
    if (username) user.username = username;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    const existingPass = user.password;
    //add image
    if (req.file) {
      const result = cloudinary.uploader.upload(
        req.file.path,
        { folder: "marketplace" },
        (err, result) => {
          if (err) {
            console.log(err);
            throw new BadRequestError("Image upload failed!");
          }
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.log("Error deleting file:", unlinkErr);
            }
          });
        }
      );
      imageData = (await result).secure_url;
    }
    if (imageData) user.image = imageData;
    if (oldpassword) {
      let decryptedPass = decryptPassword(oldpassword, existingPass);
      if (decryptedPass) {
        if (newpassword.length < 4 || newpassword.length > 20) {
          return res.json({
            message:
              "Password must be at least 4 charecters and not more than 20",
          });
        }
        if (newpassword == confirmpassword) {
          encryptedPassword = await encryptPassword(newpassword);
        } else {
          return res.json({
            message: "Updation failed, passwords doesnt match",
          });
        }
      } else {
        throw new BadRequestError("Error updating profile");
      }
    }
    if (firstname || lastname || imageData || username || encryptedPassword) {
      const details = {
        firstname,
        lastname,
        imageData,
        username,
        encryptedPassword,
      };
      await userService.updateUserProfile(_id, details);
      return res.json({
        message: "User details updated successfully",
        data: user,
      });
    }
    return res.json({ message: "Updation failed" });
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Error updating profile");
  }
};

const createJob = async (req, res) => {
  try {
    const user_id = req.currentUser?._id;
    const jobStatus = await userService.createJob(user_id, req.body);
    if (jobStatus) {
      return res.status(201).json({ message: "Job created successfully" });
    } else {
      return res.status(400).json({ message: "Failed to create Job" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create job" });
  }
};

const getJob = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 0;

    const user_id = req.currentUser?._id;
    const totalCount = await userService.getTotalJobs();
    const jobs = await userService.getJobs(user_id, page);
    console.log(page);
    console.log(totalCount);
    console.log(jobs);
    if (totalCount && jobs) {
      return res
        .status(200)
        .json({ message: "Fetched successfully", data: jobs, totalCount });
    } else {
      return res.status(400).json({ message: "Failed to fetch jobs" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get jobs" });
  }
};

const searchJob = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const findJobs = await userService.searchJobs(searchTerm);
    return res.json({ data: findJobs });
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = req.currentUser._id;
    const findUser = await userService.deleteJob(id);
    if (findUser) {
      return res.status(200).json({ message: "Successfully deleted job" });
    } else {
      return res.status(400).json({ message: "Failed to delete" });
    }
  } catch (error) {
          console.log(error)
          return res.status(500).json({message:'Failed to delete'})
  }
};

//user actions 

const findUsers = async (req,res)=>{
  try {
    const searchTerm = req.body.searchTerm;
    console.log(req.currentUser,'user')
    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid search term" });
    }
   
    const foundUsers = await userService.findUsers(searchTerm)
   
    if (foundUsers.length > 0) {
      return res.json({ message: "Users found", users: foundUsers,currentuser:req.currentUser});
    } else {
      return res
        .status(404)
        .json({ message: "No users found matching the search term" });
    }

  } catch (error) {
    console.error("Error finding users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const viewUserProfile = async (req,res)=>{
  try {

    const userId = req.params.id;
    let user = await userService.findUser(userId)
    if (!user) throw new BadRequestError("User does not exist");
    return res.json({ userDetails: user });
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal server error",error:error})
  }
}

const toggleFollow = async (req,res)=>{
  try {

    const userId = req.params.id;

  const user = req.currentUser._id 
  console.log(userId)
  console.log(user);
  const currentUser = await userService.findUser(user)
  const targetUser = await userService.findUser(userId)
  const followStatus = await userService.toggleFollow(user,userId)
 console.log(followStatus)

    if (followStatus == 'Unfollowed') {
     
      return res.json({
        message: "User unfollowed successfully",currentUser,targetUser
      });
    } else {
   
      const FollowAction = {
        userId : userId,
        message : {message:`${currentUser.username} started following you!`},
        followerId:currentUser._id,
        type : 'Follow'
      }
      await producer.publishMessage('follow-user',FollowAction)
      return res.json({
        message:
          "User followed successfully,event generated to be consumed by notification service",
        currentUser: currentUser,
        followedUser: targetUser,
      });
    }
  
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Error occured"})
  }
}

const getIdols = async (req,res)=>{
  try {

     const id = req.params.id;
    const userData = await userService.findUser(id)
    let idolDetails = [];

    if (userData) {
      for (const user of userData.idols) {
        if(user !== id)
        {
          const currentUser = await userService.findUser(user)
          idolDetails.push(currentUser);
        }
       
      }
    }

    console.log(idolDetails, 'idol details');
    return res.json({ data: idolDetails });

  } catch (error) {
    console.error("Error fetching idol details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const getFans = async (req,res)=>{
  try {
    const id = req.params.id;
    const userData = await userService.findUser(id)
    let fansDetails = [];

    if (userData) {
      for (const user of userData.fans) {
        const currentUser = await userService.findUser(user)
      fansDetails.push(currentUser);
      }
    }

    console.log(fansDetails.length, 'fans details');
    return res.json({ data: fansDetails });
  } catch (error) {
    console.error("Error fetching idol details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  editUserProfile,
  createJob,
  getJob,
  searchJob,
  deleteJob,
  findUsers,
  viewUserProfile,
  toggleFollow,
  getIdols,
  getFans
};
