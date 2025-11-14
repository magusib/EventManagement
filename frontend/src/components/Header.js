import React from 'react';
import '../styles/Login.css';

export default function Header() {
  return (
    <header className="header-section">
      <img src="/uploads/ptc.jpg" alt="PTC Banner" className="header-banner" />
      <div className="header-overlay">
        <img src="/uploads/logo.png" alt="PTC Logo" className="header-logo" />
        <h1 className="header-title">Pateros Technological College</h1>
      </div>
    </header>
  );
}
