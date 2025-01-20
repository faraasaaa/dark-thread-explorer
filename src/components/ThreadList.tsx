import { Thread } from "@/lib/types";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

interface ThreadListProps {
  threads: Thread[];
}

const ThreadList = ({ threads }: ThreadListProps) => {
  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div key={thread.id} className="glass-card p-4 rounded-lg hover-effect">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{thread.author}</h3>
              <p className="text-gray-400 mt-1">{thread.content}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-red-400">
              <Heart className="h-5 w-5" />
              <span className="ml-2">{thread.likes}</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;