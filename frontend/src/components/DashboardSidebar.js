import React from "react";
import "../styles/Dashboard.css";

function DashboardSidebar({ user, role, active, onChange, onLogout, onClose }) {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  const menu = [
    { key: "home", icon: "fa-home", label: "Home" },
    { key: "club", icon: "fa-users", label: "Club" },
    { key: "registration", icon: "fa-clipboard", label: "Registration" },
    { key: "event", icon: "fa-calendar", label: "Event" },
    { key: "announcement", icon: "fa-bullhorn", label: "Announcement" },
    { key: "profile", icon: "fa-user", label: "Profile" },
    { key: "logout", icon: "fa-sign-out", label: "Logout" },
  ];

  const handleClick = (key) => {
    if (key === "logout") return onLogout();
    onChange(key);
  };

  // Construct full avatar URL
  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    // If avatar already contains full URL, return as is
    if (user.avatar.startsWith("http")) return user.avatar;
    // Otherwise, construct full URL
    return `${apiUrl}${user.avatar}`;
  };

  return (
    <aside className="sidebar">
      <button className="sidebar-close-btn" onClick={onClose} style={{position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', zIndex: 30}}>
        <i className="fa fa-times"></i>
      </button>
      <div className="sidebar-header">
        <div className="avatar">
          {getAvatarUrl() ? (
            <img 
              src={getAvatarUrl()} 
              alt="avatar"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = "none";
                const placeholder = e.target.parentElement.querySelector(".avatar-placeholder");
                if (placeholder) {
                  placeholder.style.display = "flex";
                }
              }}
            />
          ) : (
            <div className="avatar-placeholder"><i className="fa fa-user"></i></div>
          )}
        </div>
        <div className="user-info">
          <div className="name">{user?.fullname || "NAME"}</div>
          <div className="role">{role === "admin" ? "Admin" : "Student"}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menu.map((m) => (
          <button
            key={m.key}
            className={`nav-item ${active === m.key ? "active" : ""}`}
            onClick={() => handleClick(m.key)}
          >
            <i className={`fa ${m.icon}`}></i>
            <span>{m.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
