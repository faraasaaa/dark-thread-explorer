import { Thread } from "@/lib/types";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import dbService from "@/lib/db.service";
import { useQueryClient } from "@tanstack/react-query";

interface ThreadListProps {
  threads: Thread[];
}

const ThreadList = ({ threads }: ThreadListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = dbService.getCurrentUser();

  const handleLike = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to like threads",
        variant: "destructive",
      });
      return;
    }

    // Get the current thread
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    // Optimistically update the UI
    const isLiked = thread.likedBy.includes(currentUser.id);
    const optimisticThread = {
      ...thread,
      likes: isLiked ? thread.likes - 1 : thread.likes + 1,
      likedBy: isLiked 
        ? thread.likedBy.filter(id => id !== currentUser.id)
        : [...thread.likedBy, currentUser.id]
    };

    // Update the cache immediately
    queryClient.setQueryData(['threads'], (old: Thread[] = []) => 
      old.map(t => t.id === threadId ? optimisticThread : t)
    );

    try {
      await dbService.likeThread(threadId, currentUser.id);
    } catch (error) {
      // Revert on error
      queryClient.setQueryData(['threads'], (old: Thread[] = []) => 
        old.map(t => t.id === threadId ? thread : t)
      );
      
      toast({
        title: "Error",
        description: "Failed to like the thread",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div 
          key={thread.id} 
          className="glass-card p-4 rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer hover-effect"
          onClick={() => navigate(`/thread/${thread.id}`)}
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold">{thread.author}</h3>
              <p className="text-gray-400 mt-1">{thread.content}</p>
              {thread.imageUrl && (
                <img
                  src={thread.imageUrl}
                  alt="Thread image"
                  className="mt-2 rounded-lg max-h-96 object-cover"
                />
              )}
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`group flex items-center gap-2 hover:text-red-400 ${
                  currentUser && thread.likedBy.includes(currentUser.id) ? 'text-red-400' : ''
                }`}
                onClick={(e) => handleLike(thread.id, e)}
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-200 group-hover:scale-110 ${
                    currentUser && thread.likedBy.includes(currentUser.id) ? 'fill-current' : ''
                  }`}
                />
                <span>{thread.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="group flex items-center gap-2 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/thread/${thread.id}`);
                }}
              >
                <MessageCircle className="h-5 w-5 transition-all duration-200 group-hover:scale-110" />
                <span>{thread.comments.length}</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;