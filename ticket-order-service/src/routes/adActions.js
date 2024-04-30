const BadRequestError = require("chordchat-common/src/errors/bad-request-error");
const express = require("express");
const router = express.Router();
const Market = require("../models/marketplace");

router.patch("/api/market/toggle-show-ad/:adId", async (req, res) => {
  try {
    const adId = req.params.adId;
    const findAd = await Market.findOne({ _id: adId });
    console.log(findAd);
    if (findAd) {
      findAd.visibility = !findAd.visibility;
      await findAd.save();
    } else {
      throw new BadRequestError("Failed to change visibility");
    }

    return res.json({
      message: findAd.visibility ? "Ad is visible" : "Ad is hidden",
    });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/api/market/flag-ad/:id", async (req, res) => {
  try {
    const adId = req.params.id;

    const findAd = await Market.findOne({ _id: adId });
    const currentUser = req.currentUser;
    console.log(currentUser._id);
    let isFlaggedByUser = findAd.flaggers.findIndex(
      (user) => user == currentUser._id
    );
    if (findAd) {
      if (isFlaggedByUser == -1) {
        findAd.flagCount++;
        findAd.flaggers.push(currentUser._id);
      } else {
        findAd.flaggers = findAd.flaggers.filter(
          (item) => item !== currentUser._id
        );
        findAd.flagCount--;
      }
      await findAd.save();
      return res.json({
        message: isFlaggedByUser == -1 ? "Ad is flagged" : "Ad is unflagged",
        data: findAd,
      });
    } else {
      return res.json({ message: "Failed to change the ad status" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/api/market/delete-ad/:adId", async (req, res) => {
  try {
    const adId = req.params.adId;
    await Market.deleteOne({ _id: adId });

    return res.json({ message: "Successfully deleted ad" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/api/market/search-market", async (req, res) => {
  try {
    const { searchTerm } = req.body;

    console.log(searchTerm);
    const findAds = await Market.find({
      description: { $regex: searchTerm, $options: "i" },
    });
    return res.json({ data: findAds });
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
});

router.get("/api/market/share-ad/:adId", async (req, res) => {
  try {
    const adId = req.params.adId;
    const findAdDetails = await Market.findOne({ _id: adId });
    const sendMessage = `
            Check out this awesome ad!
            Ibanez guitar for sale
            Price: 1000
            Hurry up and grab the offer soon!
            Login/Signup to chord chat: http://localhost:5173
            Image ${findAdDetails.image}
        `;
    const encoded = encodeURIComponent(sendMessage);
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    let link;
    if (isMobileDevice) {
      link = `whatsapp://send?text=${encoded}`;
    } else {
      link = `https://web.whatsapp.com/send?text=${encoded}`;
    }

    if (isMobileDevice && !isWhatsAppAppAvailable()) {
      link = `https://web.whatsapp.com/send?text=${encoded}`;
    }

    function isWhatsAppAppAvailable() {
      return /(whatsapp|wa)/i.test(navigator.userAgent);
    }

    res.send(link);
  } catch (error) {}
});

module.exports = router;
