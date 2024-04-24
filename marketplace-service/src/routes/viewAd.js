const express = require("express");
const router = express.Router();
const Market = require("../models/marketplace");
const { currentUser, requireAuth } = require('chordchat-common')


router.get("/api/market/get-all-ads/:page", async (req, res) => {
  try {
    const page =  parseInt(req.params.page) || 0; 
    console.log(req.currentUser,'currentUser view')
    let ads
    let total = await Market.countDocuments({});
    const limit = 2; 
    let totalCount = Math.ceil(total / limit);
    if(page)
    {
    
  
    const skip = (page - 1) * limit;
    ads = await Market.find({}).skip(skip).limit(limit)
   
    // Market.createIndex({ createdAt: 1 });
   
    }
 else
  {
     ads = await Market.find({})
  }
   
    return res.json({ data: ads,totalCount });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/api/market/get-user-ads/:page", async (req, res) => {
  try {
   const userId = req.currentUser 
   const total = await Market.find({user_id:userId}).countDocuments()
   const page =  parseInt(req.params.page)
   const limit = 2; 
   let totalCount = Math.ceil(total / limit);
   const skip = (page - 1) * limit;

    const ads = await Market.find({user_id:userId}).skip(skip).limit(limit);
    return res.json({ data: ads,totalCount });
  } catch (error) {
          console.log(error)
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router