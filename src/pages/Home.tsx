import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center space-y-6 p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Welcome to ThreadShare
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Join our community to share your thoughts, engage in discussions, and connect with others.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-white border-white hover:bg-white/10"
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Share Your Thoughts</h3>
            <p className="text-gray-600">
              Create threads and share your ideas with our growing community
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Engage & React</h3>
            <p className="text-gray-600">
              Like, comment, and interact with other members' posts
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Build Connections</h3>
            <p className="text-gray-600">
              Connect with like-minded individuals in our community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;