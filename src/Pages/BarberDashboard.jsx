import React, { useState, useEffect } from 'react';
import './BarberDashboard.css';

// Dummy appointments data for barber
const dummyAppointments = [
  {
    id: 1,
    customerName: "John Smith",
    customerPhone: "(555) 123-4567",
    service: "Haircut & Beard Trim",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "45 min",
    status: "confirmed",
    price: "$35",
    notes: "Prefers shorter on sides"
  },
  {
    id: 2,
    customerName: "Mike Johnson",
    customerPhone: "(555) 234-5678",
    service: "Fade",
    date: "2024-01-15",
    time: "11:30 AM",
    duration: "30 min",
    status: "confirmed",
    price: "$25",
    notes: "Regular customer"
  },
  {
    id: 3,
    customerName: "David Wilson",
    customerPhone: "(555) 345-6789",
    service: "Haircut & Styling",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: "60 min",
    status: "pending",
    price: "$40",
    notes: "First time customer"
  },
  {
    id: 4,
    customerName: "Robert Brown",
    customerPhone: "(555) 456-7890",
    service: "Beard Trim",
    date: "2024-01-16",
    time: "9:00 AM",
    duration: "20 min",
    status: "confirmed",
    price: "$15",
    notes: "Just beard trim"
  },
  {
    id: 5,
    customerName: "James Davis",
    customerPhone: "(555) 567-8901",
    service: "Haircut",
    date: "2024-01-16",
    time: "1:00 PM",
    duration: "30 min",
    status: "pending",
    price: "$30",
    notes: ""
  }
];

// Dummy earnings data
const earningsData = {
  today: 95,
  thisWeek: 450,
  thisMonth: 1850,
  totalCustomers: 127
};

