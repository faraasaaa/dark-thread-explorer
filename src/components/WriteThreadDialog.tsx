import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ImagePlus } from "lucide-react";

interface WriteThreadDialogProps {
  onThreadCreated?: () => void;
}

const WriteThreadDialog = ({ onThreadCreated }: WriteThreadDialogProps) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    const currentUser = dbService.getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newThread = {
        content,
        author: currentUser.username,
        likes: 0,
        timestamp: new Date().toISOString(),
        comments: [],
        likedBy: [],
        imageUrl: imageUrl || undefined,
      };

      await dbService.createThread(newThread);
      setContent("");
      setImageUrl("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      onThreadCreated?.();
      
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
          <DialogDescription>Share your thoughts with the world</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </Button>
            {imageUrl && (
              <span className="text-sm text-muted-foreground">Image selected</span>
            )}
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          )}
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