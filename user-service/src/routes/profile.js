const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");


router.patch(
  "/api/user-service/edit-profile",
  upload.single("image"),
  userController.editUserProfile
);

router.patch("/api/user-service/createJob",userController.createJob)

router.get("/api/user-service/get-jobs/:page",userController.getJob)

router.post("/api/user-service/search-jobs",userController.searchJob)

router.patch("/api/user-service/delete-job",userController.deleteJob)
module.exports = router;
