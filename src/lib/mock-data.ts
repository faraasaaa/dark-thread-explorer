import { Thread } from "./types";

export const mockThreads: Thread[] = [
  {
    id: "1",
    content: "Just launched my new project! 🚀 Super excited to share it with everyone!",
    author: "Sarah Johnson",
    likes: 42,
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    content: "The sunrise this morning was absolutely breathtaking. Nature never fails to amaze me. 🌅",
    author: "Mike Chen",
    likes: 28,
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    content: "Learning TypeScript has been a game changer for my development workflow!",
    author: "Alex Thompson",
    likes: 35,
    timestamp: new Date().toISOString(),
  },
];