import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Clock, MapPin, X } from "lucide-react";
import { mockAuth } from "@/lib/mockAuth";
import { apiFetch } from "@/lib/mockApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Booking {
  bookingId: string;
  shopId: string;
  shopName?: string;
  customerId: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  price: number;
}

interface CustomerBookingsProps {
  userId: string;
}

const CustomerBookings = ({ userId }: CustomerBookingsProps) => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  // Refresh bookings when tab becomes visible (user switches to bookings tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userId) {
        fetchBookings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Also listen for custom booking update events
    const handleBookingUpdate = () => {
      if (userId) {
        fetchBookings();
      }
    };
    
    window.addEventListener("bookingUpdated", handleBookingUpdate);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("bookingUpdated", handleBookingUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
      console.log("Fetching bookings for userId:", userId);
      const response = await apiFetch(`${apiUrl}/bookings?customerId=${userId}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Bookings fetched:", data.bookings);
        setBookings(data.bookings || []);
      } else if (response.status === 404) {
        console.log("No bookings found (404)");
        setBookings([]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error fetching bookings:", errorData);
        toast({
          title: "Error",
          description: errorData.error || `Failed to fetch bookings (Status: ${response.status})`,
          variant: "destructive",
        });
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: `Failed to fetch bookings: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
      const response = await apiFetch(`${apiUrl}/bookings/${selectedBooking.bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        });
        setCancelDialogOpen(false);
        setSelectedBooking(null);
        fetchBookings();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to cancel booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading bookings...</span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Upcoming Bookings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Upcoming Bookings</h3>
          {upcomingBookings.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming bookings
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <Card key={booking.bookingId} className="p-4">
                  <div className="flex items-center justify-between">
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
                        {booking.shopName && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.shopName}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">${booking.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClick(booking)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Bookings */}
        {completedBookings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Completed</h3>
            <div className="space-y-3">
              {completedBookings.map((booking) => (
                <Card key={booking.bookingId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="h-8 w-[1px] bg-border" />
                      <div>
                        <p className="font-semibold">{booking.serviceName}</p>
                        {booking.shopName && (
                          <p className="text-sm text-muted-foreground">{booking.shopName}</p>
                        )}
                        <p className="text-sm text-muted-foreground">${booking.price}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="py-4">
              <p className="font-medium">{selectedBooking.serviceName}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isCancelling}
            >
              {isCancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerBookings;

