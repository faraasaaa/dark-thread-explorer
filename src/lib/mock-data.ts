import { Thread } from "./types";

export const mockThreads: Thread[] = [
  {
    id: "1",
    content: "Just launched my new project! 🚀 Super excited to share it with everyone!",
    author: "Sarah Johnson",
    likes: 42,
    timestamp: new Date().toISOString(),
    likedBy: [],
    comments: [
      {
        id: "c1",
        content: "This looks amazing! Can't wait to try it out.",
        author: "Mike Chen",
        timestamp: new Date().toISOString(),
      }
    ]
  },
  {
    id: "2",
    content: "The sunrise this morning was absolutely breathtaking. Nature never fails to amaze me. 🌅",
    author: "Mike Chen",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    likes: 28,
    timestamp: new Date().toISOString(),
    likedBy: [],
    comments: []
  },
  {
    id: "3",
    content: "Learning TypeScript has been a game changer for my development workflow!",
    author: "Alex Thompson",
    likes: 35,
    timestamp: new Date().toISOString(),
    likedBy: [],
    comments: []
  },
];