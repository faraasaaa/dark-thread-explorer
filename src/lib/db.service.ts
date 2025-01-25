import db from './db.json';
import { Thread, Comment } from './types';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

class DatabaseService {
  private data: {
    users: User[];
    threads: Thread[];
  };

  constructor() {
    this.data = db;
  }

  // User operations
  async login(email: string, password: string): Promise<User | null> {
    const user = this.data.users.find(
      (u) => u.email === email && u.password === password
    );
    return user || null;
  }

  async signup(email: string, password: string, name: string): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };
    this.data.users.push(newUser);
    this.saveToLocalStorage();
    return newUser;
  }

  // Thread operations
  async getThreads(): Promise<Thread[]> {
    return this.data.threads;
  }

  async getThreadById(id: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === id);
    if (!thread) return null;
    return thread;
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    const newThread: Thread = {
      ...thread,
      id: Date.now().toString(),
    };
    this.data.threads.unshift(newThread);
    this.saveToLocalStorage();
    return newThread;
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    if (thread.likedBy.includes(userId)) {
      thread.likedBy = thread.likedBy.filter((id) => id !== userId);
      thread.likes--;
    } else {
      thread.likedBy.push(userId);
      thread.likes++;
    }
    this.saveToLocalStorage();
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
    thread.comments.push(newComment);
    this.saveToLocalStorage();
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
    this.saveToLocalStorage();
    return thread;
  }

  async addReplyToComment(
    threadId: string,
    commentId: string,
    reply: Omit<Comment, 'id'>
  ): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    const comment = thread.comments.find((c) => c.id === commentId);
    if (!comment) return null;

    if (!comment.replies) comment.replies = [];

    const newReply: Comment = {
      ...reply,
      id: `r${Date.now()}`,
      likes: 0,
      likedBy: [],
    };
    comment.replies.push(newReply);
    this.saveToLocalStorage();
    return thread;
  }

  // Helper methods
  private saveToLocalStorage(): void {
    localStorage.setItem('threadApp', JSON.stringify(this.data));
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('threadApp');
    if (savedData) {
      this.data = JSON.parse(savedData);
    }
  }

  // Initialize data from localStorage if available
  init(): void {
    this.loadFromLocalStorage();
    if (!this.data.threads) {
      this.data.threads = [];
    }
    if (!this.data.users) {
      this.data.users = [];
    }
  }
}

const dbService = new DatabaseService();
dbService.init();

export default dbService;