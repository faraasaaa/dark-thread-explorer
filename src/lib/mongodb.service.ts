import { Thread, User, Comment, Reply } from './types';

const API_URL = 'http://localhost:3001/api';

class MongoDBService {
  async findUser(email: string, password: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.ok ? await response.json() : null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User | null> {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return response.ok ? await response.json() : null;
  }

  async getThreads(): Promise<Thread[]> {
    const response = await fetch(`${API_URL}/threads`);
    return response.ok ? await response.json() : [];
  }

  async getThreadById(id: string): Promise<Thread | null> {
    const response = await fetch(`${API_URL}/threads/${id}`);
    return response.ok ? await response.json() : null;
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread> {
    const response = await fetch(`${API_URL}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thread)
    });
    return await response.json();
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/threads/${threadId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return response.ok;
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    const response = await fetch(`${API_URL}/threads/${threadId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return response.ok ? await response.json() : null;
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    const response = await fetch(`${API_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    return response.ok ? await response.json() : null;
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    const response = await fetch(`${API_URL}/threads/${threadId}/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return response.ok ? await response.json() : null;
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    const response = await fetch(`${API_URL}/threads/${threadId}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply)
    });
    return response.ok ? await response.json() : null;
  }
}

const mongoDBService = new MongoDBService();
export default mongoDBService;