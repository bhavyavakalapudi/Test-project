import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Cog, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { setAuthToken } from "@/lib/auth";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: "Login successful",
        description: "Welcome to the admin portal",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1448034091/photo/defocused-lobby.jpg?b=1&s=612x612&w=0&k=20&c=CLpN9aKMGFY0M60ZJ6iUMy_VJC2W9mwDYckOaYGSr7g=')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="max-w-md w-full space-y-8 z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-6">
            <Cog className="text-white text-2xl h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-white">Sign in to access the batch processing dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder="admin@test.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors pl-11"
                          />
                          <Mail className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors pl-11 pr-11"
                          />
                          <Lock className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Email: admin@test.com<br />
                Password: password123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
