import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Star, Phone, Clock, Calendar, X } from "lucide-react";
import BookingDialog from "./BookingDialog";
import { mockAuth } from "@/lib/mockAuth";

interface BarberProfile {
  shopId: string;
  name: string;
  location: string | null;
  phone: string | null;
  about: string;
}

interface Service {
  serviceId?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface Booking {
  bookingId: string;
  shopId: string;
  customerId: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  price: number;
}

interface BarberProfileViewProps {
  shopId: string;
  isOpen: boolean;
  onClose: () => void;
}

const BarberProfileView = ({ shopId, isOpen, onClose }: BarberProfileViewProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const user = mockAuth.getCurrentUser();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && shopId) {
      fetchBarberData();
    }
  }, [isOpen, shopId]);

  const fetchBarberData = async () => {
    if (!apiUrl) return;

    setIsLoading(true);
    try {
      // Fetch profile
      const profileRes = await fetch(`${apiUrl}/shops?shopId=${shopId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // Fetch services
      const servicesRes = await fetch(`${apiUrl}/services?shopId=${shopId}`);
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      }

      // Fetch customer bookings with this barber
      if (user?.id) {
        const bookingsRes = await fetch(`${apiUrl}/bookings?customerId=${user.id}&shopId=${shopId}`);
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }
      }
    } catch (error) {
      console.error("Error fetching barber data:", error);
      toast({
        title: "Error",
        description: "Failed to load barber information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    fetchBarberData(); // Refresh bookings
    setIsBookingOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Barber Profile</DialogTitle>
            <DialogDescription>
              View barber details and your bookings
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Section */}
              {profile && (
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      {profile.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </p>
                      )}
                      {profile.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="w-4 h-4" />
                          {profile.phone}
                        </p>
                      )}
                    </div>
                    {profile.about && (
                      <div>
                        <h3 className="font-semibold mb-2">About</h3>
                        <p className="text-sm text-muted-foreground">{profile.about}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Services Section */}
              {services.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <div
                        key={service.serviceId || service.name}
                        className="flex justify-between items-start p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{service.name}</h4>
                            <Badge variant="secondary">${service.price}</Badge>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration} min
                            </Badge>
                          </div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Customer Bookings Section */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Your Bookings</h3>
                  <Button onClick={() => setIsBookingOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No bookings yet. Book your first appointment!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.bookingId}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="h-8 w-[1px] bg-border" />
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{booking.time}</span>
                          </div>
                          <div className="h-8 w-[1px] bg-border" />
                          <div>
                            <p className="font-semibold">{booking.serviceName}</p>
                            <p className="text-sm text-muted-foreground">${booking.price}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BookingDialog
        shopId={shopId}
        services={services}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
};

export default BarberProfileView;

