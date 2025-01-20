import { Input } from "@/components/ui/input";
import { useState } from "react";
import ThreadList from "@/components/ThreadList";
import { mockThreads } from "@/lib/mock-data";

const Explore = () => {
  const [search, setSearch] = useState("");
  const filteredThreads = mockThreads.filter(thread => 
    thread.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Explore Threads</h1>
        <Input
          placeholder="Search threads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <ThreadList threads={filteredThreads} />
    </div>
  );
};

export default Explore;