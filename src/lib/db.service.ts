import { Thread, Comment, User } from './types';

class DatabaseService {
  private data: {
    users: User[];
    threads: Thread[];
  };

  constructor() {
    this.loadFromLocalStorage();
  }

  // User operations
  async login(email: string, password: string): Promise<User | null> {
    const user = this.data.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return user || null;
  }

  async signup(email: string, password: string, username: string): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      username,
    };
    if (!this.data.users) this.data.users = [];
    this.data.users.push(newUser);
    this.saveToLocalStorage();
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  // Thread operations
  async getThreads(): Promise<Thread[]> {
    return this.data.threads || [];
  }

  async getThreadById(id: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === id);
    return thread || null;
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    const newThread: Thread = {
      ...thread,
      id: Date.now().toString(),
    };
    if (!this.data.threads) this.data.threads = [];
    this.data.threads.unshift(newThread);
    this.saveToLocalStorage();
    return newThread;
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    const thread = this.data.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    if (!thread.likedBy) thread.likedBy = [];
    
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
    
    if (!thread.comments) thread.comments = [];
    thread.comments.push(newComment);
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
    } else {
      this.data = { users: [], threads: [] };
    }
  }
}

const dbService = new DatabaseService();

export default dbService;