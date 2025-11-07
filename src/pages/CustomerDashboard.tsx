import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuth } from "@/lib/mockAuth";
import { apiFetch } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Search, MapPin, Star, Calendar } from "lucide-react";
import UserPool from "../userpool";
import { useToast } from "@/hooks/use-toast";
import BarberProfileView from "@/components/barber/BarberProfileView";
import BookingDialog from "@/components/barber/BookingDialog";
import CustomerBookings from "@/components/customer/CustomerBookings";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockAuth.getCurrentUser());
  const { toast } = useToast();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [profileViewOpen, setProfileViewOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== "customer") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    mockAuth.logout(); // clear localStorage
    const cognitoUser = UserPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut(); // clears tokens and Cognito session
    }
    toast({
      title: "Logged out successfully",
      description: "See you again soon!",
    });
    navigate("/");
  };

  // Mock barber data
  const mockBarbers = [
    {
      id: "1",
      name: "Classic Cuts Studio",
      address: "123 Main St, Downtown",
      rating: 4.8,
      reviews: 127,
      distance: "0.5 mi",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
      services: ["Haircut", "Beard Trim", "Hot Towel Shave"],
      price: "$30-50",
    },
    {
      id: "2",
      name: "The Gentleman's Room",
      address: "456 Oak Ave, Midtown",
      rating: 4.9,
      reviews: 203,
      distance: "1.2 mi",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400",
      services: ["Haircut", "Styling", "Coloring"],
      price: "$40-70",
    },
    {
      id: "3",
      name: "Urban Edge Barbershop",
      address: "789 Pine Rd, Uptown",
      rating: 4.7,
      reviews: 89,
      distance: "2.1 mi",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
      services: ["Haircut", "Fade", "Line Up"],
      price: "$25-45",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-semibold">
                {user?.name?.[0] || user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold">{user?.name || "Welcome"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Barbers</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search Section */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Find Your Barber</h1>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or location..."
                    className="pl-10"
                  />
                </div>
                <Button>
                  <MapPin className="w-4 h-4 mr-2" />
                  Near Me
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-accent">0</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-accent">0</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-accent">3</p>
                <p className="text-sm text-muted-foreground">Nearby</p>
              </Card>
            </div>

            {/* Barbers List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Barbers Near You</h2>
              <div className="grid gap-6">
                {mockBarbers.map((barber) => (
                  <Card key={barber.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto">
                        <img
                          src={barber.image}
                          alt={barber.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{barber.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {barber.address} • {barber.distance}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            {barber.price}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="font-semibold">{barber.rating}</span>
                            <span className="text-muted-foreground">({barber.reviews})</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {barber.services.map((service) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            className="flex-1"
                            onClick={async () => {
                              setSelectedShopId(barber.id);
                              // Fetch services for this shop (optional - BookingDialog will fetch if empty)
                              try {
                                const apiUrl = import.meta.env.VITE_API_URL || "http://mock-api";
                                const response = await apiFetch(`${apiUrl}/services?shopId=${barber.id}`);
                                if (response.ok) {
                                  const data = await response.json();
                                  setSelectedServices(data.services || []);
                                } else {
                                  // Set empty array - BookingDialog will fetch with fallback
                                  setSelectedServices([]);
                                }
                              } catch (error) {
                                console.error("Error fetching services:", error);
                                // Set empty array - BookingDialog will fetch with fallback
                                setSelectedServices([]);
                              }
                              setBookingDialogOpen(true);
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedShopId(barber.id);
                              setProfileViewOpen(true);
                            }}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            {user && <CustomerBookings userId={user.id} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Barber Profile View Dialog */}
      {selectedShopId && (
        <BarberProfileView
          shopId={selectedShopId}
          isOpen={profileViewOpen}
          onClose={() => {
            setProfileViewOpen(false);
            setSelectedShopId(null);
          }}
        />
      )}

      {/* Booking Dialog */}
      {selectedShopId && (
        <BookingDialog
          shopId={selectedShopId}
          services={selectedServices}
          isOpen={bookingDialogOpen}
          onClose={() => {
            setBookingDialogOpen(false);
            setSelectedShopId(null);
            setSelectedServices([]);
          }}
          onSuccess={() => {
            setBookingDialogOpen(false);
            setSelectedShopId(null);
            setSelectedServices([]);
            toast({
              title: "Booking Created",
              description: "Your appointment has been scheduled successfully!",
            });
            // Trigger refresh of bookings list
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("bookingUpdated"));
            }
          }}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
