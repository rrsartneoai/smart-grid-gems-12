import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Mail, Chrome } from "lucide-react";

export function AdminLogin() {
  const handleGoogleLogin = () => {
    // Implement Google login
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    // Implement GitHub login
    console.log("GitHub login clicked");
  };

  const handleEmailLogin = () => {
    // Implement email login
    console.log("Email login clicked");
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Zaloguj się</h2>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <Chrome className="w-5 h-5" />
          Zaloguj przez Google
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGithubLogin}
        >
          <Github className="w-5 h-5" />
          Zaloguj przez GitHub
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleEmailLogin}
        >
          <Mail className="w-5 h-5" />
          Zaloguj przez Email
        </Button>
      </div>
    </Card>
  );
}