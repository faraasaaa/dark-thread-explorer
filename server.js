const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // In production, replace with your actual frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const uri = "mongodb+srv://minecraftsus145:minecraftsus145@cluster0.c17ut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true
});

let isConnected = false;

async function connectToMongo() {
  try {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    // Attempt to reconnect after 5 seconds
    setTimeout(connectToMongo, 5000);
  }
}

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectToMongo();
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = client.db('threadsApp');
    const user = await db.collection('users').findOne({ email, password });
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/signup', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const newUser = {
      ...req.body,
      id: new ObjectId().toString()
    };
    await db.collection('users').insertOne(newUser);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thread routes
app.get('/api/threads', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const threads = await db.collection('threads').find().sort({ timestamp: -1 }).toArray();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/threads/:id', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const thread = await db.collection('threads').findOne({ id: req.params.id });
    if (thread) {
      res.json(thread);
    } else {
      res.status(404).json({ error: 'Thread not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/threads', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const newThread = {
      ...req.body,
      id: new ObjectId().toString()
    };
    await db.collection('threads').insertOne(newThread);
    res.json(newThread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/threads/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    const db = client.db('threadsApp');
    const thread = await db.collection('threads').findOne({ id: req.params.id });
    
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    const user = await db.collection('users').findOne({ id: userId });
    if (!user || thread.author !== user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db.collection('threads').deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/threads/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const db = client.db('threadsApp');
    const thread = await db.collection('threads').findOne({ id: req.params.id });
    
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const likedBy = thread.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    const updatedThread = await db.collection('threads').findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          likes: isLiked ? thread.likes - 1 : thread.likes + 1,
          likedBy: isLiked ? likedBy.filter(id => id !== userId) : [...likedBy, userId]
        }
      },
      { returnDocument: 'after' }
    );

    res.json(updatedThread.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment routes
app.post('/api/threads/:threadId/comments', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const newComment = {
      ...req.body,
      id: new ObjectId().toString(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const result = await db.collection('threads').findOneAndUpdate(
      { id: req.params.threadId },
      { $push: { comments: newComment } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/threads/:threadId/comments/:commentId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const db = client.db('threadsApp');
    const thread = await db.collection('threads').findOne({ id: req.params.threadId });
    
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const comment = thread.comments.find(c => c.id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const likedBy = comment.likedBy || [];
    const isLiked = likedBy.includes(userId);

    const result = await db.collection('threads').findOneAndUpdate(
      { id: req.params.threadId, 'comments.id': req.params.commentId },
      {
        $set: {
          'comments.$.likes': isLiked ? comment.likes - 1 : comment.likes + 1,
          'comments.$.likedBy': isLiked ? likedBy.filter(id => id !== userId) : [...likedBy, userId]
        }
      },
      { returnDocument: 'after' }
    );

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/threads/:threadId/comments/:commentId/replies', async (req, res) => {
  try {
    const db = client.db('threadsApp');
    const newReply = {
      ...req.body,
      id: new ObjectId().toString(),
      likes: 0,
      likedBy: []
    };

    const result = await db.collection('threads').findOneAndUpdate(
      { id: req.params.threadId, 'comments.id': req.params.commentId },
      { $push: { 'comments.$.replies': newReply } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Thread or comment not found' });
    }

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: isConnected });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectToMongo();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    if (isConnected) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
});
