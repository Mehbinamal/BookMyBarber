import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuth } from "@/lib/mockAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Calendar, Users, DollarSign, Star, Clock } from "lucide-react";
import ShopProfileForm from "@/components/profile/ShopProfileForm";

const BarberDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockAuth.getCurrentUser());

  useEffect(() => {
    if (!user || user.role !== "barber") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    mockAuth.logout();
    navigate("/");
  };

  const mockStats = {
    todayBookings: 5,
    thisWeek: 23,
    rating: 4.8,
    reviews: 127,
    revenue: 1250,
  };

  const todayAppointments = [
    { id: 1, time: "09:00 AM", customer: "John Smith", service: "Haircut", status: "confirmed" },
    { id: 2, time: "10:30 AM", customer: "Mike Johnson", service: "Beard Trim", status: "confirmed" },
    { id: 3, time: "01:00 PM", customer: "David Lee", service: "Hot Towel Shave", status: "pending" },
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
              <p className="text-xs text-muted-foreground">Barber Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.todayBookings}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.thisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">${mockStats.revenue}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.reviews}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Today's Appointments</h2>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>

            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{apt.time}</span>
                      </div>
                      <div className="h-10 w-[1px] bg-border" />
                      <div>
                        <p className="font-semibold">{apt.customer}</p>
                        <p className="text-sm text-muted-foreground">{apt.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          apt.status === "confirmed"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {apt.status}
                      </span>
                      <Button size="sm">Complete</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Manage Services</h3>
              <p className="text-muted-foreground">Configure your services, pricing, and durations here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
              <p className="text-muted-foreground">Set your availability and block time slots.</p>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            {user && (
              <ShopProfileForm
                shopId={user.id}
                ownerUserId={user.id}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BarberDashboard;
