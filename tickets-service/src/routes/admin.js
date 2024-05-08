const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const { BadRequestError } = require("chordchat-common");
const upload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

router.post(
  "/api/ticket-service/create-ticket",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("im called");

      const { title, price, description, stock } = req.body;
      const result = cloudinary.uploader.upload(
        req.file.path,
        { folder: "tickets" },
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
      const imageData = (await result).secure_url;
      if (price < 5) throw new BadRequestError("Enter a price greater than 5");
      if (stock <= 0)
        throw new BadRequestError("Enter stock greater than zero");
      if (!title || !price || !description || !stock)
        throw new BadRequestError("Please fill in every fields");
      const newticket = new Ticket({
        title,
        price,
        description,
        stock,
        image: imageData,
      });
      await newticket.save();
      return res.json({ message: "Ticket created successfully", newticket });
    } catch (error) {
      console.log(error);
    }
  }
);

router.patch(
  "/api/ticket-service/edit-ticket/:id",
  upload.single("image"),
  async (req, res) => {
    console.log("im called edit");
    const id = req.params.id;
    const { title, description, price, stock } = req.body;
    console.log(req.body, "body");
    const findTicket = await Ticket.findOne({ _id: id });
    let imageData;
    console.log(findTicket);
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
    if (findTicket) {
      if (title) findTicket.title = title;
      if (description) findTicket.description = description;
      if (price) findTicket.price = price;
      if (stock) findTicket.stock = stock;
      if (imageData) findTicket.image = imageData;
      await findTicket.save();
      return res.json(`Ticket details changed successfully!`);
    } else {
      throw BadRequestError("Ticket not found!");
    }
  }
);

router.delete("/api/ticket-service/delete-ticket/:ticketId", async (req, res) => {
        try {
                const ticketId = req.params.ticketId;
                console.log(ticketId)
                await Ticket.deleteOne({ _id: ticketId });
                 
                return res.json({ message: "Successfully deleted ticket" });
              } catch (error) {
                console.log(error);
                return res.status(500).send({ message: "Internal server error" });
              }
});

router.post("/api/ticket-service/search-tickets", async (req, res) => {
        try {
                const { searchTerm } = req.body;
            
                console.log(searchTerm);
                const findTicket = await Ticket.find({
                  title: { $regex: searchTerm, $options: "i" },
                });
                return res.json({ data: findTicket });
              } catch (error) {
                console.log(error);
                return res.json({ error });
              }
});

router.patch('/api/ticket-service/toggle-show-ticket/:ticketId',async(req,res)=>{
        try {
                const ticketId = req.params.ticketId;
                const findTicket = await Ticket.findOne({ _id: ticketId });
              
                if (findTicket) {
                  findTicket.visibility = !findTicket.visibility;
                  await findTicket.save();
                } else {
                  throw new BadRequestError("Failed to change visibility");
                }
            
                return res.json({
                  message: findTicket.visibility ? "Ticket is visible" : "Ticket is hidden",
                });
              } catch (error) {
                console.log(error);
              }
})

router.get("/api/ticket-service/view-buyers", async (req, res) => {});

router.get("/api/ticket-service/toggle-view-ticket", async (req, res) => {});
module.exports = router;
