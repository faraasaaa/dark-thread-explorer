import { Thread } from "@/lib/types";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

interface ThreadListProps {
  threads: Thread[];
}

const ThreadList = ({ threads: initialThreads }: ThreadListProps) => {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleLike = (threadId: string) => {
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              likes: thread.likedBy.includes('current-user')
                ? thread.likes - 1
                : thread.likes + 1,
              likedBy: thread.likedBy.includes('current-user')
                ? thread.likedBy.filter(id => id !== 'current-user')
                : [...thread.likedBy, 'current-user']
            }
          : thread
      )
    );
  };

  const handleAddComment = () => {
    if (!selectedThread || !newComment.trim()) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      content: newComment,
      author: "Current User",
      timestamp: new Date().toISOString(),
    };

    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === selectedThread.id
          ? {
              ...thread,
              comments: [...thread.comments, newCommentObj]
            }
          : thread
      )
    );

    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div key={thread.id} className="glass-card p-4 rounded-lg hover-effect">
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
                  onClick={() => handleLike(thread.id)}
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
                  onClick={() => setSelectedThread(thread)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="ml-2">{thread.comments.length}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thread Comments</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedThread?.comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-secondary rounded-lg">
                <div className="font-semibold">{comment.author}</div>
                <p className="text-sm text-gray-400">{comment.content}</p>
              </div>
            ))}
            <div className="space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadList;