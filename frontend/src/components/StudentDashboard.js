import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentDashboard.css';

function StudentDashboard() {
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
      case 'club': return <Club />;
      case 'registration': return <Registration />;
      case 'event': return <Event />;
      case 'announcement': return <Announcement />;
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

// Home Component
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

// Club Component
const Club = () => {
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/clubs').then(res => setClubs(res.data));
  }, []);
  return (
    <div>
      <h2>Clubs</h2>
      {clubs.map(club => (
        <div key={club.id}>
          <h3>{club.name}</h3>
          <p>{club.description}</p>
        </div>
      ))}
    </div>
  );
};

// Registration Component
const Registration = () => {
  const [clubs, setClubs] = useState([]);
  const [activityName, setActivityName] = useState('');
  useEffect(() => {
    axios.get('http://localhost:5000/clubs').then(res => setClubs(res.data));
  }, []);
  const registerClub = (clubId) => {
    axios.post('http://localhost:5000/register-club', { clubId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => alert('Club registered!'));
  };
  const registerActivity = () => {
    axios.post('http://localhost:5000/register-activity', { activityName }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => alert('Activity registered!'));
  };
  return (
    <div>
      <h2>Registration</h2>
      <h3>Club Registration</h3>
      {clubs.map(club => (
        <button key={club.id} onClick={() => registerClub(club.id)}>Register for {club.name}</button>
      ))}
      <h3>School Activities Registration</h3>
      <input type="text" placeholder="Activity Name" value={activityName} onChange={(e) => setActivityName(e.target.value)} />
      <button onClick={registerActivity}>Register</button>
    </div>
  );
};

// Event Component
const Event = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/events').then(res => setEvents(res.data));
  }, []);
  return (
    <div>
      <h2>Events</h2>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>Date: {event.date} | Time: {event.time} | Venue: {event.venue}</p>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
};

// Announcement Component
const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/announcements').then(res => setAnnouncements(res.data));
  }, []);
  return (
    <div>
      <h2>Announcements</h2>
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

// Profile Component
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
      <p>Student ID: {profile.student_id}</p>
      <input type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={updateProfile}>Update</button>
    </div>
  );
};

export default StudentDashboard;