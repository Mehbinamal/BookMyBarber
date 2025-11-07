import { mockAuth } from "./mockAuth";

// Types
interface Shop {
  shopId: string;
  ownerUserId: string;
  name: string;
  location: string | null;
  phone: string | null;
  about: string;
}

interface Service {
  serviceId: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface Schedule {
  shopId: string;
  schedule: DaySchedule[];
}

interface Booking {
  bookingId: string;
  shopId: string;
  customerId: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
  duration: number;
}

// Storage keys
const STORAGE_KEYS = {
  SHOPS: "mock_shops",
  SERVICES: "mock_services",
  SCHEDULES: "mock_schedules",
  BOOKINGS: "mock_bookings",
};

// Initialize mock data
const initializeMockData = () => {
  // Initialize shops
  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    const defaultShops: Shop[] = [
      {
        shopId: "1",
        ownerUserId: "barber1",
        name: "Classic Cuts Studio",
        location: "123 Main St, Downtown",
        phone: "+1 (555) 123-4567",
        about: "A premium barbershop offering classic cuts and modern styles. We've been serving the community for over 20 years with expert barbers and top-quality service.",
      },
      {
        shopId: "2",
        ownerUserId: "barber2",
        name: "The Gentleman's Room",
        location: "456 Oak Ave, Midtown",
        phone: "+1 (555) 234-5678",
        about: "Experience luxury grooming at its finest. Our skilled barbers provide personalized service in an elegant, comfortable environment.",
      },
      {
        shopId: "3",
        ownerUserId: "barber3",
        name: "Urban Edge Barbershop",
        location: "789 Pine Rd, Uptown",
        phone: "+1 (555) 345-6789",
        about: "Modern barbershop specializing in fades, line-ups, and contemporary styles. Walk-ins welcome!",
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(defaultShops));
  }

  // Initialize services
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    const defaultServices: Service[] = [
      {
        serviceId: "s1",
        shopId: "1",
        name: "Haircut",
        description: "Professional haircut with styling",
        price: 35,
        duration: 30,
      },
      {
        serviceId: "s2",
        shopId: "1",
        name: "Beard Trim",
        description: "Precise beard trimming and shaping",
        price: 20,
        duration: 15,
      },
      {
        serviceId: "s3",
        shopId: "1",
        name: "Hot Towel Shave",
        description: "Traditional hot towel shave with premium products",
        price: 45,
        duration: 45,
      },
      {
        serviceId: "s4",
        shopId: "2",
        name: "Haircut",
        description: "Premium haircut with consultation",
        price: 50,
        duration: 45,
      },
      {
        serviceId: "s5",
        shopId: "2",
        name: "Styling",
        description: "Hair styling and product application",
        price: 30,
        duration: 30,
      },
      {
        serviceId: "s6",
        shopId: "2",
        name: "Coloring",
        description: "Professional hair coloring service",
        price: 80,
        duration: 90,
      },
      {
        serviceId: "s7",
        shopId: "3",
        name: "Haircut",
        description: "Modern fade and style",
        price: 30,
        duration: 30,
      },
      {
        serviceId: "s8",
        shopId: "3",
        name: "Fade",
        description: "Professional fade cut",
        price: 35,
        duration: 30,
      },
      {
        serviceId: "s9",
        shopId: "3",
        name: "Line Up",
        description: "Precise edge-up and line work",
        price: 15,
        duration: 15,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
  }

  // Initialize schedules
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
    const defaultSchedules: Schedule[] = [
      {
        shopId: "1",
        schedule: [
          { day: "monday", enabled: true, startTime: "09:00", endTime: "18:00" },
          { day: "tuesday", enabled: true, startTime: "09:00", endTime: "18:00" },
          { day: "wednesday", enabled: true, startTime: "09:00", endTime: "18:00" },
          { day: "thursday", enabled: true, startTime: "09:00", endTime: "18:00" },
          { day: "friday", enabled: true, startTime: "09:00", endTime: "18:00" },
          { day: "saturday", enabled: true, startTime: "10:00", endTime: "16:00" },
          { day: "sunday", enabled: false, startTime: "09:00", endTime: "17:00" },
        ],
      },
      {
        shopId: "2",
        schedule: [
          { day: "monday", enabled: true, startTime: "10:00", endTime: "19:00" },
          { day: "tuesday", enabled: true, startTime: "10:00", endTime: "19:00" },
          { day: "wednesday", enabled: true, startTime: "10:00", endTime: "19:00" },
          { day: "thursday", enabled: true, startTime: "10:00", endTime: "19:00" },
          { day: "friday", enabled: true, startTime: "10:00", endTime: "19:00" },
          { day: "saturday", enabled: true, startTime: "09:00", endTime: "17:00" },
          { day: "sunday", enabled: false, startTime: "09:00", endTime: "17:00" },
        ],
      },
      {
        shopId: "3",
        schedule: [
          { day: "monday", enabled: true, startTime: "08:00", endTime: "20:00" },
          { day: "tuesday", enabled: true, startTime: "08:00", endTime: "20:00" },
          { day: "wednesday", enabled: true, startTime: "08:00", endTime: "20:00" },
          { day: "thursday", enabled: true, startTime: "08:00", endTime: "20:00" },
          { day: "friday", enabled: true, startTime: "08:00", endTime: "20:00" },
          { day: "saturday", enabled: true, startTime: "09:00", endTime: "18:00" },
          { day: "sunday", enabled: true, startTime: "10:00", endTime: "16:00" },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(defaultSchedules));
  }

  // Initialize bookings
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    const defaultBookings: Booking[] = [
      {
        bookingId: "b1",
        shopId: "1",
        customerId: "customer1",
        serviceName: "Haircut",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "10:00",
        status: "confirmed",
        price: 35,
        duration: 30,
      },
      {
        bookingId: "b2",
        shopId: "2",
        customerId: "customer1",
        serviceName: "Styling",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "14:00",
        status: "pending",
        price: 30,
        duration: 30,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(defaultBookings));
  }
};

// Initialize on import
initializeMockData();

// Helper functions
const getShops = (): Shop[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SHOPS);
  return data ? JSON.parse(data) : [];
};

const getServices = (): Service[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

const getSchedules = (): Schedule[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
  return data ? JSON.parse(data) : [];
};

const getBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading bookings from localStorage:", error);
    return [];
  }
};

const saveShops = (shops: Shop[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  } catch (error) {
    console.error("Error saving shops to localStorage:", error);
  }
};

const saveServices = (services: Service[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  } catch (error) {
    console.error("Error saving services to localStorage:", error);
  }
};

const saveSchedules = (schedules: Schedule[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  } catch (error) {
    console.error("Error saving schedules to localStorage:", error);
  }
};

const saveBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    // Verify it was saved
    const verify = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!verify) {
      console.error("Failed to verify booking save to localStorage");
    }
  } catch (error) {
    console.error("Error saving bookings to localStorage:", error);
    throw error;
  }
};

