export interface Thread {
  id: string;
  content: string;
  author: string;
  likes: number;
  timestamp: string;
  imageUrl?: string;
  comments: Comment[];
  likedBy: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes?: number;
  likedBy?: string[];
  replies?: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes?: number;
  likedBy?: string[];
}