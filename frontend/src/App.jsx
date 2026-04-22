import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file, domain) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', domain || 'General');

    try {
      const response = await axios.post(
        'https://vision-codex-1.onrender.com/api/upload', // ✅ FIXED HERE
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Response:", response.data);
      setData(response.data);

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