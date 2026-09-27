import React from 'react';
import '../styles/ManageUsers.css';

export default function ManageUsers() {
  // Mock Student Grid Lists
  const studentRosters = [
    { id: "USR-8291", name: "Rahul Sharma", email: "rahul.s@email.com", target: "UPSC", status: "Active", joined: "24-Sep-2026" },
    { id: "USR-3021", name: "Priya Patil", email: "priya.p@email.com", target: "MPSC", status: "Active", joined: "21-Sep-2026" },
    { id: "USR-4910", name: "Amit Verma", email: "amit.v@email.com", target: "SSC", status: "Suspended", joined: "18-Sep-2026" },
  ];

  return (
    <div className="user-roster-panel-card user-roster-full-width">
      {/* Header Panel Layout */}
      <div className="user-roster-header-bar">
        <div>
          <h3 className="user-roster-card-title">
            🧑‍🎓 User Accounts Control Roster
          </h3>
          <p className="user-roster-subtitle">
            Review registered profiles, audit performance tracking logs, and apply security suspension configurations.
          </p>
        </div>
        
        {/* Search Input Block */}
        <div>
          <input 
            type="text" 
            className="user-roster-search-input" 
            placeholder="🔍 Search name, email, identifier..." 
          />
        </div>
      </div>

      {/* Roster Table Frame */}
      <div className="user-roster-table-scroll-wrapper">
        <table className="user-roster-data-matrix">
          <thead>
            <tr className="user-roster-thead-row">
              <th>User ID</th>
              <th>Student Details</th>
              <th>Target Matrix</th>
              <th>Onboard Date</th>
              <th>Status Layer</th>
              <th className="text-center-override">Action Console</th>
            </tr>
          </thead>
          <tbody>
            {studentRosters.map((user) => (
              <tr key={user.id} className="user-roster-tbody-row">
                <td className="user-roster-td-id">{user.id}</td>
                <td>
                  <div className="user-roster-student-name">{user.name}</div>
                  <div className="user-roster-student-email">{user.email}</div>
                </td>
                <td>
                  <span className="user-roster-target-tag">{user.target}</span>
                </td>
                <td className="user-roster-joined-date">{user.joined}</td>
                <td>
                  <span className={`user-roster-status-badge ${user.status.toLowerCase() === 'active' ? 'badge-active' : 'badge-suspended'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="user-roster-action-group">
                    <button className="user-roster-btn btn-view-logs">
                      View Logs
                    </button>
                    <button className={`user-roster-btn ${user.status === 'Active' ? 'btn-suspend' : 'btn-activate'}`}>
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
