import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.svg';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setProcessedImage(null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:8000/remove-background', formData, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      setProcessedImage(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '2.5rem 0 1rem 0' }}>
        <div className="header-title">
          <img src={logo} alt="Logo" className="header-logo" />
          Background Remover
        </div>
        <div className="header-subtitle">
          Remove image backgrounds instantly and download the result!<br />
          <span style={{ color: '#fda085', fontWeight: 600 }}>Now with a more beautiful UI ✨</span>
        </div>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '2.7rem 2.2rem', maxWidth: 440, width: '100%' }}>
          <form onSubmit={e => { e.preventDefault(); handleUpload(); }}>
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
              className="file-input-custom"
            />
            {preview && (
              <img src={preview} alt="Preview" className="image-preview" />
            )}
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="button-main"
              style={{ width: '100%', marginTop: '1.2rem' }}
            >
              {loading ? 'Processing...' : 'Remove Background'}
            </button>
            {loading && <div className="spinner" />}
          </form>
          {processedImage && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <img src={processedImage} alt="Processed" className="image-preview" />
              <a
                href={processedImage}
                download="processed-image.png"
                className="download-link"
              >
                Download Image
              </a>
            </div>
          )}
        </div>
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Background Remover &mdash; Powered by AI
      </footer>
    </div>
  );
}

export default App;
