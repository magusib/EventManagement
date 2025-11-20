import React, { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Header from "./Header";
import StudentHome from "../pages/StudentHome";
import AdminHome from "../pages/AdminHome";
import ClubsPage from "../pages/ClubsPage";
import RegistrationModule from "../pages/RegistrationModule";
import EventsPage from "../pages/EventsPage";
import AnnouncementsPage from "../pages/AnnouncementsPage";
import ProfilePage from "../pages/ProfilePage";
import "../styles/Dashboard.css";


export default function DashboardLayout() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [active, setActive] = useState("home");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    setActive("home");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Callback to update user after profile change
  const handleProfileUpdate = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(updatedUser);
  };

  const renderMain = () => {
    if (!user) return <div>Please login</div>;
    if (user.role === "admin") {
      switch (active) {
        case "home": return <AdminHome />;
        case "club": return <ClubsPage admin />;
        case "registration": return <RegistrationModule admin={true} />;
        case "event": return <EventsPage admin />;
        case "announcement": return <AnnouncementsPage admin />;
        case "profile": return <ProfilePage onProfileUpdate={handleProfileUpdate} />;
        default: return <AdminHome />;
      }
    } else {
      switch (active) {
        case "home": return <StudentHome />;
        case "club": return <ClubsPage />;
        case "registration": return <RegistrationModule admin={false} />;
        case "event": return <EventsPage />;
        case "announcement": return <AnnouncementsPage />;
        case "profile": return <ProfilePage onProfileUpdate={handleProfileUpdate} />;
        default: return <StudentHome />;
      }
    }
  };

  return (
    <div className="dashboard-root">
      <Header onMenuClick={() => setSidebarVisible(v => !v)} />

      <div className="dashboard-body">
        {sidebarVisible && (
          <DashboardSidebar
            user={user}
            role={user?.role}
            active={active}
            onChange={setActive}
            onLogout={handleLogout}
            onClose={() => setSidebarVisible(false)}
          />
        )}

        <main className={`main-content${sidebarVisible ? ' sidebar-open' : ''}`}>
          {renderMain()}
        </main>
      </div>
    </div>
  );
}
