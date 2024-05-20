// MongoDB Native Driver
const { MongoClient } = require('mongodb');

// Connection URI for MongoDB
const uri = process.env.MONGO_URI

// Create a new MongoClient instance
const client = new MongoClient(uri,{reconnectTries:60,reconnectInterval:1000});

// Function to connect to MongoDB
async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
    // Ping the deployment to check the connection
    await client.db("users-chord-chat").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Close the MongoDB connection when done
    await client.close();
  }
}

module.exports = run;
