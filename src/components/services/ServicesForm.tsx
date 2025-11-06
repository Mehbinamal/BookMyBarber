import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Service {
  serviceId?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

interface ServicesData {
  shopId: string;
  services: Service[];
}

interface ServicesFormProps {
  shopId: string;
}

const ServicesForm = ({ shopId }: ServicesFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<ServicesData>({
    defaultValues: {
      shopId,
      services: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch existing services on mount
  useEffect(() => {
    const fetchServices = async () => {
      if (!shopId || !apiUrl) {
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response = await fetch(`${apiUrl}/services?shopId=${shopId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.services && Array.isArray(data.services)) {
            form.reset({
              shopId: data.shopId || shopId,
              services: data.services,
            });
          } else {
            form.reset({
              shopId,
              services: [],
            });
          }
        } else if (response.status === 404) {
          // Services don't exist yet, that's okay
          form.reset({
            shopId,
            services: [],
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast({
            title: "Error",
            description: errorData.error || "Failed to fetch services",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to fetch services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchServices();
  }, [shopId, apiUrl, form, toast]);

  const onSubmit = async (data: ServicesData) => {
    if (!apiUrl) {
      toast({
        title: "Error",
        description: "API URL is not configured",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: data.shopId,
          services: data.services.map((service) => ({
            name: service.name.trim(),
            description: service.description?.trim() || "",
            price: Number(service.price),
            duration: Number(service.duration),
          })),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Services saved successfully",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to save services",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving services:", error);
      toast({
        title: "Error",
        description: "Failed to save services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading services...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Manage Services</h3>
          <p className="text-sm text-muted-foreground">
            Configure your services, pricing, and durations here.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Service {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.name`}
                        rules={{ required: "Service name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Haircut" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.price`}
                        rules={{
                          required: "Price is required",
                          min: { value: 0, message: "Price must be positive" },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.duration`}
                        rules={{
                          required: "Duration is required",
                          min: { value: 5, message: "Minimum duration is 5 minutes" },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value?.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15">15 minutes</SelectItem>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="45">45 minutes</SelectItem>
                                  <SelectItem value="60">60 minutes</SelectItem>
                                  <SelectItem value="90">90 minutes</SelectItem>
                                  <SelectItem value="120">120 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div />
                    </div>

                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe this service..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional description of what's included in this service
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No services added yet. Click "Add Service" to get started.
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  description: "",
                  price: 0,
                  duration: 30,
                })
              }
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Services
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ServicesForm;

