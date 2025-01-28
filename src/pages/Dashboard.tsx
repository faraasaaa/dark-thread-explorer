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
import MobileNav from "@/components/MobileNav";

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
    thread.content.toLowerCase().includes(search.toLowerCase()) ||
    thread.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalLikes = threads.reduce((acc, thread) => acc + thread.likes, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-destructive">Error loading threads</div>
      </div>
    );
  }

  return (
    <>
      <MobileNav 
        totalLikes={totalLikes}
        onLogout={handleLogout}
        onSearch={setSearch}
        searchValue={search}
      />
      
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Desktop Header */}
        <div className="hidden sm:flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search threads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              onClick={() => navigate("/explore")}
              variant="outline"
            >
              Explore
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <WriteThreadDialog onThreadCreated={() => refetch()} />
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            <div className="glass-card px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Total Likes:</span>
              <span className="ml-2 font-bold">{totalLikes}</span>
            </div>
          </div>
        </div>

        {/* Mobile Write Button */}
        <div className="sm:hidden">
          <WriteThreadDialog onThreadCreated={() => refetch()} />
        </div>

        {/* Thread List */}
        <div className="pb-20 sm:pb-0">
          <ThreadList threads={filteredThreads} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;