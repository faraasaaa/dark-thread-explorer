import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ThreadList from "@/components/ThreadList";
import WriteThreadDialog from "@/components/WriteThreadDialog";
import { mockThreads } from "@/lib/mock-data";

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [threads, setThreads] = useState(mockThreads);
  const totalLikes = threads.reduce((acc, thread) => acc + thread.likes, 0);

  const filteredThreads = threads.filter(thread => 
    thread.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => navigate("/explore")}>
            Explore
          </Button>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <WriteThreadDialog threads={threads} setThreads={setThreads} />
          <div className="glass-card px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-400">Total Likes:</span>
            <span className="ml-2 font-bold">{totalLikes}</span>
          </div>
        </div>
      </div>
      <ThreadList threads={filteredThreads} />
    </div>
  );
};

export default Dashboard;