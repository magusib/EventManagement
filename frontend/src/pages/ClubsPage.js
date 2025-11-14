import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import Header from "../components/Header";
import ClubModal from "../components/ClubModal"; // correct relative path

export default function ClubsPage({ admin = false }) {
  const [clubs, setClubs] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // compute API root safely
  const apiRoot = (() => {
    const env = process.env.REACT_APP_API_URL;
    if (env) return env.replace(/\/api\/?$/i, "");
    if (api.defaults.baseURL) return api.defaults.baseURL.replace(/\/api\/?$/i, "");
    return window.location.origin;
  })();

  useEffect(() => {
    loadClubs();
    fetchRegistrations();
  }, []);

  const loadClubs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clubs");
      setClubs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/club-registrations");
      setRegistrations(res.data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this club?")) return;
    try {
      await api.delete(`/clubs/${id}`);
      setClubs(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Error deleting club");
    }
  };

  const handleRegister = async (clubId) => {
    if (!user) return alert("Please login to register for a club");
    if (!window.confirm("Register for this club?")) return;
    try {
      await api.post("/club-registrations", { club_id: clubId });
      alert("Club registration submitted");
      fetchRegistrations();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error registering for club");
    }
  };

  // Recent registrations for logged-in student
  const studentClubRegistrations = user
    ? registrations.filter(reg => reg.user_email === user.email || reg.user_id === user.id)
    : [];
  const recentClubRegistrations = studentClubRegistrations.slice(0, 5);

  return (
    <div className="clubs-page">
      <Header />
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3>Clubs</h3>
        {admin && (
          <button
            className="btn btn-primary"
            onClick={() => { setEditingClub(null); setModalOpen(true); }}
          >
            Add Club
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: 40 }}>Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <div className="text-center" style={{ padding: 40 }}>
          <p style={{ fontSize: 18, color: '#475569' }}>No clubs available yet.</p>
          {admin && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Add first club</button>
          )}
        </div>
      ) : (
        <div className="club-grid">
          {clubs.map((c) => (
            <div className="club-card" key={c.id}>
              {c.picture && (
                <img
                  src={(function(){
                    if (/^https?:\/\//i.test(c.picture)) return c.picture;
                    if (c.picture.startsWith("/")) return `${apiRoot}${c.picture}`;
                    // bare filename
                    return `${apiRoot}/uploads/${c.picture}`;
                  })()}
                  alt={c.name}
                  className="club-image"
                />
              )}
              <div className="club-card-body">
                <h4 className="club-name">{c.name}</h4>
                {c.description && <p className="club-desc">{c.description}</p>}
                {c.achievements && <p className="club-achievements"><strong>Achievements:</strong> {c.achievements}</p>}

                <div className="club-meta">
                  <p><strong>Coach:</strong> {c.coach || "-"}</p>
                  <p><strong>Members:</strong> {c.current_members ?? "-"}</p>
                  <p><strong>Schedule:</strong> {c.training_schedule || "-"}</p>
                </div>

                <div className="club-actions">
                  {!admin && (
                    <button className="btn btn-register" onClick={() => handleRegister(c.id)}>
                      Register
                    </button>
                  )}
                  {admin && (
                    <div className="admin-actions">
                      <button className="btn btn-sm btn-warning" onClick={() => { setEditingClub(c); setModalOpen(true); }}>
                        <i className="fa fa-edit"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      {admin && (
        <ClubModal
          open={modalOpen}
          initialData={editingClub}
          onClose={() => { setModalOpen(false); setEditingClub(null); }}
          onSaved={async () => {
            setModalOpen(false);
            setEditingClub(null);
            await loadClubs();
            await fetchRegistrations();
          }}
        />
      )}

      {/* Student's recent registrations */}
      {recentClubRegistrations.length > 0 && !admin && (
        <div className="recent-registrations-section" style={{ marginTop: 24 }}>
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
