import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import Header from "../components/Header";
import "../styles/ActivitiesRegistration.css";

export default function ActivitiesRegistrationPage({ admin = false }) {
  // Student Registration Form
  const [registrationType, setRegistrationType] = useState("individual");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const AVAILABLE_ACTIVITIES = [
    "Basketball",
    "Volleyball",
    "Badminton",
    "Chess",
    "Athletics"
  ];

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get("/activity-registrations");
      setRegistrations(response.data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    if (!registrationType) {
      alert("Please select registration type");
      return false;
    }
    if (!fullName.trim()) {
      alert("Please enter full name");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter valid email");
      return false;
    }
    if (!schoolId.trim()) {
      alert("Please enter school ID");
      return false;
    }
    if (!selectedActivity) {
      alert("Please select an activity");
      return false;
    }
    return true;
  };

  // Handle student registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await api.post("/activity-registrations", {
        registration_type: registrationType,
        name: fullName,
        email: email,
        school_id: schoolId,
        activity_option: selectedActivity,
        status: "Pending"
      });

      alert("Activity registration submitted successfully!");
      resetForm();
      fetchRegistrations();
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.error || "Error submitting registration");
    }
  };

  const resetForm = () => {
    setRegistrationType("individual");
    setFullName("");
    setEmail("");
    setSchoolId("");
    setSelectedActivity("");
  };

  // Admin actions
  const handleApprove = async (id) => {
    try {
      await api.put(`/activity-registrations/${id}`, { status: "Approved" });
      alert("Registration approved");
      fetchRegistrations();
    } catch (err) {
      alert("Error approving registration");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/activity-registrations/${id}`, { status: "Rejected" });
      alert("Registration rejected");
      fetchRegistrations();
    } catch (err) {
      alert("Error rejecting registration");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await api.delete(`/activity-registrations/${id}`);
        alert("Registration deleted");
        fetchRegistrations();
      } catch (err) {
        alert("Error deleting registration");
      }
    }
  };

  // Filter registrations based on search
  const filteredRegistrations = registrations.filter(reg =>
    reg.school_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get student's own registrations (non-admin)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const studentRegistrations = registrations.filter(reg => reg.email === user?.email);
  const recentStudentRegistrations = studentRegistrations.slice(0, 5); // Show last 5

  if (admin) {
    return (
      <div className="admin-registration-container">
        <Header />
        <h2>Activities Registration Management</h2>
        
        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by School ID or Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Registrations Table */}
        <div className="table-container">
          <table className="registrations-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Activity</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.school_id}</td>
                    <td>{reg.name}</td>
                    <td>{reg.email}</td>
                    <td>{reg.activity_option}</td>
                    <td>{reg.registration_type}</td>
                    <td>{new Date(reg.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${reg.status?.toLowerCase()}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="actions">
                      {reg.status === "Pending" && (
                        <>
                          <button
                            className="btn-icon approve"
                            onClick={() => handleApprove(reg.id)}
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            className="btn-icon reject"
                            onClick={() => handleReject(reg.id)}
                            title="Reject"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(reg.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No registrations found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Student Registration Form
  return (
    <div className="activities-registration-container">
      <Header />
      <h2>Activities Registration</h2>
      <p className="subtitle">Register for school activities as an individual or team</p>

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Registration Type */}
        <div className="form-group">
          <label htmlFor="registrationType">Registration Type *</label>
          <select
            id="registrationType"
            value={registrationType}
            onChange={(e) => setRegistrationType(e.target.value)}
            className="form-control"
          >
            <option value="individual">Individual Registration</option>
            <option value="team">Team Registration</option>
          </select>
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">
            {registrationType === "team" ? "Team Representative Name" : "Full Name"} *
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>

        {/* School ID */}
        <div className="form-group">
          <label htmlFor="schoolId">School ID *</label>
          <input
            id="schoolId"
            type="text"
            placeholder="Enter your school ID number"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Activity Option */}
        <div className="form-group">
          <label htmlFor="activity">Activity Option *</label>
          <select
            id="activity"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="form-control"
          >
            <option value="">-- Select an Activity --</option>
            {AVAILABLE_ACTIVITIES.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary btn-lg">
          Submit Registration
        </button>
      </form>

      {/* Confirmation Message */}
      <div className="info-section">
        <h4>Registration Information</h4>
        <ul>
          <li>Your registration will be reviewed by the admin</li>
          <li>Status will be updated to Approved or Rejected</li>
          <li>Check back here to see your registration status</li>
        </ul>
      </div>

      {/* Student's Recent Registrations */}
      {recentStudentRegistrations.length > 0 && (
        <div className="recent-registrations-section">
          <h4>Your Recent Registrations</h4>
          <div className="registrations-grid">
            {recentStudentRegistrations.map((reg) => (
              <div key={reg.id} className="registration-card">
                <div className="card-header">
                  <h5>{reg.activity_option}</h5>
                  <span className={`status-badge ${reg.status?.toLowerCase()}`}>
                    {reg.status}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Type:</strong> {reg.registration_type}</p>
                  <p><strong>Date:</strong> {new Date(reg.created_at).toLocaleDateString()}</p>
                  <p><strong>School ID:</strong> {reg.school_id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
