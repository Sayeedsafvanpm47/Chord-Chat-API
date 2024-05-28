const BadRequestError = require("chordchat-common/src/errors/bad-request-error");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// router.patch("/api/user-service/createJob", async (req, res) => {
//   try {
//     console.log(req.body);

//     let user_id;
//     let username;

//     if (req.currentUser) {
//       user_id = req.currentUser?._id;
//       username = req.currentUser?.username;
//     }

//     const { description, price, location, instrument } = req.body;
//     console.log(req.body, "body");

    
//     const newJob = await User.findOne({ _id: user_id });
//     if (newJob) {
     
//       if(description!=='') newJob.jobDescription = description;
//      if(price!=='') newJob.hiringRate = price;
//      if(location!=='') newJob.location = location;
//      if(instrument!=='')  newJob.instrument = instrument;
//       newJob.jobProfile = true;
//       await newJob.save();
//     }

//     return res.json({ message: "Job post created successfully" });
//   } catch (error) {
//     console.log(error);
//   }
// });


// router.get("/api/user-service/get-jobs/:page", async (req, res) => {
//   try {
//     const page = parseInt(req.params.page) || 0;
//     console.log(req.currentUser, "currentUser view");
//     let jobs;
//     let total = await User.find({
//       jobProfile: true,
//     }).countDocuments();
//     const limit = 2;
//     let totalCount = Math.ceil(total / limit);
//     if (page) {
//       const skip = (page - 1) * limit;
//       jobs = await User.find({
//           jobProfile: true,
//       })
//         .skip(skip)
//         .limit(limit);


//     } else {
//       jobs = await User.find({});
//     }

//     return res.json({ data: jobs, totalCount });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.post("/api/user-service/search-jobs", async (req, res) => {
//   try {
//     const { searchTerm } = req.body;

//     console.log(searchTerm);
//     const findJobs = await User.find({
//       jobDescription: { $regex: searchTerm, $options: "i" },
//     });
//     return res.json({ data: findJobs });
//   } catch (error) {
//     console.log(error);
//     return res.json({ error });
//   }
// });




// router.patch("/api/user-service/delete-job", async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.currentUser._id });
//     if (user) {
//       user.jobDescription = "";
//       user.jobProfile = false;
//       user.instrument = "";
//       user.location = "";
//       await user.save()
//     }

//     return res.json({ message: "Successfully deleted job" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ message: "Internal server error" });
//   }
// });

module.exports = router;
