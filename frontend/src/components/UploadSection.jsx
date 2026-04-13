import React, { useRef, useState } from 'react';
import { UploadCloud, FileType, AlertCircle, Building2, Briefcase, HeartPulse } from 'lucide-react';

const UploadSection = ({ onUpload, loading, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [domain, setDomain] = useState('General');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a CSV file.");
      return;
    }
    onUpload(file, domain);
  };

  const triggerUpload = () => {
    inputRef.current.click();
  };

  return (
    <div className="upload-container glass-panel">
      <h1><span className="gradient-text">Vision Codex</span></h1>
      <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "1.1rem" }}>
        Uncover hidden bias and class imbalances in your datasets. 
      </p>

      <div className="domain-selector">
        <label>Select Domain Context:</label>
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="General">🌐 General</option>
          <option value="Hiring">💼 Hiring</option>
          <option value="Healthcare">⚕️ Healthcare</option>
          <option value="Finance">🏦 Finance</option>
        </select>
      </div>

      {error && (
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--danger)" }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerUpload}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".csv"
          onChange={handleChange} 
          style={{ display: "none" }} 
        />
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="loader" style={{ marginBottom: "20px" }}></div>
            <h3 className="gradient-text">Analyzing Dataset...</h3>
          </div>
        ) : (
          <>
            <UploadCloud size={64} className="upload-icon" />
            <h3 style={{ marginBottom: "12px", fontSize: "1.5rem" }}>Drag & Drop your CSV</h3>
            <p className="upload-text">or click to browse from your computer</p>
            <button className="btn-primary" onClick={(e) => {e.stopPropagation(); triggerUpload();}}>
              <FileType size={20} />
              Select File
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
