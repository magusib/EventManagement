import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import Header from "../components/Header";

export default function ClubRegistrationPage() {
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState("");
  const [reason, setReason] = useState("");
  const [registrations, setRegistrations] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    api.get("/clubs").then(r => setClubs(r.data)).catch(e => console.error(e));
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get("/club-registrations");
      setRegistrations(response.data || []);
    } catch (err) {
      console.error("Error fetching club registrations:", err);
    }
  };

  const submit = async () => {
    if (!clubId) return alert("Select a club");
    try {
      await api.post("/club-registrations", { club_id: clubId, reason });
      alert("Registration submitted.");
      setClubId("");
      setReason("");
      fetchRegistrations();
    } catch (err) {
      alert("Error submitting registration");
    }
  };

  // Get student's own club registrations
  const studentClubRegistrations = registrations.filter(reg => reg.user_email === user?.email || reg.email === user?.email);
  const recentClubRegistrations = studentClubRegistrations.slice(0, 5); // Show last 5

  return (
    <div className="club-registration-container">
      <Header />
      <h4>Club Registration</h4>
      <div className="club-registration-form">
        <select value={clubId} onChange={e => setClubId(e.target.value)} className="form-control">
          <option value="">Select club</option>
          {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <textarea 
          placeholder="Reason (optional)" 
          value={reason} 
          onChange={e => setReason(e.target.value)}
          className="form-control"
        />
        <div><button className="btn btn-primary" onClick={submit}>Submit</button></div>
      </div>

      {/* Student's Recent Club Registrations */}
      {recentClubRegistrations.length > 0 && (
        <div className="recent-registrations-section">
          <h4>Your Recent Club Registrations</h4>
          <div className="registrations-grid">
            {recentClubRegistrations.map((reg) => (
              <div key={reg.id} className="registration-card">
                <div className="card-header">
                  <h5>{reg.club_name || "Club"}</h5>
                  <span className={`status-badge ${reg.status?.toLowerCase() || "pending"}`}>
                    {reg.status || "Pending"}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Date:</strong> {new Date(reg.created_at).toLocaleDateString()}</p>
                  {reg.reason && <p><strong>Reason:</strong> {reg.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
