import { Thread, Comment, User, Reply } from './types';
import defaultData from './db.json';

class DatabaseService {
  private data: {
    users: User[];
    threads: Thread[];
  };

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile(): void {
    // Initialize with default data from db.json
    this.data = defaultData;
  }

  private saveToFile(): void {
    // In a real application, this would write to a JSON file
    // For now, we'll use sessionStorage to persist data across page refreshes
    sessionStorage.setItem('threadApp', JSON.stringify(this.data));
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = this.data.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    return user || null;
  }

  async signup(email: string, password: string, username: string): Promise<User | null> {
    const existingEmail = this.data.users.find(u => u.email === email);
    if (existingEmail) {
      throw new Error("Email already registered");
    }

    const existingUsername = this.data.users.find(u => u.username === username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      username,
    };

    this.data.users.push(newUser);
    this.saveToFile();
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  getCurrentUser(): User | null {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
  }

  async getThreads(): Promise<Thread[]> {
    return this.data.threads || [];
  }

  async getThreadById(id: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === id);
    return thread || null;
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;

    const thread = this.data.threads.find(t => t.id === threadId);
    if (!thread || thread.author !== user.username) return false;

    this.data.threads = this.data.threads.filter(t => t.id !== threadId);
    this.saveToFile();
    return true;
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    const newThread: Thread = {
      ...thread,
      id: Date.now().toString(),
    };
    this.data.threads.unshift(newThread);
    this.saveToFile();
    return newThread;
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    if (!thread.likedBy) thread.likedBy = [];
    
    // Toggle like status
    if (thread.likedBy.includes(userId)) {
      thread.likedBy = thread.likedBy.filter((id) => id !== userId);
      thread.likes--;
    } else {
      thread.likedBy.push(userId);
      thread.likes++;
    }
    
    this.saveToFile();
    return thread;
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    const newComment: Comment = {
      ...comment,
      id: `c${Date.now()}`,
      likes: 0,
      likedBy: [],
      replies: [],
    };
    
    if (!thread.comments) thread.comments = [];
    thread.comments.push(newComment);
    this.saveToFile();
    return thread;
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    const comment = thread.comments.find((c) => c.id === commentId);
    if (!comment) return null;

    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.likes) comment.likes = 0;

    if (comment.likedBy.includes(userId)) {
      comment.likedBy = comment.likedBy.filter((id) => id !== userId);
      comment.likes--;
    } else {
      comment.likedBy.push(userId);
      comment.likes++;
    }

    this.saveToFile();
    return thread;
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    const comment = thread.comments.find((c) => c.id === commentId);
    if (!comment) return null;

    if (!comment.replies) comment.replies = [];

    const newReply: Reply = {
      ...reply,
      id: `r${Date.now()}`,
      likes: 0,
      likedBy: [],
    };

    comment.replies.push(newReply);
    this.saveToFile();
    return thread;
  }
}

const dbService = new DatabaseService();
export default dbService;
