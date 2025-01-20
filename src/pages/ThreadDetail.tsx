import { useParams, useNavigate } from "react-router-dom";
import { mockThreads } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ArrowLeft, MessageCircle } from "lucide-react";
import { Comment } from "@/lib/types";

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  
  const thread = mockThreads.find(t => t.id === id);
  
  if (!thread) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Thread not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      content: newComment,
      author: "Current User",
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
    };

    thread.comments.push(newCommentObj);
    setNewComment("");
    toast({
      title: "Success",
      description: "Comment added successfully",
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
    toast({
      description: thread.likedBy.includes('current-user') 
        ? "Added to your likes" 
        : "Removed from your likes",
    });
  };

  const handleCommentLike = (commentId: string) => {
    const comment = thread.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.likedBy?.includes('current-user')) {
      comment.likedBy = comment.likedBy.filter(id => id !== 'current-user');
      comment.likes--;
    } else {
      if (!comment.likedBy) comment.likedBy = [];
      comment.likedBy.push('current-user');
      comment.likes++;
    }
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }

    const comment = thread.comments.find(c => c.id === commentId);
    if (!comment) return;

    const newReply = {
      id: `r${Date.now()}`,
      content: replyContent,
      author: "Current User",
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    if (!comment.replies) {
      comment.replies = [];
    }
    
    comment.replies.push(newReply);
    setReplyContent("");
    setReplyingTo(null);
    toast({
      title: "Success",
      description: "Reply added successfully",
    });
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-secondary"
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
                className="mt-4 rounded-lg max-h-96 object-cover w-full"
              />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`text-red-400 hover:bg-red-100/10 ${
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
          <h3 className="font-semibold text-lg">Comments ({thread.comments.length})</h3>
          <div className="space-y-4">
            {thread.comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">{comment.author}</div>
                      <p className="text-sm text-gray-400 mt-1">{comment.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`text-red-400 hover:bg-red-100/10 ${
                          comment.likedBy?.includes('current-user') ? 'bg-red-100/10' : ''
                        }`}
                        onClick={() => handleCommentLike(comment.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            comment.likedBy?.includes('current-user') ? 'fill-current' : ''
                          }`}
                        />
                        <span className="ml-1 text-sm">{comment.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setReplyingTo(comment.id)}
                        className="hover:bg-secondary"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/40 transition-colors">
                          <div className="font-semibold text-sm">{reply.author}</div>
                          <p className="text-sm text-gray-400">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {replyingTo === comment.id && (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[60px] bg-background/50"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleReply(comment.id)}
                          className="hover:bg-primary/90"
                        >
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                          className="hover:bg-secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] bg-background/50"
            />
            <Button 
              onClick={handleAddComment}
              className="hover:bg-primary/90"
            >
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetail;