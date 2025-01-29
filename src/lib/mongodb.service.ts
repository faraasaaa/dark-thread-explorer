import jsonDbService from './jsonDb.service';
import { Thread, User, Comment, Reply } from './types';

class MongoDBService {
  async findUser(email: string, password: string): Promise<User | null> {
    return jsonDbService.findUser(email, password);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
    return jsonDbService.createUser(userData);
  }

  async getThreads(): Promise<Thread[]> {
    return jsonDbService.getThreads();
  }

  async getThreadById(id: string): Promise<Thread | null> {
    return jsonDbService.getThreadById(id);
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread | null> {
    return jsonDbService.createThread(thread);
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    return jsonDbService.deleteThread(threadId, userId);
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    return jsonDbService.likeThread(threadId, userId);
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    return jsonDbService.addComment(threadId, comment);
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    return jsonDbService.likeComment(threadId, commentId, userId);
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    return jsonDbService.addReplyToComment(threadId, commentId, reply);
  }
}

const mongoDBService = new MongoDBService();
export default mongoDBService;