import React, { useState } from "react";
import "./SetupProfile.css";

function SetupProfile({ auth }) {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    shopName: "",
    shopAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = auth?.user?.id_token; // from cognito auth
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/auth/profileSetup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: auth?.user?.profile?.sub,
            role,
            ...formData,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h2 className="setup-title">Setup Your Profile</h2>
        <p className="setup-subtitle">Complete your profile to continue</p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="role-section">
            <label className="role-label">Select Your Role</label>
            <div className="role-options">
              <button
                type="button"
                className={`role-btn ${role === "Barber" ? "active" : ""}`}
                onClick={() => setRole("Barber")}
              >
                💈 Barber
              </button>
              <button
                type="button"
                className={`role-btn ${role === "Customer" ? "active" : ""}`}
                onClick={() => setRole("Customer")}
              >
                👤 Customer
              </button>
            </div>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {role === "Barber" && (
            <>
              <input
                type="text"
                name="shopName"
                placeholder="Shop Name"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
              <textarea
                name="shopAddress"
                placeholder="Shop Address"
                value={formData.shopAddress}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" disabled={loading || !role}>
            {loading ? "Saving..." : "Save Profile"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default SetupProfile;
