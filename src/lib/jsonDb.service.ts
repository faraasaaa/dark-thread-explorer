import { Thread, User, Comment, Reply } from './types';

// Initial data structure
const initialData = {
  users: [] as User[],
  threads: [] as Thread[],
};

class JsonDbService {
  private data: typeof initialData;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const savedData = localStorage.getItem('threadsAppData');
      if (savedData) {
        this.data = JSON.parse(savedData);
      } else {
        this.data = initialData;
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = initialData;
    }
  }

  private saveData() {
    try {
      localStorage.setItem('threadsAppData', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User operations
  async findUser(email: string, password: string): Promise<User | null> {
    const user = this.data.users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
    const newUser = {
      ...userData,
      id: crypto.randomUUID()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // Thread operations
  async getThreads(): Promise<Thread[]> {
    return this.data.threads;
  }

  async getThreadById(id: string): Promise<Thread | null> {
    return this.data.threads.find(t => t.id === id) || null;
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    const newThread = {
      ...thread,
      id: crypto.randomUUID()
    };
    this.data.threads.unshift(newThread);
    this.saveData();
    return newThread;
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    const threadIndex = this.data.threads.findIndex(t => t.id === threadId);
    if (threadIndex === -1) return false;

    const thread = this.data.threads[threadIndex];
    const user = this.data.users.find(u => u.id === userId);
    if (!user || thread.author !== user.username) return false;

    this.data.threads.splice(threadIndex, 1);
    this.saveData();
    return true;
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    const thread = this.data.threads.find(t => t.id === threadId);
    if (!thread) return null;

    const isLiked = thread.likedBy.includes(userId);
    if (isLiked) {
      thread.likes--;
      thread.likedBy = thread.likedBy.filter(id => id !== userId);
    } else {
      thread.likes++;
      thread.likedBy.push(userId);
    }

    this.saveData();
    return thread;
  }

  // Comment operations
  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    const thread = this.data.threads.find(t => t.id === threadId);
    if (!thread) return null;

    const newComment = {
      ...comment,
      id: crypto.randomUUID(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    thread.comments.push(newComment);
    this.saveData();
    return thread;
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    const thread = this.data.threads.find(t => t.id === threadId);
    if (!thread) return null;

    const comment = thread.comments.find(c => c.id === commentId);
    if (!comment) return null;

    const isLiked = comment.likedBy?.includes(userId);
    if (isLiked) {
      comment.likes = (comment.likes || 0) - 1;
      comment.likedBy = comment.likedBy?.filter(id => id !== userId);
    } else {
      comment.likes = (comment.likes || 0) + 1;
      comment.likedBy = [...(comment.likedBy || []), userId];
    }

    this.saveData();
    return thread;
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    const thread = this.data.threads.find(t => t.id === threadId);
    if (!thread) return null;

    const comment = thread.comments.find(c => c.id === commentId);
    if (!comment) return null;

    const newReply = {
      ...reply,
      id: crypto.randomUUID(),
      likes: 0,
      likedBy: []
    };

    comment.replies = [...(comment.replies || []), newReply];
    this.saveData();
    return thread;
  }
}

const jsonDbService = new JsonDbService();
export default jsonDbService;