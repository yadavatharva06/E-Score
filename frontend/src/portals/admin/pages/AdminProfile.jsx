import React, { useState } from "react"; 
import adminicon from '../../../assects/icons/admin-big.png'; 
import '../styles/AdminProfile.css';

export default function AdminProfile() { 
  // Local state hook managing input adjustments for the Full Name string field 
  const [adminFullName, setAdminFullName] = useState("System Administrator"); 

  const handleUpdateProfile = (e) => { 
    e.preventDefault(); 
    console.log("Saving altered full name parameter to console schema logs:", adminFullName); 
    alert("Profile configurations updated successfully!"); 
  }; 

  return ( 
    <div className="adm-prof-card-container"> 
      <h3 className="adm-prof-card-title"> 
        👤 Master Administrative Profile 
      </h3> 
      
      <div className="adm-prof-dashboard-layout"> 
        {/* Left Side: Locked Avatar Container Layout */} 
        <div className="adm-prof-avatar-column"> 
          <div className="adm-prof-avatar-circle-wrapper"> 
            <img src={adminicon} alt="Admin Icon Profile" className="adm-prof-avatar-image-circle adm-prof-avatar-padding-bg" /> 
          </div> 
          <h4 className="adm-prof-avatar-display-name">{adminFullName}</h4> 
          <span className="adm-prof-avatar-role-label">Root Level Account</span> 
        </div> 

        {/* Right Side: Identity Core Specifications Form */} 
        <form className="adm-prof-setting-form" onSubmit={handleUpdateProfile}> 
          {/* Administrator Full Name Field */} 
          <div className="adm-prof-form-group-block"> 
            <label className="adm-prof-setting-field-label">Administrator Full Name</label> 
            <input 
              type="text" 
              className="adm-prof-setting-text-input" 
              value={adminFullName} 
              onChange={(e) => setAdminFullName(e.target.value)} 
              required 
            /> 
          </div> 

          {/* Unchangeable Registered Office Email Box */} 
          <div className="adm-prof-form-group-block"> 
            <label className="adm-prof-setting-field-label">Registered Office Email</label> 
            <input 
              type="email" 
              className="adm-prof-setting-text-input adm-prof-disabled-field" 
              value="admin@escore.com" 
              disabled 
            /> 
          </div> 

          {/* Last Login Date & Time Operational Tracking Field */} 
          <div className="adm-prof-form-group-block"> 
            <label className="adm-prof-setting-field-label">Last Login Date & Time</label> 
            <input 
              type="text" 
              className="adm-prof-setting-text-input adm-prof-disabled-field" 
              value="September 28, 2026 - 03:14 AM" 
              disabled 
            /> 
          </div> 

          <button type="submit" className="adm-prof-setting-save-btn"> 
            Save Profile Alterations 
          </button> 
        </form> 
      </div> 
    </div> 
  ); 
}
