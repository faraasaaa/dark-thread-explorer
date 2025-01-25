import { Thread } from "@/lib/types";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import dbService from "@/lib/db.service";
import { useQueryClient } from "@tanstack/react-query";

interface ThreadListProps {
  threads: Thread[];
}

const ThreadList = ({ threads }: ThreadListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLike = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dbService.likeThread(threadId, 'current-user');
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    } catch (error) {
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
          className="glass-card p-4 rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer"
          onClick={() => navigate(`/thread/${thread.id}`)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
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
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-red-400 ${
                    thread.likedBy.includes('current-user') ? 'bg-red-100/10' : ''
                  }`}
                  onClick={(e) => handleLike(thread.id, e)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      thread.likedBy.includes('current-user') ? 'fill-current' : ''
                    }`}
                  />
                  <span className="ml-2">{thread.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/thread/${thread.id}`);
                  }}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="ml-2">{thread.comments.length}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;