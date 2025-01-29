import { Thread, Comment, User, Reply } from './types';
import mongoDBService from './mongodb.service';

class DatabaseService {
  async login(email: string, password: string): Promise<User | null> {
    const user = await mongoDBService.findUser(email, password);
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    return user;
  }

  async signup(email: string, password: string, username: string): Promise<User | null> {
    const newUser = await mongoDBService.createUser({
      email,
      password,
      username
    });
    
    if (newUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    }
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
    return await mongoDBService.getThreads();
  }

  async getThreadById(id: string): Promise<Thread | null> {
    return await mongoDBService.getThreadById(id);
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    return await mongoDBService.deleteThread(threadId, userId);
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    return await mongoDBService.createThread(thread);
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    return await mongoDBService.likeThread(threadId, userId);
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    return await mongoDBService.addComment(threadId, comment);
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    return await mongoDBService.likeComment(threadId, commentId, userId);
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    return await mongoDBService.addReplyToComment(threadId, commentId, reply);
  }
}

const dbService = new DatabaseService();
export default dbService;