function BarberDashboard() {
  const [appointments, setAppointments] = useState(dummyAppointments);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    customerName: '',
    customerPhone: '',
    service: '',
    time: '',
    duration: '30',
    price: '',
    notes: ''
  });

  const services = [
    "Haircut", "Beard Trim", "Fade", "Mustache", "Hair Wash", 
    "Styling", "Hair Color", "Facial", "Eyebrow", "Hot Towel"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  const filteredAppointments = appointments.filter(appointment => 
    appointment.date === selectedDate
  );

  const handleAddAppointment = () => {
    if (newAppointment.customerName && newAppointment.service && newAppointment.time) {
      const appointment = {
        id: appointments.length + 1,
        ...newAppointment,
        date: selectedDate,
        status: 'pending',
        price: newAppointment.price || '$30'
      };
      setAppointments([...appointments, appointment]);
      setNewAppointment({
        customerName: '',
        customerPhone: '',
        service: '',
        time: '',
        duration: '30',
        price: '',
        notes: ''
      });
      setShowAddAppointment(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '⭕';
    }
  };

  return (
    <div className="barber-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Barber Dashboard</h1>
            <p>Manage your appointments and track your business</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">✂️</div>
              <span>Barber</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Today's Earnings</h3>
                <p className="stat-value">${earningsData.today}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Today's Appointments</h3>
                <p className="stat-value">{filteredAppointments.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Customers</h3>
                <p className="stat-value">{earningsData.totalCustomers}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Rating</h3>
                <p className="stat-value">4.9</p>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="controls-section">
          <div className="controls-container">
            <div className="date-controls">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <div className="view-toggle">
                <button 
                  className={viewMode === 'day' ? 'active' : ''}
                  onClick={() => setViewMode('day')}
                >
                  Day
                </button>
                <button 
                  className={viewMode === 'week' ? 'active' : ''}
                  onClick={() => setViewMode('week')}
                >
                  Week
                </button>
                <button 
                  className={viewMode === 'month' ? 'active' : ''}
                  onClick={() => setViewMode('month')}
                >
                  Month
                </button>
              </div>
            </div>
            <div className="action-buttons">
              <button 
                className="btn-primary"
                onClick={() => setShowAddAppointment(true)}
              >
                + Add Appointment
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowEarningsModal(true)}
              >
                View Earnings
              </button>
            </div>
          </div>
        </section>

        {/* Appointments */}
        <section className="appointments-section">
          <h2>Appointments for {new Date(selectedDate).toLocaleDateString()}</h2>
          <div className="appointments-list">
            {filteredAppointments.length === 0 ? (
              <div className="no-appointments">
                <div className="no-appointments-icon">📅</div>
                <h3>No appointments scheduled</h3>
                <p>Add a new appointment to get started</p>
              </div>
            ) : (
              filteredAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-time">
                    <span className="time">{appointment.time}</span>
                    <span className="duration">{appointment.duration}</span>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="customer-info">
                      <h3>{appointment.customerName}</h3>
                      <p>{appointment.customerPhone}</p>
                    </div>
                    <div className="service-info">
                      <p className="service">{appointment.service}</p>
                      <p className="price">{appointment.price}</p>
                    </div>
                    {appointment.notes && (
                      <div className="notes">
                        <p><strong>Notes:</strong> {appointment.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="appointment-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {getStatusIcon(appointment.status)} {appointment.status}
                    </span>
                  </div>

                  <div className="appointment-actions">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      className="btn-danger small"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Schedule Overview */}
        <section className="schedule-section">
          <h2>Schedule Overview</h2>
          <div className="schedule-grid">
            {timeSlots.map(timeSlot => {
              const appointment = filteredAppointments.find(apt => apt.time === timeSlot);
              return (
                <div key={timeSlot} className={`time-slot ${appointment ? 'booked' : 'available'}`}>
                  <span className="time">{timeSlot}</span>
                  {appointment ? (
                    <div className="appointment-preview">
                      <span className="customer">{appointment.customerName}</span>
                      <span className="service">{appointment.service}</span>
                    </div>
                  ) : (
                    <span className="available-text">Available</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <div className="modal-overlay">
          <div className="appointment-modal">
            <div className="modal-header">
              <h2>Add New Appointment</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddAppointment(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={newAppointment.customerName}
                    onChange={(e) => setNewAppointment({...newAppointment, customerName: e.target.value})}
                    className="form-input"
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={newAppointment.customerPhone}
                    onChange={(e) => setNewAppointment({...newAppointment, customerPhone: e.target.value})}
                    className="form-input"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label>Service</label>
                  <select
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
                    className="form-input"
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    value={newAppointment.price}
                    onChange={(e) => setNewAppointment({...newAppointment, price: e.target.value})}
                    className="form-input"
                    placeholder="$30"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="form-input"
                  placeholder="Any special notes or requests..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowAddAppointment(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleAddAppointment}
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Modal */}
      {showEarningsModal && (
        <div className="modal-overlay">
          <div className="earnings-modal">
            <div className="modal-header">
              <h2>Earnings Report</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEarningsModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="earnings-grid">
                <div className="earnings-item">
                  <h3>Today</h3>
                  <p className="earnings-amount">${earningsData.today}</p>
                </div>
                <div className="earnings-item">
                  <h3>This Week</h3>
                  <p className="earnings-amount">${earningsData.thisWeek}</p>
                </div>
                <div className="earnings-item">
                  <h3>This Month</h3>
                  <p className="earnings-amount">${earningsData.thisMonth}</p>
                </div>
                <div className="earnings-item">
                  <h3>Total Customers</h3>
                  <p className="earnings-amount">{earningsData.totalCustomers}</p>
                </div>
              </div>
              
              <div className="earnings-chart">
                <h3>Weekly Breakdown</h3>
                <div className="chart-bars">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="chart-bar">
                      <div 
                        className="bar"
                        style={{ height: `${Math.random() * 100}%` }}
                      ></div>
                      <span className="day">{day}</span>
                      <span className="amount">${Math.floor(Math.random() * 200) + 50}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarberDashboard;