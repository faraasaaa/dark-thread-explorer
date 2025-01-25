import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreadList from "@/components/ThreadList";
import { useQuery } from "@tanstack/react-query";
import dbService from "@/lib/db.service";

const Explore = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: () => dbService.getThreads(),
  });

  const filteredThreads = threads.filter(thread => 
    thread.content.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="hover-effect flex items-center gap-2"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Button>
      </div>
      <ThreadList threads={filteredThreads} />
    </div>
  );
};

export default Explore;