import { Thread, Comment, User, Reply } from './types';
import mongoDBService from './mongodb.service';
import { toast } from '@/components/ui/use-toast';

class DatabaseService {
  private handleError(error: any, message: string) {
    console.error(message, error);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const user = await mongoDBService.findUser(email, password);
      if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        toast({
          description: "Successfully logged in",
        });
      }
      return user;
    } catch (error) {
      this.handleError(error, "Login failed");
      return null;
    }
  }

  async signup(email: string, password: string, username: string): Promise<User | null> {
    try {
      const newUser = await mongoDBService.createUser({
        email,
        password,
        username
      });
      
      if (newUser) {
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        toast({
          description: "Successfully signed up",
        });
      }
      return newUser;
    } catch (error) {
      this.handleError(error, "Signup failed");
      return null;
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      this.handleError(error, "Error getting current user");
      return null;
    }
  }

  logout(): void {
    try {
      sessionStorage.removeItem('currentUser');
      toast({
        description: "Successfully logged out",
      });
    } catch (error) {
      this.handleError(error, "Logout failed");
    }
  }

  async getThreads(): Promise<Thread[]> {
    try {
      return await mongoDBService.getThreads();
    } catch (error) {
      this.handleError(error, "Error fetching threads");
      return [];
    }
  }

  async getThreadById(id: string): Promise<Thread | null> {
    try {
      return await mongoDBService.getThreadById(id);
    } catch (error) {
      this.handleError(error, "Error fetching thread");
      return null;
    }
  }

  async deleteThread(threadId: string, userId: string): Promise<boolean> {
    try {
      const success = await mongoDBService.deleteThread(threadId, userId);
      if (success) {
        toast({
          description: "Thread deleted successfully",
        });
      }
      return success;
    } catch (error) {
      this.handleError(error, "Error deleting thread");
      return false;
    }
  }

  async createThread(thread: Omit<Thread, 'id'>): Promise<Thread | null> {
    try {
      const newThread = await mongoDBService.createThread(thread);
      if (newThread) {
        toast({
          description: "Thread created successfully",
        });
      }
      return newThread;
    } catch (error) {
      this.handleError(error, "Error creating thread");
      return null;
    }
  }

  async likeThread(threadId: string, userId: string): Promise<Thread | null> {
    try {
      return await mongoDBService.likeThread(threadId, userId);
    } catch (error) {
      this.handleError(error, "Error liking thread");
      return null;
    }
  }

  async addComment(threadId: string, comment: Omit<Comment, 'id'>): Promise<Thread | null> {
    try {
      const updatedThread = await mongoDBService.addComment(threadId, comment);
      if (updatedThread) {
        toast({
          description: "Comment added successfully",
        });
      }
      return updatedThread;
    } catch (error) {
      this.handleError(error, "Error adding comment");
      return null;
    }
  }

  async likeComment(threadId: string, commentId: string, userId: string): Promise<Thread | null> {
    try {
      return await mongoDBService.likeComment(threadId, commentId, userId);
    } catch (error) {
      this.handleError(error, "Error liking comment");
      return null;
    }
  }

  async addReplyToComment(threadId: string, commentId: string, reply: Omit<Reply, 'id'>): Promise<Thread | null> {
    try {
      const updatedThread = await mongoDBService.addReplyToComment(threadId, commentId, reply);
      if (updatedThread) {
        toast({
          description: "Reply added successfully",
        });
      }
      return updatedThread;
    } catch (error) {
      this.handleError(error, "Error adding reply");
      return null;
    }
  }
}

const dbService = new DatabaseService();
export default dbService;