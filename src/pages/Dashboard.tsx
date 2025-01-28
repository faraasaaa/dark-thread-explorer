import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ThreadList from "@/components/ThreadList";
import WriteThreadDialog from "@/components/WriteThreadDialog";
import dbService from "@/lib/db.service";
import { useToast } from "@/components/ui/use-toast";
import { Thread } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const { data: threads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['threads'],
    queryFn: () => dbService.getThreads(),
  });

  const handleLogout = () => {
    dbService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const filteredThreads = threads.filter(thread => 
    thread.content.toLowerCase().includes(search.toLowerCase())
  );

  const totalLikes = threads.reduce((acc, thread) => acc + thread.likes, 0);

  if (isLoading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen p-4 flex items-center justify-center">Error loading threads</div>;
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Input
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Button 
            onClick={() => navigate("/explore")}
            className="w-full sm:w-auto"
          >
            Explore
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <WriteThreadDialog onThreadCreated={() => refetch()} />
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          <div className="glass-card px-4 py-2 rounded-lg w-full sm:w-auto text-center">
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