import React from "react";
import Header from './Header';

export default function FileUploadInput({ onFile }) {
  return (
    <div>
      <Header />
      <input type="file" onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
