import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Thread } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import dbService from "@/lib/db.service";
import { useQueryClient } from "@tanstack/react-query";

interface WriteThreadDialogProps {
  threads: Thread[];
  setThreads: (threads: Thread[]) => void;
}

const WriteThreadDialog = ({ threads }: WriteThreadDialogProps) => {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await dbService.createThread({
        content,
        author: "You",
        likes: 0,
        timestamp: new Date().toISOString(),
        comments: [],
        likedBy: [],
      });

      setContent("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      
      toast({
        title: "Success!",
        description: "Your thread has been posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post thread. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="hover-effect">Write Thread</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a new thread</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post Thread"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteThreadDialog;