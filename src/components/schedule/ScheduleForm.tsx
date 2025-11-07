import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/mockApi";

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface ScheduleData {
  shopId: string;
  schedule: DaySchedule[];
}

interface ScheduleFormProps {
  shopId: string;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const ScheduleForm = ({ shopId }: ScheduleFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const defaultSchedule: DaySchedule[] = DAYS_OF_WEEK.map((day) => ({
    day: day.value,
    enabled: day.value !== "sunday",
    startTime: "09:00",
    endTime: "17:00",
  }));

  const form = useForm<ScheduleData>({
    defaultValues: {
      shopId,
      schedule: defaultSchedule,
    },
  });

  // Fetch existing schedule on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!shopId) {
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
        const response = await apiFetch(`${apiUrl}/schedule?shopId=${shopId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.schedule && Array.isArray(data.schedule)) {
            // Merge with default schedule to ensure all days are present
            const mergedSchedule = DAYS_OF_WEEK.map((dayInfo) => {
              const existing = data.schedule.find(
                (s: DaySchedule) => s.day === dayInfo.value
              );
              return (
                existing || {
                  day: dayInfo.value,
                  enabled: dayInfo.value !== "sunday",
                  startTime: "09:00",
                  endTime: "17:00",
                }
              );
            });
            form.reset({
              shopId: data.shopId || shopId,
              schedule: mergedSchedule,
            });
          } else {
            form.reset({
              shopId,
              schedule: defaultSchedule,
            });
          }
        } else if (response.status === 404) {
          // Schedule doesn't exist yet, use defaults
          form.reset({
            shopId,
            schedule: defaultSchedule,
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast({
            title: "Error",
            description: errorData.error || "Failed to fetch schedule",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast({
          title: "Error",
          description: "Failed to fetch schedule. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchSchedule();
  }, [shopId, form, toast]);

  const onSubmit = async (data: ScheduleData) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
      const response = await apiFetch(`${apiUrl}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: data.shopId,
          schedule: data.schedule.map((day) => ({
            day: day.day,
            enabled: day.enabled,
            startTime: day.startTime,
            endTime: day.endTime,
          })),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Schedule saved successfully",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to save schedule",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Error",
        description: "Failed to save schedule. Please try again.",
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
          <span className="ml-2 text-muted-foreground">Loading schedule...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
          <p className="text-sm text-muted-foreground">
            Set your availability and block time slots for each day of the week.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((dayInfo, index) => {
                const dayValue = dayInfo.value;
                const scheduleIndex = form
                  .watch("schedule")
                  .findIndex((s) => s.day === dayValue);

                if (scheduleIndex === -1) return null;

                return (
                  <Card key={dayValue} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormField
                          control={form.control}
                          name={`schedule.${scheduleIndex}.enabled`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-0">
                                <FormLabel className="text-base font-medium">
                                  {dayInfo.label}
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch(`schedule.${scheduleIndex}.enabled`) && (
                        <div className="grid grid-cols-2 gap-4 pl-8">
                          <FormField
                            control={form.control}
                            name={`schedule.${scheduleIndex}.startTime`}
                            rules={{ required: "Start time is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`schedule.${scheduleIndex}.endTime`}
                            rules={{ required: "End time is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {!form.watch(`schedule.${scheduleIndex}.enabled`) && (
                        <p className="text-sm text-muted-foreground pl-8">
                          Closed on {dayInfo.label}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

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
                Save Schedule
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ScheduleForm;

