import React, { useState } from 'react';
import '../styles/FeedExamDetails.css'

export default function FeedExamDetails() {
  // Master selection state: 'exam', 'subject', or 'question'
  const [panelAction, setPanelAction] = useState('exam');

  // Input states for Layer 1: Add Exam Fields
  const [examCategoryName, setExamCategoryName] = useState(''); // e.g., UPSC
  const [examFullName, setExamFullName] = useState('');         // e.g., Union Public Service Commission
  const [examIdCode, setExamIdCode] = useState('');            // e.g., 101

  return (
    <div className="admin-panel-card">
      <h3 className="panel-card-title">
        ⚙️ Core Question Bank Engine
      </h3>
      <p className="setting-description">
        Select your operational goal below to configure administrative test matrices, stream subjects, or individual question pools.
      </p>

      {/* 🔝 MASTER SELECT ACTION dropdown */}
      <div className="form-group-block">
        <label className="setting-field-label">
          Select Management Action Task
        </label>
        <select 
          className="setting-text-input" 
          value={panelAction}
          onChange={(e) => setPanelAction(e.target.value)}
        >
          <option value="exam">1. Add New Master Exam Category (UPSC, SSC, Defences...)</option>
          <option value="subject">2. Add Stream Subject Entry (Maths, Science...)</option>
          <option value="question">3. Add Single Question & Option Set (Default Prompt View)</option>
        </select>
      </div>

      {/* ==========================================================================
         VIEWPORT LAYER 1: ADD EXAMS FIELD MAPPING (UPDATED FOR FIRESTORE PROMPT)
         ========================================================================== */}
      {panelAction === 'exam' && (
        <form className="admin-setting-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group-block">
            <label className="setting-field-label">Master Exam Category Identifier Name</label>
            <input 
              type="text" 
              className="setting-text-input" 
              placeholder="e.g., UPSC, SSC, Defences" 
              value={examCategoryName}
              onChange={(e) => setExamCategoryName(e.target.value)}
              required 
            />
          </div>

          {/* New Full Name Field Parameter */}
          <div className="form-group-block">
            <label className="setting-field-label">Exam Full Name Specification</label>
            <input 
              type="text" 
              className="setting-text-input" 
              placeholder="e.g., Union Public Service Commission" 
              value={examFullName}
              onChange={(e) => setExamFullName(e.target.value)}
              required 
            />
          </div>

          {/* New ID Numerical Configuration Field Parameter */}
          <div className="form-group-block">
            <label className="setting-field-label">
              Exam ID Code Configuration ({examCategoryName ? examCategoryName.toUpperCase() : 'EXAM'}_ID)
            </label>
            <input 
              type="number" 
              className="setting-text-input" 
              placeholder="e.g., 101" 
              value={examIdCode}
              onChange={(e) => setExamIdCode(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="setting-save-btn">
            Register Exam Category
          </button>
        </form>
      )}

      {/* ==========================================================================
         VIEWPORT LAYER 2: ADD SUBJECT FIELDS MAPPING
         ========================================================================== */}
      {panelAction === 'subject' && (
        <form className="admin-setting-form" onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group-block">
              <label className="setting-field-label">Target Exam Path Identifier</label>
              <select className="setting-text-input">
                <option value="UPSC">UPSC</option>
                <option value="SSC">SSC</option>
                <option value="Defences">Defences</option>
              </select>
            </div>
            <div className="form-group-block">
              <label className="setting-field-label">Sub-Stream Type Group</label>
              <select className="setting-text-input">
                <option value="CSE">CSE (Civil Services Exam)</option>
                <option value="CGL">CGL (Combined Graduate Level)</option>
                <option value="NDA">NDA (National Defence Academy)</option>
              </select>
            </div>
          </div>
          <div className="form-group-block">
            <label className="setting-field-label">Subject Syllabus Field Name</label>
            <input type="text" className="setting-text-input" placeholder="e.g., Maths, Science, Reasoning" required />
          </div>
          <button type="submit" className="setting-save-btn">
            Create Subject Entry
          </button>
        </form>
      )}

      {/* ==========================================================================
         VIEWPORT LAYER 3: ADD QUESTIONS AND OPTIONS MAPPING
         ========================================================================== */}
      {panelAction === 'question' && (
        <form className="admin-setting-form" onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group-block">
              <label className="setting-field-label">Target Exam Target Category</label>
              <select className="setting-text-input">
                <option value="UPSC">UPSC Civil Services</option>
                <option value="MPSC">MPSC State Services</option>
                <option value="SSC">SSC CGL Tier-1</option>
              </select>
            </div>
            <div className="form-group-block">
              <label className="setting-field-label">Difficulty Complexity Tier</label>
              <select className="setting-text-input">
                <option value="easy">Easy Level</option>
                <option value="medium">Medium Level</option>
                <option value="hard">Hard Level</option>
              </select>
            </div>
          </div>

          <div className="form-group-block">
            <label className="setting-field-label">Question Prompt / Statement (Markdown/LaTeX Supported)</label>
            <textarea 
              className="setting-text-input" 
              rows="4" 
              placeholder="Type the core mock exam question statement here..."
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="setting-field-label">Multiple Choice Option Configurations</label>
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', width: '20px' }}>{opt}</span>
                <input type="text" className="setting-text-input" placeholder={`Enter text value for Option ${opt}`} required />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '10px' }}>
            <div className="form-group-block">
              <label className="setting-field-label">Designated Correct Option Target</label>
              <select className="setting-text-input">
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <div className="form-group-block">
              <label className="setting-field-label">Step-by-Step Rationale Explanation Sheet</label>
              <textarea 
                className="setting-text-input" 
                rows="3" 
                placeholder="Provide analytical background reasoning details for student reviews..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <button type="submit" className="setting-save-btn">
            Save Question to Bank
          </button>
        </form>
      )}
    </div>
  );
}
