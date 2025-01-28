import { LogOut, Menu, Search, ThumbsUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { useState } from "react";

interface MobileNavProps {
  totalLikes: number;
  onLogout: () => void;
  onSearch: (query: string) => void;
  searchValue: string;
}

const MobileNav = ({ totalLikes, onLogout, onSearch, searchValue }: MobileNavProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-sm border-b flex items-center justify-between px-4 sm:hidden z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <ThumbsUp className="h-4 w-4" />
                <span>Total Likes: {totalLikes}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="w-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          {!isSearchOpen ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          ) : (
            <div className="absolute inset-x-0 top-0 h-14 bg-background flex items-center px-4 gap-2">
              <Input
                placeholder="Search threads..."
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsSearchOpen(false);
                  onSearch('');
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Add padding to content when nav is visible */}
      <div className="h-14 sm:hidden" />
    </>
  );
};

export default MobileNav;