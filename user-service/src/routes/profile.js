const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");


router.patch("/api/user-service/edit-profile",upload.single("image"),userController.editUserProfile);

router.patch("/api/user-service/createJob",userController.createJob)

router.get("/api/user-service/get-jobs/:page",userController.getJob)

router.post("/api/user-service/search-jobs",userController.searchJob)

router.patch("/api/user-service/delete-job",userController.deleteJob)

router.post("/api/user-service/find-users",userController.findUsers)

router.get("/api/user-service/view-user-profile/:id",userController.viewUserProfile)

router.post("/api/user-service/toggle-follow-user/:id",userController.toggleFollow)

router.get("/api/user-service/get-idols/:id",userController.getIdols)

router.get("/api/user-service/get-fans/:id",userController.getFans)
module.exports = router
