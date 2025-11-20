import React, { useState, useEffect } from "react";
import ClubModal from "../components/ClubModal";
import api from "../axiosConfig";

export default function RegistrationModule({ admin = false }) {
  // Get user
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Common state
  const [clubs, setClubs] = useState([]);
  const [clubModalOpen, setClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("date");

  // Activities registration form state
  const [activityForm, setActivityForm] = useState({
    option: "Individual",
    name: "",
    email: "",
    schoolId: "",
    activity: "Basketball"
  });
  const [activityLoading, setActivityLoading] = useState(false);

  // Club registration form state
  const [clubForm, setClubForm] = useState({
    clubId: "",
    name: "",
    email: "",
    studentId: ""
  });

  // Club registration submit handler
  const handleClubRegister = async (clubId) => {
    try {
      await api.post("/club-registration", {
        club_id: clubId,
        name: clubForm.name,
        email: clubForm.email,
        studentId: clubForm.studentId,
        user_id: user?.id
      });
      alert("Club registration submitted!");
      setClubForm({ clubId: "", name: user?.fullname || "", email: user?.email || "", studentId: user?.schoolId || "" });
      await loadRegistrations();
    } catch (err) {
      alert("Error registering for club");
    }
  };

  useEffect(() => {
    loadClubs();
    loadRegistrations();
  }, []);

  const loadClubs = async () => {
    try {
      const res = await api.get("/clubs");
      setClubs(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadRegistrations = async () => {
    try {
      const res = await api.get("/registrations");
      setRegistrations(res.data || []);
    } catch (err) { console.error(err); }
  };

  // Student: submit activities registration
  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setActivityLoading(true);
    try {
      await api.post("/activities-registration", activityForm);
      alert("Registration submitted!");
      setActivityForm({ option: "Individual", name: "", email: "", schoolId: "", activity: "Basketball" });
      await loadRegistrations();
    } catch (err) {
      alert("Error submitting registration");
    } finally {
      setActivityLoading(false);
    }
  };

  // (removed duplicate handleClubRegister)

  // Student: recent registrations
  const recentRegs = registrations.filter(r => r.user_id === user?.id).slice(0, 5);

  // Admin: filtered registrations
  let filteredRegs = registrations;
  if (search) {
    filteredRegs = filteredRegs.filter(r =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.schoolId?.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (typeFilter !== "All Types") {
    filteredRegs = filteredRegs.filter(r => r.type === typeFilter);
  }
  if (statusFilter !== "All Status") {
    filteredRegs = filteredRegs.filter(r => r.status === statusFilter);
  }
  if (sortBy === "date") {
    filteredRegs = filteredRegs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Split-screen layout for students
  if (!admin) {
    return (
      <div className="registration-cards-layout">
        <div className="registration-cards-row" style={{ display: 'flex', gap: '24px' }}>
          <div className="registration-card" style={{ flex: 1 }}>
            <h3>Club Registration</h3>
            <form onSubmit={e => {
              e.preventDefault();
              handleClubRegister(clubForm.clubId);
            }} className="club-registration-form">
              <label>Select Club</label>
              <select value={clubForm.clubId} onChange={e => setClubForm({ ...clubForm, clubId: e.target.value })} required>
                <option value="">Select club</option>
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label>Name</label>
              <input value={clubForm.name} onChange={e => setClubForm({ ...clubForm, name: e.target.value })} required />
              <label>Email</label>
              <input value={clubForm.email} onChange={e => setClubForm({ ...clubForm, email: e.target.value })} required />
              <label>Student ID</label>
              <input value={clubForm.studentId} onChange={e => setClubForm({ ...clubForm, studentId: e.target.value })} required />
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
          </div>
          <div className="registration-card" style={{ flex: 1 }}>
            <h3>Activities Registration</h3>
            <form onSubmit={handleActivitySubmit} className="activities-form">
              <label>Option</label>
              <select value={activityForm.option} onChange={e => setActivityForm({ ...activityForm, option: e.target.value })}>
                <option>Individual</option>
                <option>Team</option>
              </select>
              <label>Name</label>
              <input value={activityForm.name} onChange={e => setActivityForm({ ...activityForm, name: e.target.value })} required />
              <label>Email</label>
              <input value={activityForm.email} onChange={e => setActivityForm({ ...activityForm, email: e.target.value })} required />
              <label>School ID</label>
              <input value={activityForm.schoolId} onChange={e => setActivityForm({ ...activityForm, schoolId: e.target.value })} required />
              <label>Activity Option</label>
              <select value={activityForm.activity} onChange={e => setActivityForm({ ...activityForm, activity: e.target.value })}>
                <option>Basketball</option>
                <option>Volleyball</option>
                <option>Badminton</option>
                <option>Chess</option>
                <option>Athletics</option>
              </select>
              <button type="submit" className="btn btn-primary" disabled={activityLoading}>{activityLoading ? "Submitting..." : "Register"}</button>
            </form>
          </div>
        </div>
        <div className="registration-card registration-card-wide">
          <h3>Recent Registration</h3>
          <div className="recent-registrations">
            {recentRegs.map((r, idx) => (
              <div key={idx} className="recent-reg-card">
                <p><strong>Type:</strong> {r.type}</p>
                <p><strong>Date:</strong> {new Date(r.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {r.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Unified admin view
  return (
    <div className="registration-admin-view">
      <div className="registration-admin-top">
        <input type="text" placeholder="Search by Student ID, Name, Email" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option>All Types</option>
          <option>Club</option>
          <option>Activities</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
        {/* Add Club button removed as requested */}
      </div>
      <div className="registration-admin-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
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
            {filteredRegs.map((r, idx) => (
              <tr key={idx}>
                <td>{r.type}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.schoolId}</td>
                <td>{r.activity || r.club_name}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td>
                  {/* Example action buttons */}
                  <button className="btn btn-sm btn-success">Approve</button>
                  <button className="btn btn-sm btn-danger">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Club Modal removed as requested */}
    </div>
  );
}
