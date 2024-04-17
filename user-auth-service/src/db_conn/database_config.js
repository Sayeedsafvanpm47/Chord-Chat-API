// MongoDB Native Driver
const { MongoClient } = require('mongodb');

// Connection URI for MongoDB
const uri = "mongodb+srv://sayeedsafvan123:j6hOtbwkYgSssAVQ@cluster0.wy74oxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a new MongoClient instance
const client = new MongoClient(uri);

// Function to connect to MongoDB
async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
    // Ping the deployment to check the connection
    await client.db("chord_chat_users").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Close the MongoDB connection when done
    await client.close();
  }
}

module.exports = run;
