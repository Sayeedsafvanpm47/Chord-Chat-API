const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  currentUser,
  requireAuth,
  BadRequestError,
  currentUserCookie
} = require("chordchat-common");

// router.use(currentUser);
// router.use(requireAuth)


//route to search for users
router.post("/api/user-service/find-users", async (req, res) => {
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
   
    const foundUsers = await User.find({
      email: { $regex: searchTerm, $options: "i" },
    });
   
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
});
// route to view a certain user's profile
router.get("/api/user-service/view-user-profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findOne({ _id: userId });
    if (!user) throw new BadRequestError("User does not exist");
    return res.json({ userDetails: user });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// route to follow or unfollow a particular user
router.post("/api/user-service/toggle-follow-user/:id", async (req, res) => {
  const userId = req.params.id;
  // const user = req.currentUser;
  const user = req.body.currentUser
  console.log(userId)
  console.log(user);
  const targetUser = await User.findOne({ _id: userId });
  console.log(targetUser,'tar')
  const currentUser = await User.findOne({ _id: user });
  console.log(currentUser,'curr')

  if (targetUser && currentUser) {
    const isFollowing = currentUser.idols.includes(userId);

    if (isFollowing) {
      const targetUserIndexInFollowers = targetUser.fans.indexOf(
        currentUser.id
      );
      const currentUserIndexInIdols = currentUser.idols.indexOf(userId);
      targetUser.fans.splice(targetUserIndexInFollowers, 1);
      currentUser.idols.splice(currentUserIndexInIdols, 1);
      await targetUser.save();
      await currentUser.save();
      return res.json({
        message: "User unfollowed successfully",
        currentUser: currentUser,
        followedUser: targetUser,
      });
    } else {
      targetUser.fans.push(currentUser.id);
      currentUser.idols.push(userId);
      await targetUser.save();
      await currentUser.save();
      return res.json({
        message:
          "User followed successfully,event generated to be consumed by notification service",
        currentUser: currentUser,
        followedUser: targetUser,
      });
    }
  } else {
    return res.status(400).send({ message: "Failed to follow, bad request" });
  }
});

router.get("/api/user-service/get-idols/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await User.findOne({ _id: id });
    let idolDetails = [];

    if (userData) {
      for (const user of userData.idols) {
        if(user !== id)
        {
          const currentUser = await User.findOne({ _id: user });
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
});

router.get("/api/user-service/get-fans/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await User.findOne({ _id: id });
    let fansDetails = [];

    if (userData) {
      for (const user of userData.fans) {
        const currentUser = await User.findOne({ _id: user });
      fansDetails.push(currentUser);
      }
    }

    console.log(fansDetails.length, 'fans details');
    return res.json({ data: fansDetails });
  } catch (error) {
    console.error("Error fetching idol details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
