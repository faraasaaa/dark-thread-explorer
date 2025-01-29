import { Thread, User, Comment, Reply } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw new Error(`Failed to fetch: ${error.message}`);
  }
}

class MongoDBService {
  async findUser(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<User | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/users/signup`, {
        method: 'POST',
        body: JSON.stringify(user)
      });
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  }

  async getThreads(): Promise<Thread[]> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads`);
      return await response.json();
    } catch (error) {
      console.error('Get threads error:', error);
      return [];
    }
  }

  async getThreadById(id: string): Promise<Thread | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Get thread error:', error);
      return null;
    }
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads`, {
        method: 'POST',
        body: JSON.stringify(thread)
      });
      return await response.json();
    } catch (error) {
      console.error('Create thread error:', error);
      return null;
    }
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads/${threadId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId })
      });
      return response.ok;
    } catch (error) {
      console.error('Delete thread error:', error);
      return false;
    }
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads/${threadId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      return await response.json();
    } catch (error) {
      console.error('Like thread error:', error);
      return null;
    }
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads/${threadId}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment)
      });
      return await response.json();
    } catch (error) {
      console.error('Add comment error:', error);
      return null;
    }
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads/${threadId}/comments/${commentId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      return await response.json();
    } catch (error) {
      console.error('Like comment error:', error);
      return null;
    }
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    try {
      const response = await fetchWithRetry(`${API_URL}/threads/${threadId}/comments/${commentId}/replies`, {
        method: 'POST',
        body: JSON.stringify(reply)
      });
      return await response.json();
    } catch (error) {
      console.error('Add reply error:', error);
      return null;
    }
  }
}

const mongoDBService = new MongoDBService();
export default mongoDBService;