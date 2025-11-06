import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAuth, UserRole } from "@/lib/mockAuth";
import { useToast } from "@/hooks/use-toast";
import { Scissors, ArrowLeft } from "lucide-react";
import UserPool from "../userpool";
import { CognitoUserAttribute,AuthenticationDetails,CognitoUser, } from "amazon-cognito-identity-js";

const Auth = () => {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
  
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
  
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: UserPool,
      });
  
      // Wrap callback API in a Promise
      const session = await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
          onSuccess: resolve,
          onFailure: reject,
          newPasswordRequired: () => {
            reject(new Error("New password required")); // or route to a screen to collect a new password
          },
          mfaRequired: () => {
            reject(new Error("MFA required")); // or route to your MFA flow
          },
        });
      });
  
      // Fetch user attributes to get role and other info
      const userAttributes: { role?: string; email?: string; name?: string } = await new Promise((resolve, reject) => {
        cognitoUser.getUserAttributes((err, attrs) => {
          if (err) {
            // If we can't get attributes, use the role from URL params
            resolve({ role: role as string, email });
            return;
          }
          const roleAttr = attrs?.find(a => a.getName() === "custom:Role")?.getValue();
          const emailAttr = attrs?.find(a => a.getName() === "email")?.getValue();
          const nameAttr = attrs?.find(a => a.getName() === "name")?.getValue();
          resolve({
            role: roleAttr,
            email: emailAttr || email,
            name: nameAttr,
          });
        });
      });

      // Normalize role to lowercase (Cognito might return "Customer" but we need "customer")
      const normalizedRole = (userAttributes.role || role || "").toLowerCase() as UserRole;
      
      // Save user to localStorage so dashboards can access it
      const userData = {
        id: email, // Use email as ID for now
        email: userAttributes.email || email,
        role: normalizedRole,
        name: userAttributes.name,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      const routeRole = normalizedRole;
      navigate(routeRole === "customer" ? "/customer" : "/barber");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message ?? "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;
  
      // role is already in your component state/props
      const attributeList = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
        new CognitoUserAttribute({ Name: "name", Value: name }),
        new CognitoUserAttribute({ Name: "custom:Role", Value: role as string }) // 🔹 custom attribute
      ];
  
      // Wrap Cognito callback in a Promise for async/await
      const signupPromise = new Promise((resolve, reject) => {
        UserPool.signUp(email, password, attributeList, null, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
  
      const data = await signupPromise;

      // Normalize role to lowercase to ensure consistency
      const normalizedRole = (role || "").toLowerCase() as UserRole;
      
      // Save user to localStorage so dashboards can access it
      const userData = {
        id: email,
        email: email,
        role: normalizedRole,
        name: name,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: "Account created!",
        description: "Welcome to Book My Barber.",
      });

      navigate(role === "customer" ? "/customer" : "/barber");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Scissors className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">
            {role === "customer" ? "Customer" : "Barber"} Portal
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
