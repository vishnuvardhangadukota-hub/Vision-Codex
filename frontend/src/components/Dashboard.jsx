import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ArrowLeft, Activity, Database, AlertOctagon } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = ({ data, onReset }) => {
  const { summary, biasScore, features, distributions, overallRisk, mostBiasedFeature, domainContext } = data.data;

  // Utilize the most biased feature for the primary chart
  const primaryFeature = mostBiasedFeature ? mostBiasedFeature.name : (features.length > 0 ? features[0].name : null);
  const primaryChartData = primaryFeature ? distributions[primaryFeature] : [];

  const handleDownload = () => window.print();

  return (
    <div className="dashboard-container">
      <div className="header">
        <div>
          <h2><span className="gradient-text">Analysis Dashboard</span></h2>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            File: <strong>{data.filename}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-primary print-hide" onClick={handleDownload} style={{ background: "var(--accent-tertiary)" }}>
            Download PDF
          </button>
          <button className="btn-primary print-hide" onClick={onReset} style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
            <ArrowLeft size={18} />
            New Upload
          </button>
        </div>
      </div>

      {/* Insight Panel */}
      <div className="insight-panel glass-panel">
        <div className="insight-header">
          <div>
            <h3 style={{ marginBottom: "8px" }}>Domain Context: {domainContext || "General"}</h3>
            <p style={{ color: "var(--text-muted)", maxWidth: "800px", lineHeight: "1.5" }}>
              {mostBiasedFeature 
                ? mostBiasedFeature.aiExplanation 
                : "No significant bias detected across the analyzed features."}
            </p>
          </div>
          <div className={`risk-badge risk-${overallRisk?.toLowerCase()}`}>
            Risk Level: {overallRisk}
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi-item">
            <span className="kpi-label">Total Rows</span>
            <span className="kpi-value">{summary.rowCount.toLocaleString()}</span>
          </div>
          <div className="kpi-div"></div>
          <div className="kpi-item">
            <span className="kpi-label">Bias Score</span>
            <span className="kpi-value" style={{ color: "var(--text-main)" }}>{biasScore} / 100</span>
          </div>
          <div className="kpi-div"></div>
          <div className="kpi-item">
            <span className="kpi-label">Highest Bias Feature</span>
            <span className="kpi-value gradient-text">{mostBiasedFeature ? mostBiasedFeature.name : "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <h3>
            {primaryFeature ? `Class Distribution: ${primaryFeature}` : 'No suitable categorical data found'}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
            Visualizing frequency of categories to identify skewed class representation.
          </p>
          
          {primaryChartData.length > 0 ? (
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={primaryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--panel-border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {primaryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              No data payload available for plotting.
            </div>
          )}
        </div>

        <div className="chart-card glass-panel">
           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertOctagon size={24} className="gradient-text"/>
            <h3>Feature Breakdown</h3>
           </div>
           
           <div className="bias-list">
             {features.length === 0 ? (
               <div style={{ color: "var(--text-muted)", padding: "20px 0" }}>
                 No bias detected or no distinct categorical columns found.
               </div>
             ) : (
               features.map((feat, idx) => {
                 const severityClass = feat.biasScore >= 70 ? 'severe' : (feat.biasScore >= 40 ? 'warning' : 'safe');
                 return (
                  <div key={idx} className={`bias-item ${severityClass}`}>
                    <div className="bias-header">
                      <span style={{ fontWeight: "700" }}>{feat.name}</span>
                      <span>Score: {feat.biasScore}</span>
                    </div>
                    <div className="bias-suggestion" style={{ marginTop: "6px", marginBottom: "6px" }}>
                      <strong>AI Insight:</strong> {feat.aiExplanation}
                    </div>
                    <div className="bias-suggestion">
                      {feat.suggestion}
                    </div>
                  </div>
                 )
               })
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
