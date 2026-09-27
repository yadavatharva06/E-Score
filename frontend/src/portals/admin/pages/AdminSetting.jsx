import React, { useState } from 'react';
import '../styles/AdminSetting.css';

export default function AdminSetting() {
  // Master operation selection state: 'create' | 'update' | 'delete'
  const [settingAction, setSettingAction] = useState('create');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form input data state bindings
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [securityLevel, setSecurityLevel] = useState('Level 1');

  const [selectedSettingId, setSelectedSettingId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSettingExecution = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const payload = {
      action: settingAction,
      data: settingAction === 'delete' ? { selectedSettingId, deleteConfirmation } : { adminName, adminEmail, securityLevel, selectedSettingId }
    };

    console.log("Executing Admin Setting Data Transaction:", payload);

    // Simulate database write delay
    setTimeout(() => {
      setIsProcessing(false);
      if (settingAction === 'delete') {
        if (deleteConfirmation.trim().toLowerCase() === 'confirm delete') {
          alert("Administrative console records successfully purged!");
          setDeleteConfirmation('');
        } else {
          alert("Error: Invalid verification passphrase.");
          return;
        }
      } else {
        alert(`Success: Admin Configuration [${settingAction.toUpperCase()}] executed smoothly!`);
      }

      // Reset mutable input text cleanly
      setAdminName('');
      setAdminEmail('');
    }, 800);
  };

  return (
    <div className="sys-config-panel-card sys-config-wrapper-card">
      <h3 className="sys-config-card-title">⚙️ System Console Management Node</h3>
      <p className="sys-config-description">
        Configure master operational identifiers, setup root permissions parameters, or perform administrative data purges.
      </p>

      {/* 🔝 MASTER DROPDOWN SELECTION SYSTEM */}
      <div className="sys-config-field-group mb-30 border-bottom-divider">
        <label className="sys-config-field-label accent-orange-color">Select Management Action Task</label>
        <select
          className="sys-config-text-input border-orange-bold"
          value={settingAction}
          onChange={(e) => { setSettingAction(e.target.value); setDeleteConfirmation(''); }}
        >
          <option value="create">1. Add / Create New Master Admin Profile Entry</option>
          <option value="update">2. Edit / Update Existing Operational Credentials</option>
          <option value="delete">3. Deprovision / Delete Master Administrative Access Nodes</option>
        </select>
      </div>

      <form onSubmit={handleSettingExecution} className="sys-config-form">

        {/* ==========================================================================
           VIEWPORT 1: CREATE NEW ADMIN VIEW
           ========================================================================== */}
        {settingAction === 'create' && (
          <div className="sys-config-workspace-block">
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Administrator Display Name</label>
              <input type="text" className="sys-config-text-input" placeholder="e.g., Jane Doe" value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
            </div>
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Account Contact Email Address</label>
              <input type="email" className="sys-config-text-input" placeholder="e.g., jane@escore.com" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
            </div>
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Administrative Security Level</label>
              <select className="sys-config-text-input" value={securityLevel} onChange={(e) => setSecurityLevel(e.target.value)}>
                <option value="Level 1">Root Level Access (Level 1)</option>
                <option value="Level 2">Content Moderator Access (Level 2)</option>
              </select>
            </div>
          </div>
        )}

        {/* ==========================================================================
           VIEWPORT 2: UPDATE EXISTING CREDENTIALS VIEW
           ========================================================================== */}
        {settingAction === 'update' && (
          <div className="sys-config-workspace-block">
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Select Target Profile to Modulate</label>
              <select className="sys-config-text-input" value={selectedSettingId} onChange={(e) => setSelectedSettingId(e.target.value)} required>
                <option value="">-- Choose Existing Console Account --</option>
                <option value="ADM-ROOT">System Administrator (admin@escore.com)</option>
              </select>
            </div>
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Updated Administrator Display Name</label>
              <input type="text" className="sys-config-text-input" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Enter updated name..." required />
            </div>
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Account Contact Email Address</label>
              <input type="email" className="sys-config-text-input input-disabled-field" value="admin@escore.com" disabled />
            </div>
          </div>
        )}

        {/* ==========================================================================
           VIEWPORT 3: DEPROVISION / DELETE ACCESS WORKSPACE
           ========================================================================== */}
        {settingAction === 'delete' && (
          <div className="sys-config-workspace-block">
            <div className="sys-config-danger-banner">
              <strong>⚠️ CRITICAL SECURITY WARNING:</strong> Deprovisioning this structural entry permanently revokes data access privileges across the entire E-Score administration matrix sheets.
            </div>
            <div className="sys-config-field-group">
              <label className="sys-config-field-label">Select Administrative Access Node to Delete</label>
              <select className="sys-config-text-input" value={selectedSettingId} onChange={(e) => setSelectedSettingId(e.target.value)} required>
                <option value="">-- Select Targeted Registry Reference --</option>
                <option value="ADM-ROOT">System Administrator (admin@escore.com)</option>
              </select>
            </div>
            <div className="sys-config-field-group">
              <label className="sys-config-field-label text-danger-color">
                Type <span className="passphrase-highlight">confirm delete</span> below to verify authorization
              </label>
              <input type="text" className="sys-config-text-input border-danger-focus" placeholder="Verification passphrase entry..." value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} required />
            </div>
          </div>
        )}

        {/* 🚀 CALL TRANSACTIONS INTERFACE SUBMIT TRIGGER BUTTON */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`sys-config-submit-btn ${settingAction === 'create' ? 'btn-mode-green' : settingAction === 'update' ? 'btn-mode-blue' : 'btn-mode-red'
            }`}
        >
          {isProcessing ? "Processing Configuration Nodes..."
            : settingAction === 'create' ? "Register New Console Profile"
              : settingAction === 'update' ? "Commit Credential Updates"
                : "Permanently Purge Access Records"}
        </button>
      </form>
    </div>
  );
}
