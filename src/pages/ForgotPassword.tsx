import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-lg space-y-6">
        <h1 className="text-3xl font-bold text-center">Reset Password</h1>
        <p className="text-center text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full hover-effect">
            Send Reset Link
          </Button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-primary hover:underline block text-center w-full"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;