const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the Ticket model
const TicketSchema = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    purchase: {
      type: Array,
    },
    stock: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiringAt: {
      type: Date,
      default: function() {
        const thirtyDaysFromNow = new Date(this.createdAt);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return thirtyDaysFromNow;
      },
    },
    expired: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    flagCount: {
      type: Number,
      default: 0,
    },
    flaggers: {
      type: Array,
      default: [],
    },
    image : {
      type:String 
    }
  },
  { timestamps: true }
);


// Export the Ticket model
module.exports = mongoose.model("Ticket", TicketSchema);
