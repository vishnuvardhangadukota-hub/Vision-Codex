import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file, domain) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', domain);

    try {
      const response = await fetch("https://your-backend-url.onrender.com/api/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      console.log("Response:", result);

      setData(result);

    } catch (err) {
      console.error("ERROR:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
  };

  return (
    <div className="app-container">
      {!data ? (
        <UploadSection
          onUpload={handleFileUpload}
          loading={loading}
          error={error}
        />
      ) : (
        <Dashboard
          data={data}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;