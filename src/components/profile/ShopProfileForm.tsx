import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface ShopProfile {
  shopId: string;
  ownerUserId: string;
  name: string;
  location: string | null;
  phone: string | null;
  about: string;
}

interface ShopProfileFormProps {
  shopId: string;
  ownerUserId: string;
}

const ShopProfileForm = ({ shopId, ownerUserId }: ShopProfileFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<ShopProfile>({
    defaultValues: {
      shopId,
      ownerUserId,
      name: "",
      location: "",
      phone: "",
      about: "",
    },
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!shopId || !apiUrl) {
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response = await fetch(`${apiUrl}/shops?shopId=${shopId}`);

        if (response.ok) {
          const data = await response.json();
          form.reset({
            shopId: data.shopId || shopId,
            ownerUserId: data.ownerUserId || ownerUserId,
            name: data.name || "",
            location: data.location || "",
            phone: data.phone || "",
            about: data.about || "",
          });
        } else if (response.status === 404) {
          // Profile doesn't exist yet, that's okay
          form.reset({
            shopId,
            ownerUserId,
            name: "",
            location: "",
            phone: "",
            about: "",
          });
        } else {
          const errorData = await response.json();
          toast({
            title: "Error",
            description: errorData.error || "Failed to fetch profile",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [shopId, ownerUserId, apiUrl, form, toast]);

  const onSubmit = async (data: ShopProfile) => {
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
      const response = await fetch(`${apiUrl}/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: data.shopId,
          ownerUserId: data.ownerUserId,
          name: data.name,
          location: data.location?.trim() || null,
          phone: data.phone?.trim() || null,
          about: data.about?.trim() || "",
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile saved successfully",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to save profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
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
          <span className="ml-2 text-muted-foreground">Loading profile...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Shop Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your shop information, location, and contact details.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Shop name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shop name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your barbershop or salon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter shop address"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    The physical address of your shop
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Contact phone number for your shop
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell customers about your shop..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your shop, services, and what makes you unique
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ShopProfileForm;

