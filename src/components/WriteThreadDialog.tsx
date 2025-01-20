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

interface WriteThreadDialogProps {
  threads: Thread[];
  setThreads: (threads: Thread[]) => void;
}

const WriteThreadDialog = ({ threads, setThreads }: WriteThreadDialogProps) => {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (content.trim()) {
      const newThread: Thread = {
        id: Date.now().toString(),
        content,
        author: "You",
        likes: 0,
        timestamp: new Date().toISOString(),
      };
      setThreads([newThread, ...threads]);
      setContent("");
      setIsOpen(false);
      toast({
        title: "Thread posted!",
        description: "Your thread has been published successfully.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Write Thread</Button>
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
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmit} className="w-full">
            Post Thread
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteThreadDialog;