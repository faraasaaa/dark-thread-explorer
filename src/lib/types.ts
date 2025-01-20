export interface Thread {
  id: string;
  content: string;
  author: string;
  likes: number;
  timestamp: string;
  imageUrl?: string;
  comments: Comment[];
  likedBy: string[]; // Array of user IDs who liked the thread
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}