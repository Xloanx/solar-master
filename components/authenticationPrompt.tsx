
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, User } from "lucide-react";

export const AuthenticationPrompt = () => {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Status
        </CardTitle>
        <CardDescription>
          You are currently using the app as a guest user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Limited access - History and advanced features require authentication</span>
          </div>
          <Button variant="outline" className="ml-auto">
            Sign Up / Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};