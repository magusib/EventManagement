import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import "../styles/RegistrationPage.css";

export default function RegistrationPage({ admin }) {
  if (admin) {
    return <AdminRegistrationDashboard />;
  }
  return <StudentRegistrationDashboard />;
}

// Student Registration Dashboard with Split Screen
function StudentRegistrationDashboard() {
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [clubForm, setClubForm] = useState({
    name: "",
    email: "",
    studentid: "",
    club_option: "",
    club_id: "",
  });
  const [activityForm, setActivityForm] = useState({
    name: "",
    email: "",
    studentid: "",
    registration_type: "",
    activity_option: "",
  });
  const [clubMessage, setClubMessage] = useState("");
  const [activityMessage, setActivityMessage] = useState("");
  const [clubError, setClubError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  const individualActivities = [
    "Chess Tournament",
    "Table Tennis",
    "Badminton",
    "Athletics",
    "Mr LCUAA",
    "Ms LCUAA",
    "Basketball Game",
    "Mens Volleyball Game",
    "Women Volleyball Game"

  ];
  const teamActivities = [
    "Esport Tournament",
    "Basketball Game",
    "Volleyball Game",
    "Badminton Double",
    "Table Tennis Double",
    "CheerDance"

  ];

  useEffect(() => {
    fetchClubs();
    fetchRecentRegistrations();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoadingClubs(true);
      // Use the same endpoint as the clubs page
      const response = await api.get("/clubs");
      // Extract id and name from clubs (same data source as clubs page)
      const clubsList = (response.data || []).map(club => ({
        id: club.id,
        name: club.name
      }));
      setClubs(clubsList);
    } catch (err) {
      console.error("Error fetching clubs:", err);
      setClubs([]);
    } finally {
      setLoadingClubs(false);
    }
  };

  const fetchRecentRegistrations = async () => {
    try {
      const response = await api.get("/registrations/recent");
      const sorted = (response.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentRegistrations(sorted);
    } catch (err) {
      console.error("Error fetching recent registrations:", err);
    }
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setClubMessage("");
    setClubError("");
    // Validation
    if (!clubForm.name.trim() || !clubForm.email.trim() || !clubForm.studentid.trim() || !clubForm.club_option.trim() || !clubForm.club_id) {
      setClubError("");
      setClubMessage("");
      window.alert("All fields are required.");
      return;
    }
    if (!/^([A-Za-z]+\s?)+$/.test(clubForm.name.trim())) {
      setClubError("");
      setClubMessage("");
      window.alert("Invalid name format. Use letters and spaces only.");
      return;
    }
    if (!clubForm.email.match(/^\S+@paterostechnologicalcollege\.edu\.ph$/)) {
      setClubError("");
      setClubMessage("");
      window.alert("Invalid institutional email format.");
      return;
    }
    if (!clubForm.studentid.match(/^[0-9]{2}[A-Z]{4}-[0-9]{4}$/)) {
      setClubError("");
      setClubMessage("");
      window.alert("Invalid Student ID. Format: 23BSIT-0001");
      return;
    }
    // Only validate input format and required fields. No strict user info match check.
    try {
      await api.post("/registrations/club", clubForm);
      setClubMessage("");
      setClubError("");
      window.alert("Club registration submitted successfully!");
      setClubForm({ name: "", email: "", studentid: "", club_option: "", club_id: "" });
      await fetchRecentRegistrations();
    } catch (err) {
      setClubError("");
      setClubMessage("");
      window.alert(err.response?.data?.error || "Failed to submit registration");
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setActivityMessage("");
    setActivityError("");
    // Validation
    if (!activityForm.name.trim() || !activityForm.email.trim() || !activityForm.studentid.trim() || !activityForm.registration_type.trim() || !activityForm.activity_option.trim()) {
      setActivityError("");
      setActivityMessage("");
      window.alert("All fields are required.");
      return;
    }
    if (!/^([A-Za-z]+\s?)+$/.test(activityForm.name.trim())) {
      setActivityError("");
      setActivityMessage("");
      window.alert("Invalid name format. Use letters and spaces only.");
      return;
    }
    if (!activityForm.email.match(/^\S+@paterostechnologicalcollege\.edu\.ph$/)) {
      setActivityError("");
      setActivityMessage("");
      window.alert("Invalid institutional email format.");
      return;
    }
    if (!activityForm.studentid.match(/^[0-9]{2}[A-Z]{4}-[0-9]{4}$/)) {
      setActivityError("");
      setActivityMessage("");
      window.alert("Invalid Student ID. Format: 23BSIT-0001");
      return;
    }
    // Only validate input format and required fields. No strict user info match check.
    try {
      await api.post("/registrations/activity", activityForm);
      setActivityMessage("");
      setActivityError("");
      window.alert("Activity registration submitted successfully!");
      setActivityForm({ name: "", email: "", studentid: "", registration_type: "individual", activity_option: "" });
      await fetchRecentRegistrations();
    } catch (err) {
      setActivityError("");
      setActivityMessage("");
      window.alert(err.response?.data?.error || "Failed to submit registration");
    }
  };

  return (
    <div className="registration-page-container">
      <div className="events-header-left">
        <i className="fa-regular fa-address-card"></i>
        <span className="events-title">Registration</span>
      </div>
      {/* Split Screen Layout */}
      <div className="split-screen-dashboard">
        {/* Club Registration Panel */}
        <div className="split-panel club-panel">
          <h3 className="panel-title">Club Registration</h3>
          <form className="register-form" onSubmit={handleClubSubmit}>
            <label>Name</label>
            <input
              type="text"
              value={clubForm.name}
              onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
              required
            />
            
            <label>Email</label>
            <input
              type="email"
              value={clubForm.email}
              onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
              required
            />
            
            <label>Student ID</label>
            <input
              type="text"
              value={clubForm.studentid}
              onChange={(e) => setClubForm({ ...clubForm, studentid: e.target.value })}
              required
            />
            
            <label>Select Club</label>
            {loadingClubs ? (
              <div className="clubs-loading">Loading clubs...</div>
            ) : clubs.length === 0 ? (
              <div className="clubs-empty">No clubs available. Please contact admin to add clubs.</div>
            ) : (
              <select
                value={clubForm.club_id}
                onChange={(e) => {
                  const selectedClub = clubs.find(club => club.id.toString() === e.target.value);
                  setClubForm({
                    ...clubForm,
                    club_id: e.target.value,
                    club_option: selectedClub ? selectedClub.name : ""
                  });
                }}
                required
              >
                <option value="">Choose a club...</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            )}
            
            <button type="submit" className="register-btn">Register for Club</button>
            {clubError && <div className="error-msg">{clubError}</div>}
            {clubMessage && <div className="msg">{clubMessage}</div>}
          </form>
        </div>

        {/* Activities Registration Panel */}
        <div className="split-panel activity-panel">
          <h3 className="panel-title">Activities Registration</h3>
          <form className="register-form" onSubmit={handleActivitySubmit}>
            <label>Name</label>
            <input
              type="text"
              value={activityForm.name}
              onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
              required
            />
            
            <label>Email</label>
            <input
              type="email"
              value={activityForm.email}
              onChange={(e) => setActivityForm({ ...activityForm, email: e.target.value })}
              required
            />
            
            <label>Student ID</label>
            <input
              type="text"
              value={activityForm.studentid}
              onChange={(e) => setActivityForm({ ...activityForm, studentid: e.target.value })}
              required
            />
            
            <label>Registration Type</label>
            <select
              value={activityForm.registration_type}
              onChange={(e) => setActivityForm({ ...activityForm, registration_type: e.target.value })}
              required
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
            
            <label>Sports Activity</label>
            <select
              value={activityForm.activity_option}
              onChange={(e) => setActivityForm({ ...activityForm, activity_option: e.target.value })}
              required
            >
              <option value="">Choose an activity...</option>
              {(activityForm.registration_type === "individual"
                ? individualActivities
                : teamActivities
              ).map((activity, idx) => (
                <option key={idx} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
            
            <button type="submit" className="register-btn">Register for Activity</button>
            {activityError && <div className="error-msg">{activityError}</div>}
            {activityMessage && <div className="msg">{activityMessage}</div>}
          </form>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="recent-registrations-panel">
        <h3 className="panel-title recent-title">Recent Registrations</h3>
        {recentRegistrations.length === 0 ? (
          <p className="registrations-empty">No recent registrations</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name/Activity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations
                .filter(reg => reg.studentid === user?.studentid)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(reg => (
                  <tr key={reg.id}>
                    <td>{reg.type}</td>
                    <td>{reg.name}</td>
                    <td>
                      <span className={`status-badge status-${reg.status?.toLowerCase()}`}>{reg.status}</span>
                    </td>
                    <td>{new Date(reg.date).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Admin Registration Dashboard
function AdminRegistrationDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchRegistrations();
  }, [search, typeFilter, statusFilter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get(`/registrations?${params.toString()}`);
      setRegistrations(response.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, type) => {
    try {
      await api.put(`/registrations/${id}/approve`, { type });
      window.alert("Registration approved successfully!");
      fetchRegistrations();
    } catch (err) {
      console.error("Error approving registration:", err);
      window.alert(err.response?.data?.error || "Failed to approve registration");
    }
  };

  const handleReject = async (id, type) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) {
      return;
    }
    try {
      await api.put(`/registrations/${id}/reject`, { type });
      window.alert("Registration rejected.");
      fetchRegistrations();
    } catch (err) {
      console.error("Error rejecting registration:", err);
      window.alert(err.response?.data?.error || "Failed to reject registration");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this registration? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/registrations/${id}?type=${type}`);
      window.alert("Registration deleted.");
      setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
    } catch (err) {
      console.error("Error deleting registration:", err);
      window.alert(err.response?.data?.error || "Failed to delete registration");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="events-header-left">
        <i className="fa-regular fa-address-card"></i>
        <span className="events-title">Manage Registration</span>
      </div>
      {/* Search and Sort Controls */}
      <div className="dashboard-controls">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <i className="fa fa-search"></i>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or student ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select
          className="sort-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Club">Club</option>
          <option value="Activities">Activities</option>
        </select>
        <select
          className="sort-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Registrations Table */}
      <div className="dashboard-table-wrapper">
        {loading ? (
          <p className="registrations-loading">Loading...</p>
        ) : registrations.length === 0 ? (
          <p className="registrations-empty">No registrations found</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>School ID</th>
                <th>Activity/Club</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={`${reg.registration_type}-${reg.id}`}>
                  <td>{reg.name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.schoolid}</td>
                  <td>{reg.activity_club}</td>
                  <td>{new Date(reg.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${reg.status?.toLowerCase()}`}>{reg.status}</span>
                  </td>
                  <td>
                    {/* Approve Button */}
                    {reg.status !== "Approved" && (
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(reg.id, reg.registration_type)}
                        title="Approve"
                      >
                        <i className="fa fa-check"></i>
                      </button>
                    )}
                    {/* Reject Button */}
                    {reg.status !== "Rejected" && (
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleReject(reg.id, reg.registration_type)}
                        title="Reject"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    )}
                    {/* Delete Button */}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(reg.id, reg.registration_type)}
                      title="Delete"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

