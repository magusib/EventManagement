import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import Header from "../components/Header";

export default function AnnouncementsPage({ admin=false }) {
  const [ann, setAnn] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });

  useEffect(() => {
    api.get("/announcements").then(r => setAnn(r.data)).catch(e => console.error(e));
  }, []);

  const post = async () => {
    if (!form.title || !form.message) return alert("Title and message required");
    try {
      await api.post("/announcements", form);
      setForm({ title: "", message: "" });
      const r = await api.get("/announcements");
      setAnn(r.data);
    } catch (err) {
      alert("Error posting");
    }
  };

  return (
    <div>
      <Header />
      <h3>Announcements</h3>
      {admin && (
        <div className="card p-2 mb-3">
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          <button className="btn btn-primary" onClick={post}>Post</button>
        </div>
      )}

      <div>
        {ann.map(a => (
          <div key={a.id} className="card mb-2 p-2">
            <h5>{a.title}</h5>
            <p>{a.message}</p>
            <small>Posted by: {a.posted_by || "Admin"} on {new Date(a.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
