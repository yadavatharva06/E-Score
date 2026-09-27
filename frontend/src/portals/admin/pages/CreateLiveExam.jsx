import React from 'react';
import '../styles/CreateLiveExam.css';

export default function CreateLiveExam() {
  return (
    <div className="exam-scheduler-panel-card exam-scheduler-wrapper-card">
      <h3 className="exam-scheduler-card-title">
        🚀 Create Live Mock Examination
      </h3>
      <p className="exam-scheduler-description">
        Deploy a timed evaluation node framework. Set up active durations, mark evaluation layers, and live calendar configurations.
      </p>

      <form className="exam-scheduler-form" onSubmit={(e) => e.preventDefault()}>
        {/* Row 1: Title & Code */}
        <div className="exam-scheduler-row-2-1">
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Official Examination Title</label>
            <input type="text" className="exam-scheduler-text-input" placeholder="e.g., UPSC Prelims 2026 Full Length Mock 1" required />
          </div>
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Unique Course Code ID</label>
            <input type="text" className="exam-scheduler-text-input" placeholder="e.g., UPSC-26-M1" required />
          </div>
        </div>

        {/* Row 2: Duration, Marks, Negative Marking */}
        <div className="exam-scheduler-row-three-split">
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Duration Time (Minutes)</label>
            <input type="number" className="exam-scheduler-text-input" defaultValue="120" min="1" required />
          </div>
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Correct Mark Allotment</label>
            <input type="number" className="exam-scheduler-text-input" defaultValue="2" step="0.5" required />
          </div>
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Negative Marks Penalty</label>
            <input type="number" className="exam-scheduler-text-input" defaultValue="0.66" step="0.01" required />
          </div>
        </div>

        {/* Row 3: Live Scheduling Timestamps */}
        <div className="exam-scheduler-row-equal-split">
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Live Window Start Time</label>
            <input type="datetime-local" className="exam-scheduler-text-input" required />
          </div>
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Automatic Test Lock/End Time</label>
            <input type="datetime-local" className="exam-scheduler-text-input" required />
          </div>
        </div>

        {/* Access Tier Selectors */}
        <div className="exam-scheduler-row-equal-split">
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Access Restriction Matrix</label>
            <select className="exam-scheduler-text-input">
              <option value="free">Free Tier General Access</option>
              <option value="premium">Premium Subscribed Accounts Only</option>
            </select>
          </div>
          <div className="exam-scheduler-field-group">
            <label className="exam-scheduler-field-label">Total Selected Questions Pool Count</label>
            <input type="number" className="exam-scheduler-text-input" defaultValue="100" min="1" required />
          </div>
        </div>

        <button type="submit" className="exam-scheduler-deploy-btn">
          Deploy Active Live Test Node
        </button>
      </form>
    </div>
  );
}
