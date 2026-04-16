import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import axios from 'axios'; // ✅ IMPORTANT

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file, domain) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', domain || 'General'); // ✅ fallback

    try {
      const response = await axios.post(
        'https://supportive-renewal-production-2f61.up.railway.app/api/upload', // ✅ NEW RAILWAY URL
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