import React from "react";
import Header from './Header';

export default function Menubar({ onToggle }) {
  return (
    <div>
      <Header />
      <div className="menubar">
        <button onClick={onToggle}><i className="fa fa-bars"></i></button>
        <div className="title">PTC Sports</div>
      </div>
    </div>
  );
}
