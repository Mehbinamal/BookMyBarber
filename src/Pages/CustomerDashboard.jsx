import React, { useState, useEffect } from 'react';
import './CustomerDashboard.css';

// Dummy barber data
const dummyBarbers = [
  {
    id: 1,
    name: "Marcus Johnson",
    specialty: "Classic Cuts & Beard Styling",
    rating: 4.9,
    reviews: 127,
    experience: "8 years",
    location: "Downtown Barber Shop",
    address: "123 Main St, Downtown",
    price: "$35",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    services: ["Haircut", "Beard Trim", "Mustache", "Hair Wash"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Professional barber with 8 years of experience specializing in classic cuts and modern beard styling."
  },
  {
    id: 2,
    name: "Sarah Martinez",
    specialty: "Modern Styles & Color",
    rating: 4.8,
    reviews: 89,
    experience: "6 years",
    location: "Style Studio",
    address: "456 Oak Ave, Midtown",
    price: "$45",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    services: ["Haircut", "Hair Color", "Styling", "Consultation"],
    availability: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Creative stylist passionate about modern haircuts and personalized color treatments."
  },
  {
    id: 3,
    name: "David Chen",
    specialty: "Precision Cuts & Fades",
    rating: 4.9,
    reviews: 156,
    experience: "10 years",
    location: "Elite Barbershop",
    address: "789 Pine St, Uptown",
    price: "$40",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    services: ["Haircut", "Fade", "Beard Trim", "Hot Towel"],
    availability: ["Mon", "Wed", "Thu", "Fri", "Sat"],
    bio: "Master barber specializing in precision cuts and perfect fades with attention to detail."
  },
  {
    id: 4,
    name: "Alex Thompson",
    specialty: "Vintage & Retro Styles",
    rating: 4.7,
    reviews: 73,
    experience: "5 years",
    location: "Retro Cuts",
    address: "321 Elm St, Old Town",
    price: "$30",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    services: ["Haircut", "Mustache", "Sideburns", "Hair Wash"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Specialist in vintage and retro hairstyles, bringing classic looks to modern times."
  },
  {
    id: 5,
    name: "Maria Rodriguez",
    specialty: "Men's Grooming & Styling",
    rating: 4.8,
    reviews: 94,
    experience: "7 years",
    location: "Gentleman's Grooming",
    address: "654 Maple Dr, Westside",
    price: "$50",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    services: ["Haircut", "Beard Trim", "Facial", "Eyebrow"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Complete men's grooming specialist offering premium services and personalized care."
  },
  {
    id: 6,
    name: "James Wilson",
    specialty: "Quick Cuts & Express Service",
    rating: 4.6,
    reviews: 112,
    experience: "4 years",
    location: "Express Barbers",
    address: "987 Cedar Ln, Eastside",
    price: "$25",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    services: ["Haircut", "Beard Trim", "Quick Style"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Fast and efficient barber perfect for busy professionals who need quality cuts in less time."
  }
];

// Dummy appointments data
const dummyAppointments = [
  {
    id: 1,
    barberName: "Marcus Johnson",
    service: "Haircut & Beard Trim",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "confirmed",
    price: "$35"
  },
  {
    id: 2,
    barberName: "Sarah Martinez",
    service: "Haircut & Styling",
    date: "2024-01-20",
    time: "2:00 PM",
    status: "pending",
    price: "$45"
  }
];

function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredBarbers, setFilteredBarbers] = useState(dummyBarbers);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointments] = useState(dummyAppointments);

  const services = ["Haircut", "Beard Trim", "Fade", "Hair Color", "Styling", "Mustache", "Facial"];
  const locations = ["Downtown", "Midtown", "Uptown", "Old Town", "Westside", "Eastside"];

  useEffect(() => {
    filterBarbers();
  }, [searchTerm, selectedService, selectedLocation]);

  const filterBarbers = () => {
    let filtered = dummyBarbers;

    if (searchTerm) {
      filtered = filtered.filter(barber =>
        barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedService) {
      filtered = filtered.filter(barber =>
        barber.services.some(service =>
          service.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(barber =>
        barber.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredBarbers(filtered);
  };

  const handleBookAppointment = (barber) => {
    setSelectedBarber(barber);
    setShowBookingModal(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Welcome to BookMyBarber</h1>
            <p>Find and book your perfect barber</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <span>Customer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <h2>Find Your Barber</h2>
            <div className="search-filters">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="filter-select"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Upcoming Appointments */}
        <section className="appointments-section">
          <h2>Your Appointments</h2>
          <div className="appointments-grid">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{appointment.barberName}</h3>
                  <span className={`status ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <p><strong>Service:</strong> {appointment.service}</p>
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Price:</strong> {appointment.price}</p>
                </div>
                <div className="appointment-actions">
                  <button className="btn-secondary">Reschedule</button>
                  <button className="btn-danger">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Barber Results */}
        <section className="barbers-section">
          <h2>Available Barbers ({filteredBarbers.length})</h2>
          <div className="barbers-grid">
            {filteredBarbers.map(barber => (
              <div key={barber.id} className="barber-card">
                <div className="barber-image">
                  <img src={barber.image} alt={barber.name} />
                  <div className="barber-rating">
                    {renderStars(barber.rating)}
                    <span className="rating-text">{barber.rating}</span>
                  </div>
                </div>
                
                <div className="barber-info">
                  <h3>{barber.name}</h3>
                  <p className="specialty">{barber.specialty}</p>
                  <p className="location">📍 {barber.location}</p>
                  <p className="address">{barber.address}</p>
                  
                  <div className="barber-stats">
                    <span className="stat">
                      <strong>{barber.reviews}</strong> reviews
                    </span>
                    <span className="stat">
                      <strong>{barber.experience}</strong> experience
                    </span>
                  </div>

                  <div className="services">
                    {barber.services.map(service => (
                      <span key={service} className="service-tag">{service}</span>
                    ))}
                  </div>

                  <div className="availability">
                    <strong>Available:</strong> {barber.availability.join(", ")}
                  </div>

                  <div className="barber-footer">
                    <div className="price">{barber.price}</div>
                    <button 
                      className="btn-primary"
                      onClick={() => handleBookAppointment(barber)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <h2>Book Appointment with {selectedBarber?.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="barber-summary">
                <img src={selectedBarber?.image} alt={selectedBarber?.name} />
                <div>
                  <h3>{selectedBarber?.name}</h3>
                  <p>{selectedBarber?.specialty}</p>
                  <p>📍 {selectedBarber?.location}</p>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Select Service</label>
                  <select className="form-input">
                    {selectedBarber?.services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Date</label>
                  <input type="date" className="form-input" />
                </div>

                <div className="form-group">
                  <label>Select Time</label>
                  <select className="form-input">
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea 
                    className="form-input"
                    placeholder="Any special requests or notes..."
                    rows="3"
                  />
                </div>

                <div className="booking-summary">
                  <h4>Booking Summary</h4>
                  <div className="summary-item">
                    <span>Service:</span>
                    <span>{selectedBarber?.services[0]}</span>
                  </div>
                  <div className="summary-item">
                    <span>Price:</span>
                    <span>{selectedBarber?.price}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;