import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import "../styles/ClubModal.css";

export default function ClubModal({ open, onClose, onSaved, initialData = null }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [achievements, setAchievements] = useState("");
  const [coach, setCoach] = useState("");
  const [members, setMembers] = useState("");
  const [schedule, setSchedule] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setAchievements(initialData.achievements || "");
      setCoach(initialData.coach || "");
      setMembers(initialData.current_members || "");
      setSchedule(initialData.training_schedule || "");
    } else {
      setName("");
      setDescription("");
      setAchievements("");
      setCoach("");
      setMembers("");
      setSchedule("");
      setPictureFile(null);
    }
  }, [initialData, open]);

  // compute api root for previewing existing image
  const apiRoot = (() => {
    const env = process.env.REACT_APP_API_URL;
    if (env) return env.replace(/\/api\/?$/i, "");
    try { if (api.defaults.baseURL) return api.defaults.baseURL.replace(/\/api\/?$/i, ""); } catch(e) {}
    return window.location.origin;
  })();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required field validation
    if (!name.trim() || !description.trim() || !coach.trim() || !members || !schedule.trim()) {
      window.alert("All required fields must be filled in."); // popup
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("achievements", achievements);
      fd.append("coach", coach);
      fd.append("current_members", members);
      fd.append("schedule", schedule);
      if (pictureFile) fd.append("picture", pictureFile);

      if (initialData && initialData.id) {
        await api.put(`/clubs/${initialData.id}`, fd);
        window.alert("Club updated successfully!"); // popup
      } else {
        await api.post(`/clubs`, fd);
        window.alert("Club added successfully!"); // popup
      }

      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      window.alert(err.response?.data?.error || "Failed to save club"); // popup
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose} type="button">
          <i className="fa fa-times"></i>
        </button>
        <h3 style={{marginTop:0, marginBottom:16, textAlign:'left'}}>
          {initialData ? "Edit Club" : "Add Club"}
        </h3>
        <form onSubmit={handleSubmit} className="modal-form">
          {initialData?.picture && !pictureFile && (
            <div style={{marginBottom:8}}>
              <img
                src={initialData.picture.startsWith('/') ? `${apiRoot}${initialData.picture}` : initialData.picture}
                alt="preview"
                style={{width:120, height:100, objectFit:'cover', borderRadius:6}}
              />
            </div>
          )}
          <label>Club Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={3} />

          <label>Achievements</label>
          <textarea value={achievements} onChange={(e)=>setAchievements(e.target.value)} rows={2} />

          <label>Coach</label>
          <input value={coach} onChange={(e)=>setCoach(e.target.value)} />

          <label>Current Members</label>
          <input value={members} onChange={(e)=>setMembers(e.target.value)} type="number" />

          <label>Schedule</label>
          <input value={schedule} onChange={(e)=>setSchedule(e.target.value)} />

          <label>Picture</label>
          <input type="file" accept="image/*" onChange={(e)=>setPictureFile(e.target.files?.[0] || null)} />

          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn" onClick={() => onClose && onClose()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
