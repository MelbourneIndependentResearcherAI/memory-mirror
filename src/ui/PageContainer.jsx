import React from "react";
import "./ui.css";

export default function PageContainer({ children }) {
  return (
    <div className="page-container">
      <div className="page-inner">
        {children}
      </div>
    </div>
  );
}
