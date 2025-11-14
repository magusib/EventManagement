import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return <Home />;
      case 'club': return <ClubManagement />;
      case 'registration': return <RegistrationManagement />;
      case 'event': return <EventManagement />;
      case 'announcement': return <AnnouncementManagement />;
      case 'profile': return <Profile />;
      default: return <Home />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <Header />
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="sidebar-toggle">
          <i className="fas fa-bars"></i>
        </button>
        <ul className="menu">
          <li onClick={() => setActiveSection('home')}><i className="fas fa-home"></i> Home</li>
          <li onClick={() => setActiveSection('club')}><i className="fas fa-users"></i> Club</li>
          <li onClick={() => setActiveSection('registration')}><i className="fas fa-clipboard-list"></i> Registration</li>
          <li onClick={() => setActiveSection('event')}><i className="fas fa-calendar"></i> Event</li>
          <li onClick={() => setActiveSection('announcement')}><i className="fas fa-bullhorn"></i> Announcement</li>
          <li onClick={() => setActiveSection('profile')}><i className="fas fa-user"></i> Profile</li>
          <li onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</li>
        </ul>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
}

// Home Component (Same as Student)
const Home = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    axios.get('http://localhost:5000/home').then(res => setData(res.data));
  }, []);
  return (
    <div>
      <h2>Home</h2>
      <p><strong>Mission:</strong> {data.mission}</p>
      <p><strong>Vision:</strong> {data.vision}</p>
    </div>
  );
};

// ClubManagement Component
const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  useEffect(() => {
    fetchClubs();
  }, []);
  const fetchClubs = () => {
    axios.get('http://localhost:5000/clubs').then(res => setClubs(res.data));
  };
  const addClub = () => {
    axios.post('http://localhost:5000/clubs', { name, description }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => { fetchClubs(); setName(''); setDescription(''); });
  };
  const deleteClub = (id) => {
    axios.delete(`http://localhost:5000/clubs/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(fetchClubs);
  };
  return (
    <div>
      <h2>Club Management</h2>
      <input type="text" placeholder="Club Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={addClub}>Add Club</button>
      {clubs.map(club => (
        <div key={club.id}>
          <h3>{club.name}</h3>
          <p>{club.description}</p>
          <button onClick={() => deleteClub(club.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

// RegistrationManagement Component
const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/registrations', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setRegistrations(res.data));
  }, []);
  return (
    <div>
      <h2>Registration Management</h2>
      {registrations.map(reg => (
        <div key={reg.id}>
          <p>Student: {reg.fullname} (ID: {reg.student_id}) - {reg.type} - {reg.club_id ? `Club ID: ${reg.club_id}` : reg.activity_name}</p>
        </div>
      ))}
    </div>
  );
};

// EventManagement Component
const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = () => {
    axios.get('http://localhost:5000/events').then(res => setEvents(res.data));
  };
  const addEvent = () => {
    axios.post('http://localhost:5000/events', { title, date, time, venue, description }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => { fetchEvents(); setTitle(''); setDate(''); setTime(''); setVenue(''); setDescription(''); });
  };
  const deleteEvent = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(fetchEvents);
  };
  return (
    <div>
      <h2>Event Management</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <input type="text" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={addEvent}>Add Event</button>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>Date: {event.date} | Time: {event.time} | Venue: {event.venue}</p>
          <p>{event.description}</p>
          <button onClick={() => deleteEvent(event.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

// AnnouncementManagement Component
const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  const fetchAnnouncements = () => {
    axios.get('http://localhost:5000/announcements').then(res => setAnnouncements(res.data));
  };
  const postAnnouncement = () => {
    axios.post('http://localhost:5000/announcements', { title, content }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => { fetchAnnouncements(); setTitle(''); setContent(''); });
  };
  return (
    <div>
      <h2>Announcement Management</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={postAnnouncement}>Post Announcement</button>
      {announcements.map(ann => (
        <div key={ann.id}>
          <h3>{ann.title}</h3>
          <p>{ann.content}</p>
          <small>Posted: {ann.created_at}</small>
        </div>
      ))}
    </div>
  );
};

// Profile Component (Same as Student, but for Admin)
const Profile = () => {
  const [profile, setProfile] = useState({});
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  useEffect(() => {
    axios.get('http://localhost:5000/profile', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setProfile(res.data);
        setFullname(res.data.fullname);
        setPhone(res.data.phone);
      });
  }, []);
  const updateProfile = () => {
    axios.put('http://localhost:5000/profile', { fullname, phone }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => alert('Profile updated!'));
  };
  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <input type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={updateProfile}>Update</button>
    </div>
  );
};

export default AdminDashboard;