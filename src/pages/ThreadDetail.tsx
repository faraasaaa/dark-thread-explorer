import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
import { Comment } from "@/lib/types";
import dbService from "@/lib/db.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();
  const currentUser = dbService.getCurrentUser();
  
  const { data: thread, isLoading, error } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => dbService.getThreadById(id || ''),
  });

  const handleDelete = async () => {
    if (!currentUser || !thread) return;

    try {
      const success = await dbService.deleteThread(thread.id, currentUser.id);
      if (success) {
        // Update the threads cache by removing the deleted thread
        queryClient.setQueryData(['threads'], (old: Thread[] = []) => 
          old.filter(t => t.id !== thread.id)
        );
        
        toast({
          description: "Thread deleted successfully",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "You can only delete your own threads",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the thread",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Please login to view and interact with threads</h2>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }
  
  if (isLoading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">Loading...</div>;
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Thread not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      await dbService.addComment(thread.id, {
        content: newComment,
        author: currentUser.username,
        timestamp: new Date().toISOString(),
      });
      
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleLike = async () => {
    if (thread.likedBy.includes(currentUser.id)) {
      toast({
        description: "You've already liked this thread",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update
    const optimisticThread = {
      ...thread,
      likes: thread.likes + 1,
      likedBy: [...thread.likedBy, currentUser.id]
    };

    queryClient.setQueryData(['thread', id], optimisticThread);

    try {
      await dbService.likeThread(thread.id, currentUser.id);
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
      toast({
        description: "Added to your likes",
      });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(['thread', id], thread);
      toast({
        title: "Error",
        description: "Failed to like thread",
        variant: "destructive",
      });
    }
  };

  const handleCommentLike = async (commentId: string) => {
    const comment = thread.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.likedBy?.includes(currentUser.id)) {
      toast({
        description: "You've already liked this comment",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update for comment like
    const optimisticThread = {
      ...thread,
      comments: thread.comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: (c.likes || 0) + 1,
            likedBy: [...(c.likedBy || []), currentUser.id]
          };
        }
        return c;
      })
    };

    queryClient.setQueryData(['thread', id], optimisticThread);

    try {
      await dbService.likeComment(thread.id, commentId, currentUser.id);
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.setQueryData(['thread', id], thread);
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }

    try {
      await dbService.addReplyToComment(thread.id, commentId, {
        content: replyContent,
        author: currentUser.username,
        timestamp: new Date().toISOString(),
      });
      
      setReplyContent("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {currentUser && thread?.author === currentUser.username && (
          <Button
            variant="destructive"
            size="sm"
            className="mb-6"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Thread
          </Button>
        )}
      </div>

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
