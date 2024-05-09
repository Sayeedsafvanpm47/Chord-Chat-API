const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.get("/api/post-service/get-all-posts/:page", async (req, res) => {
  try {
    const page = req.params.page;
    const limit = 1;
    const skip = (page - 1) * limit;
    const totalCount = await Post.countDocuments();
    const posts = await Post.find({}).skip(skip).limit(limit);
    return res.json({
      message: "posts fetched successfully",
      posts,
      totalCount,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/api/post-service/get-user-posts/:page/:userId?",
  async (req, res) => {
    try {
      const page = req.params.page;
      const userProfileId = req.params.userId;
      console.log(userProfileId)
      const limit = 1;
      const skip = (page - 1) * limit;
      const userId = req.currentUser._id;
      let posts
      const totalCount = await Post.find({ user_id: userId }).countDocuments();
      console.log(totalCount);
      if (userProfileId) {
          console.log(userProfileId,'user is in selected profile')
          posts = await Post.find({ user_id: userProfileId })
          .skip(skip)
          .limit(limit);
      }
     else
     {
          console.log('user is in profile')
          posts = await Post.find({ user_id: userId })
        .skip(skip)
        .limit(limit);
     }
      console.log(posts, "posts");
      return res.json({
        message: "user posts fetched successfully",
        posts,
        totalCount,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = router;
