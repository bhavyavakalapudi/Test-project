import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Cog, LogOut, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { batchJobSchema, type InsertBatchJob } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { removeAuthToken, getAuthToken } from "@/lib/auth";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const form = useForm<InsertBatchJob>({
    resolver: zodResolver(batchJobSchema),
    defaultValues: {
      oldPatientsTarget: 0,
      importSetupId: 0,
      hourlyBatchCount: 60,
    },
  });

  const batchMutation = useMutation({
    mutationFn: async (data: InsertBatchJob) => {
      const token = getAuthToken();
      const response = await fetch("/api/start-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start batch");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Batch started successfully!",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start batch",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const onSubmit = (data: InsertBatchJob) => {
    batchMutation.mutate(data);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1448034091/photo/defocused-lobby.jpg?b=1&s=612x612&w=0&k=20&c=CLpN9aKMGFY0M60ZJ6iUMy_VJC2W9mwDYckOaYGSr7g=')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-3">
                <Cog className="text-white text-sm h-4 w-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Page</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">admin@test.com</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Batch Processing Form */}
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white">
            <CardTitle className="text-xl font-semibold">Batch Processing Configuration</CardTitle>
            <CardDescription className="text-blue-100 mt-1">
              Configure and start a new batch processing job
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* % of Old Patients to Target */}
                <FormField
                  control={form.control}
                  name="oldPatientsTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        % of Old Patients to Target
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="100"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">%</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Enter a value between 0 and 100
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Import Setup ID */}
                <FormField
                  control={form.control}
                  name="importSetupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Import Setup ID
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder="Enter a positive integer"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Must be a positive integer greater than 0
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hourly Batch Count */}
                <FormField
                  control={form.control}
                  name="hourlyBatchCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Batch Count
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          max="100"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Enter a value between 1 and 100
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={batchMutation.isPending}
                    className="px-6 py-3 font-medium rounded-lg transition-colors flex items-center"
                  >
                    {batchMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Starting Batch...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Batch
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional Info Panel */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Batch Processing Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <div className="font-medium mb-1">Old Patients Target</div>
                <div>Percentage of old patient records to include in the batch processing</div>
              </div>
              <div>
                <div className="font-medium mb-1">Import Setup ID</div>
                <div>Unique identifier for the import configuration to use</div>
              </div>
              <div>
                <div className="font-medium mb-1">Hourly Batch Count</div>
                <div>Number of records to process per hour during the batch job</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </div>
  );
}
