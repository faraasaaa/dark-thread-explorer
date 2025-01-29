import { MongoClient, ObjectId } from 'mongodb';
import { Thread, User, Comment, Reply } from './types';

const uri = "mongodb+srv://minecraftsus145:minecraftsus145@cluster0.c17ut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

class MongoDBService {
  private client: MongoClient;
  private db: any;

  constructor() {
    this.client = client;
    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db('threadsApp');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  async findUser(email: string, password: string): Promise<User | null> {
    const collection = this.db.collection('users');
    return await collection.findOne({ email, password });
  }

  async createUser(user: Omit<User, 'id'>): Promise<User | null> {
    const collection = this.db.collection('users');
    const result = await collection.insertOne({
      ...user,
      id: new ObjectId().toString()
    });
    return result.insertedId ? await collection.findOne({ _id: result.insertedId }) : null;
  }

  async getThreads(): Promise<Thread[]> {
    const collection = this.db.collection('threads');
    return await collection.find().sort({ timestamp: -1 }).toArray();
  }

  async getThreadById(id: string): Promise<Thread | null> {
    const collection = this.db.collection('threads');
    return await collection.findOne({ id });
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    const collection = this.db.collection('threads');
    const newThread = {
      ...thread,
      id: new ObjectId().toString()
    };
    await collection.insertOne(newThread);
    return newThread;
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    const collection = this.db.collection('threads');
    const thread = await collection.findOne({ id: threadId });
    
    if (!thread) return false;
    
    const user = await this.db.collection('users').findOne({ id: userId });
    if (!user || thread.author !== user.username) return false;

    const result = await collection.deleteOne({ id: threadId });
    return result.deletedCount === 1;
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    const collection = this.db.collection('threads');
    const thread = await collection.findOne({ id: threadId });
    
    if (!thread) return null;

    const likedBy = thread.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    const updatedThread = await collection.findOneAndUpdate(
      { id: threadId },
      {
        $set: {
          likes: isLiked ? thread.likes - 1 : thread.likes + 1,
          likedBy: isLiked 
            ? likedBy.filter((id: string) => id !== userId)
            : [...likedBy, userId]
        }
      },
      { returnDocument: 'after' }
    );

    return updatedThread.value;
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    const collection = this.db.collection('threads');
    const newComment = {
      ...comment,
      id: new ObjectId().toString(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const result = await collection.findOneAndUpdate(
      { id: threadId },
      { $push: { comments: newComment } },
      { returnDocument: 'after' }
    );

    return result.value;
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    const collection = this.db.collection('threads');
    const thread = await collection.findOne({ id: threadId });
    
    if (!thread) return null;

    const comment = thread.comments.find((c: Comment) => c.id === commentId);
    if (!comment) return null;

    const likedBy = comment.likedBy || [];
    const isLiked = likedBy.includes(userId);

    const result = await collection.findOneAndUpdate(
      { id: threadId, 'comments.id': commentId },
      {
        $set: {
          'comments.$.likes': isLiked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1,
          'comments.$.likedBy': isLiked 
            ? likedBy.filter((id: string) => id !== userId)
            : [...likedBy, userId]
        }
      },
      { returnDocument: 'after' }
    );

    return result.value;
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    const collection = this.db.collection('threads');
    const newReply = {
      ...reply,
      id: new ObjectId().toString(),
      likes: 0,
      likedBy: []
    };

    const result = await collection.findOneAndUpdate(
      { id: threadId, 'comments.id': commentId },
      { $push: { 'comments.$.replies': newReply } },
      { returnDocument: 'after' }
    );

    return result.value;
  }
}

const mongoDBService = new MongoDBService();
export default mongoDBService;
