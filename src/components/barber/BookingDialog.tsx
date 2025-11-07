import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { mockAuth } from "@/lib/mockAuth";
import { apiFetch } from "@/lib/mockApi";
import { format } from "date-fns";

interface Service {
  serviceId?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface BookingFormData {
  serviceName: string;
  date: Date;
  time: string;
}

interface BookingDialogProps {
  shopId: string;
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingDialog = ({
  shopId,
  services: propServices,
  isOpen,
  onClose,
  onSuccess,
}: BookingDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>(propServices || []);
  const [isFetchingServices, setIsFetchingServices] = useState(false);
  const user = mockAuth.getCurrentUser();

  const form = useForm<BookingFormData>({
    defaultValues: {
      serviceName: "",
      date: new Date(),
      time: "",
    },
  });

  const selectedDate = form.watch("date");
  const selectedServiceName = form.watch("serviceName");

  // Fetch services if not provided or empty
  useEffect(() => {
    if (isOpen && shopId && (!propServices || propServices.length === 0)) {
      fetchServices();
    } else if (propServices && propServices.length > 0) {
      setServices(propServices);
    }
  }, [isOpen, shopId, propServices]);

  const fetchServices = async () => {
    setIsFetchingServices(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
      const response = await apiFetch(`${apiUrl}/services?shopId=${shopId}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      } else {
        // If API fails, use default mock services based on shopId
        const defaultServices = getDefaultServicesForShop(shopId);
        setServices(defaultServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      // Fallback to default services
      const defaultServices = getDefaultServicesForShop(shopId);
      setServices(defaultServices);
    } finally {
      setIsFetchingServices(false);
    }
  };

  // Helper function to get default services for a shop
  const getDefaultServicesForShop = (shopId: string): Service[] => {
    const defaultServicesMap: Record<string, Service[]> = {
      "1": [
        {
          serviceId: "s1",
          name: "Haircut",
          description: "Professional haircut with styling",
          price: 35,
          duration: 30,
        },
        {
          serviceId: "s2",
          name: "Beard Trim",
          description: "Precise beard trimming and shaping",
          price: 20,
          duration: 15,
        },
        {
          serviceId: "s3",
          name: "Hot Towel Shave",
          description: "Traditional hot towel shave with premium products",
          price: 45,
          duration: 45,
        },
      ],
      "2": [
        {
          serviceId: "s4",
          name: "Haircut",
          description: "Premium haircut with consultation",
          price: 50,
          duration: 45,
        },
        {
          serviceId: "s5",
          name: "Styling",
          description: "Hair styling and product application",
          price: 30,
          duration: 30,
        },
        {
          serviceId: "s6",
          name: "Coloring",
          description: "Professional hair coloring service",
          price: 80,
          duration: 90,
        },
      ],
      "3": [
        {
          serviceId: "s7",
          name: "Haircut",
          description: "Modern fade and style",
          price: 30,
          duration: 30,
        },
        {
          serviceId: "s8",
          name: "Fade",
          description: "Professional fade cut",
          price: 35,
          duration: 30,
        },
        {
          serviceId: "s9",
          name: "Line Up",
          description: "Precise edge-up and line work",
          price: 15,
          duration: 15,
        },
      ],
    };
    return defaultServicesMap[shopId] || [];
  };

  // Update selected service when service name changes
  useEffect(() => {
    const service = services.find((s) => s.name === selectedServiceName);
    setSelectedService(service || null);
  }, [selectedServiceName, services]);

  // Fetch available times when date changes
  useEffect(() => {
    if (selectedDate && shopId) {
      fetchAvailableTimes();
    }
  }, [selectedDate, shopId]);

  const fetchAvailableTimes = async () => {
    if (!selectedDate) return;

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
      const response = await apiFetch(
        `${apiUrl}/bookings/available-times?shopId=${shopId}&date=${dateStr}`
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableTimes(data.times || []);
      } else {
        // Generate default time slots if API doesn't return times
        generateDefaultTimeSlots();
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
      generateDefaultTimeSlots();
    }
  };

  const generateDefaultTimeSlots = () => {
    // Generate time slots from 9 AM to 5 PM in 30-minute intervals
    const times: string[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push(timeStr);
      }
    }
    setAvailableTimes(times);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    if (!selectedService) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
      const response = await apiFetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId,
          customerId: user.id,
          serviceName: data.serviceName,
          date: format(data.date, "yyyy-MM-dd"),
          time: data.time,
          price: selectedService.price,
          duration: selectedService.duration,
        }),
      });

      if (response.ok) {
        const responseData = await response.json().catch(() => ({}));
        console.log("Booking created successfully:", responseData);
        
        toast({
          title: "Success",
          description: "Booking created successfully!",
        });
        form.reset();
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Booking creation failed:", errorData);
        toast({
          title: "Error",
          description: errorData.error || `Failed to create booking (Status: ${response.status})`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: `Failed to create booking: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Tomorrow

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Select a service, date, and time for your appointment
          </DialogDescription>
        </DialogHeader>

        {isFetchingServices ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading services...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="serviceName"
                rules={{ required: "Please select a service" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={services.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={services.length === 0 ? "No services available" : "Select a service"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.length === 0 ? (
                          <SelectItem value="" disabled>
                            No services available
                          </SelectItem>
                        ) : (
                          services.map((service) => (
                            <SelectItem key={service.serviceId || service.name} value={service.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{service.name}</span>
                                <span className="ml-4 text-sm text-muted-foreground">
                                  ${service.price} • {service.duration} min
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {selectedService && selectedService.description && (
                      <FormDescription>{selectedService.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                rules={{ required: "Please select a date" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < minDate}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                rules={{ required: "Please select a time" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.length === 0 ? (
                          <SelectItem value="" disabled>
                            Select a date first
                          </SelectItem>
                        ) : (
                          availableTimes.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Available time slots for {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "selected date"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedService && (
              <Card className="p-4 bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">${selectedService.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {selectedService.duration} minutes
                    </p>
                  </div>
                </div>
              </Card>
            )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !selectedService || services.length === 0}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm Booking
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