// Generate available times based on schedule
const generateAvailableTimes = (shopId: string, date: string): string[] => {
  const schedules = getSchedules();
  const schedule = schedules.find((s) => s.shopId === shopId);
  if (!schedule) return [];

  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "lowercase" });
  const daySchedule = schedule.schedule.find((s) => s.day === dayName);

  if (!daySchedule || !daySchedule.enabled) return [];

  const times: string[] = [];
  const [startHour, startMin] = daySchedule.startTime.split(":").map(Number);
  const [endHour, endMin] = daySchedule.endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Get existing bookings for this shop and date
  const bookings = getBookings();
  const bookedTimes = bookings
    .filter((b) => b.shopId === shopId && b.date === date && b.status !== "cancelled")
    .map((b) => b.time);

  // Generate 30-minute slots
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
    
    // Check if time is not booked
    if (!bookedTimes.includes(timeStr)) {
      times.push(timeStr);
    }
  }

  return times;
};

// Mock API implementation
export const mockApi = {
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    // Parse URL - handle both full URLs and relative paths
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      // If URL parsing fails, treat as relative path
      urlObj = new URL(url, "http://mock-api");
    }
    
    const path = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    const method = options?.method || "GET";

    // For mock API, we're more lenient with auth - only require it for write operations
    const user = mockAuth.getCurrentUser();
    const requiresAuth = 
      (path.includes("/bookings") && (method === "POST" || method === "DELETE")) ||
      (path === "/shops" && method === "POST") ||
      (path === "/services" && method === "POST") ||
      (path === "/schedule" && method === "POST");
    
    if (requiresAuth && !user) {
      console.warn("Unauthorized request - no user found");
      return new Response(JSON.stringify({ error: "Unauthorized - Please log in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle shops endpoints
    if (path === "/shops") {
      if (method === "GET") {
        const shopId = searchParams.get("shopId");
        const shops = getShops();
        const shop = shops.find((s) => s.shopId === shopId);
        
        if (shop) {
          return new Response(JSON.stringify(shop), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "Shop not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (method === "POST") {
        const body = JSON.parse(options?.body as string);
        const shops = getShops();
        const existingIndex = shops.findIndex((s) => s.shopId === body.shopId);
        
        if (existingIndex >= 0) {
          shops[existingIndex] = { ...shops[existingIndex], ...body };
        } else {
          shops.push(body);
        }
        
        saveShops(shops);
        return new Response(JSON.stringify({ success: true, shop: body }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Handle services endpoints
    if (path === "/services") {
      if (method === "GET") {
        const shopId = searchParams.get("shopId");
        const services = getServices();
        const shopServices = shopId ? services.filter((s) => s.shopId === shopId) : services;
        
        return new Response(JSON.stringify({ services: shopServices }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else if (method === "POST") {
        const body = JSON.parse(options?.body as string);
        const services = getServices();
        
        // Remove existing services for this shop
        const filteredServices = services.filter((s) => s.shopId !== body.shopId);
        
        // Add new services
        const newServices: Service[] = body.services.map((svc: any, index: number) => ({
          serviceId: `s${Date.now()}-${index}`,
          shopId: body.shopId,
          name: svc.name,
          description: svc.description || "",
          price: svc.price,
          duration: svc.duration,
        }));
        
        saveServices([...filteredServices, ...newServices]);
        return new Response(JSON.stringify({ success: true, services: newServices }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Handle schedule endpoints
    if (path === "/schedule") {
      if (method === "GET") {
        const shopId = searchParams.get("shopId");
        const schedules = getSchedules();
        const schedule = schedules.find((s) => s.shopId === shopId);
        
        if (schedule) {
          return new Response(JSON.stringify(schedule), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "Schedule not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (method === "POST") {
        const body = JSON.parse(options?.body as string);
        const schedules = getSchedules();
        const existingIndex = schedules.findIndex((s) => s.shopId === body.shopId);
        
        if (existingIndex >= 0) {
          schedules[existingIndex] = body;
        } else {
          schedules.push(body);
        }
        
        saveSchedules(schedules);
        return new Response(JSON.stringify({ success: true, schedule: body }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Handle bookings endpoints
    if (path === "/bookings") {
      if (method === "GET") {
        const customerId = searchParams.get("customerId");
        const shopId = searchParams.get("shopId");
        
        try {
          const bookings = getBookings();
          
          let filteredBookings = bookings;
          if (customerId) {
            filteredBookings = filteredBookings.filter((b) => b.customerId === customerId);
          }
          if (shopId) {
            filteredBookings = filteredBookings.filter((b) => b.shopId === shopId);
          }
          
          // Add shop names to bookings
          const shops = getShops();
          const bookingsWithShopNames = filteredBookings.map((booking) => {
            const shop = shops.find((s) => s.shopId === booking.shopId);
            return {
              ...booking,
              shopName: shop?.name || "Unknown Shop",
            };
          });
          
          return new Response(JSON.stringify({ bookings: bookingsWithShopNames }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error fetching bookings:", error);
          return new Response(JSON.stringify({ bookings: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (method === "POST") {
        try {
          // Parse request body
          let body: any;
          if (typeof options?.body === "string") {
            try {
              body = JSON.parse(options.body);
            } catch (parseError) {
              console.error("Failed to parse request body:", parseError);
              return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
          } else {
            body = options?.body;
          }
          
          console.log("Creating booking with data:", body);
          
          // Validate required fields
          if (!body) {
            return new Response(JSON.stringify({ error: "Request body is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          if (!body.shopId || !body.customerId || !body.serviceName || !body.date || !body.time) {
            const missing = [];
            if (!body.shopId) missing.push("shopId");
            if (!body.customerId) missing.push("customerId");
            if (!body.serviceName) missing.push("serviceName");
            if (!body.date) missing.push("date");
            if (!body.time) missing.push("time");
            
            console.error("Missing required fields:", missing);
            return new Response(JSON.stringify({ 
              error: `Missing required fields: ${missing.join(", ")}` 
            }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          // Get existing bookings
          const bookings = getBookings();
          console.log("Current bookings count:", bookings.length);
          
          // Create new booking
          const newBooking: Booking = {
            bookingId: `b${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            shopId: String(body.shopId),
            customerId: String(body.customerId),
            serviceName: String(body.serviceName),
            date: String(body.date),
            time: String(body.time),
            status: "pending",
            price: Number(body.price) || 0,
            duration: Number(body.duration) || 30,
          };
          
          console.log("New booking created:", newBooking);
          
          // Add to array and save
          bookings.push(newBooking);
          saveBookings(bookings);
          
          // Verify it was saved
          const savedBookings = getBookings();
          const savedBooking = savedBookings.find(b => b.bookingId === newBooking.bookingId);
          
          if (!savedBooking) {
            console.error("Failed to save booking to localStorage - booking not found after save");
            return new Response(JSON.stringify({ error: "Failed to save booking to storage" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          console.log("Booking saved successfully:", savedBooking);
          
          // Dispatch custom event to notify components of booking update
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("bookingUpdated", { detail: newBooking }));
          }
          
          return new Response(JSON.stringify({ success: true, booking: newBooking }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error creating booking:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return new Response(JSON.stringify({ 
            error: `Failed to create booking: ${errorMessage}`,
            details: error instanceof Error ? error.stack : undefined
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    // Handle booking by ID (for DELETE)
    if (path.startsWith("/bookings/") && method === "DELETE") {
      try {
        const bookingId = path.split("/")[2];
        if (!bookingId) {
          return new Response(JSON.stringify({ error: "Booking ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        
        const bookings = getBookings();
        const bookingIndex = bookings.findIndex((b) => b.bookingId === bookingId);
        
        if (bookingIndex >= 0) {
          bookings[bookingIndex].status = "cancelled";
          saveBookings(bookings);
          
          // Verify it was saved
          const savedBookings = getBookings();
          const savedBooking = savedBookings.find(b => b.bookingId === bookingId);
          if (savedBooking && savedBooking.status === "cancelled") {
            // Dispatch custom event to notify components of booking update
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("bookingUpdated", { detail: savedBooking }));
            }
            
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          } else {
            console.error("Failed to verify booking cancellation");
            return new Response(JSON.stringify({ error: "Failed to cancel booking" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
        } else {
          return new Response(JSON.stringify({ error: "Booking not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        return new Response(JSON.stringify({ error: "Failed to cancel booking: " + (error instanceof Error ? error.message : String(error)) }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Handle available times
    if (path === "/bookings/available-times") {
      const shopId = searchParams.get("shopId");
      const date = searchParams.get("date");
      
      if (!shopId || !date) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      const times = generateAvailableTimes(shopId, date);
      return new Response(JSON.stringify({ times }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default 404
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};

// Helper to check if we should use mock API
export const shouldUseMockApi = (): boolean => {
  const apiUrl = import.meta.env.VITE_API_URL;
  // Always use mock API if no backend URL is configured
  return !apiUrl || apiUrl.trim() === "";
};

// Wrapper function that uses mock API when backend is not available
export const apiFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  // Always use mock API for now since there's no backend
  // This ensures all data operations go through localStorage
  return mockApi.fetch(url, options);
};

