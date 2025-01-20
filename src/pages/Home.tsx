import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-lg space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Welcome to Threads
        </h1>
        <p className="text-center text-gray-400">
          Join the conversation, share your thoughts, and connect with others.
        </p>
        <div className="space-y-4">
          <Button 
            className="w-full hover-effect"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            className="w-full hover-effect"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;