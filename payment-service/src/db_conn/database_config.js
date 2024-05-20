// MongoDB Native Driver
const { MongoClient } = require('mongodb');


const uri = process.env.MONGO_URI;


const client = new MongoClient(uri);


async function run() {
  try {
 
    await client.connect();
    

    await client.db("payment-chordchat").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    await client.close();
  }
}

module.exports = run;
