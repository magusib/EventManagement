import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import Header from "../components/Header";

export default function EventsPage({ admin=false }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", venue: "", event_date: "", start_time: "" });

  useEffect(() => {
    api.get("/events").then(r => setEvents(r.data)).catch(e => console.error(e));
  }, []);

  const addEvent = async () => {
    if (!form.title) return alert("Title required");
    try {
      await api.post("/events", form);
      alert("Event added");
      setForm({ title: "", description: "", venue: "", event_date: "", start_time: "" });
      const r = await api.get("/events");
      setEvents(r.data);
    } catch (err) {
      alert("Error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div>
      <Header />
      <h3>Events</h3>
      {admin && (
        <div className="card p-2 mb-3">
          <h5>Add Event</h5>
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="Date" type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} />
          <input placeholder="Time" type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
          <input placeholder="Venue" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button className="btn btn-success" onClick={addEvent}>Add</button>
        </div>
      )}

      <div>
        {events.map(ev => (
          <div key={ev.id} className="card mb-2 p-2">
            <h5>{ev.title}</h5>
            <p>{ev.description}</p>
            <p><strong>Date:</strong> {ev.event_date} <strong>Time:</strong> {ev.start_time} <strong>Venue:</strong> {ev.venue}</p>
            {admin && <button className="btn btn-danger" onClick={() => remove(ev.id)}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
