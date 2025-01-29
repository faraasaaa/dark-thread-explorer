const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://minecraftsus145:minecraftsus145@cluster0.c17ut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongo();

// Basic routes for thread operations
app.get('/api/threads', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const threads = await db.collection('threads').find().toArray();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more routes as needed...

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});