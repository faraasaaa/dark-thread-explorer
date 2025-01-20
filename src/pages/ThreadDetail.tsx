import { useParams } from "react-router-dom";
import { mockThreads } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const thread = mockThreads.find(t => t.id === id);
  
  if (!thread) {
    return <div className="min-h-screen p-4">Thread not found</div>;
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      content: newComment,
      author: "Current User",
      timestamp: new Date().toISOString(),
    };

    thread.comments.push(newCommentObj);
    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };

  const handleLike = () => {
    if (thread.likedBy.includes('current-user')) {
      thread.likedBy = thread.likedBy.filter(id => id !== 'current-user');
      thread.likes--;
    } else {
      thread.likedBy.push('current-user');
      thread.likes++;
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="glass-card p-6 rounded-lg space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="font-semibold text-xl">{thread.author}</h2>
            <p className="text-gray-400 mt-2">{thread.content}</p>
            {thread.imageUrl && (
              <img
                src={thread.imageUrl}
                alt="Thread image"
                className="mt-4 rounded-lg max-h-96 object-cover"
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`text-red-400 ${
              thread.likedBy.includes('current-user') ? 'bg-red-100/10' : ''
            }`}
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 ${
                thread.likedBy.includes('current-user') ? 'fill-current' : ''
              }`}
            />
            <span className="ml-2">{thread.likes}</span>
          </Button>
        </div>

        <div className="mt-8 space-y-6">
          <h3 className="font-semibold text-lg">Comments</h3>
          <div className="space-y-4">
            {thread.comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-secondary rounded-lg">
                <div className="font-semibold">{comment.author}</div>
                <p className="text-sm text-gray-400 mt-1">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddComment}>Add Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetail;