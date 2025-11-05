import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scissors, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
              <Scissors className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Book My Barber
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with premium barbers or grow your barbershop business
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 cursor-pointer group">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">I'm a Customer</h3>
                  <p className="text-muted-foreground">
                    Find and book appointments with top-rated barbers near you
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Real-time availability
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    Reviews & ratings
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate("/auth/customer")}
                  className="w-full"
                  size="lg"
                >
                  Get Started as Customer
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 cursor-pointer group">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Scissors className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">I'm a Barber</h3>
                  <p className="text-muted-foreground">
                    Manage your shop, services, and appointments in one place
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Schedule management
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    Build your reputation
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate("/auth/barber")}
                  className="w-full"
                  size="lg"
                >
                  Get Started as Barber
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground">Premium barbershop experience, simplified</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Calendar, title: "Easy Booking", desc: "Book in seconds with real-time availability" },
            { icon: Star, title: "Quality Assurance", desc: "Verified barbers with authentic reviews" },
            { icon: Users, title: "Growing Community", desc: "Join thousands of satisfied customers" },
          ].map((feature, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
