import React, { useState } from 'react';
import './fileupload.css';

interface FileUploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void; 
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [uploadData, setUploadData] = useState({
    title: '',
    dataType: 'firepoint',
    file: null as File | null
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file extension based on data type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const isFirepoint = uploadData.dataType === 'firepoint';
      const isValidExtension = 
        (isFirepoint && fileExt === 'csv') || 
        (!isFirepoint && (fileExt === 'json' || fileExt === 'geojson'));
      
      if (!isValidExtension) {
        const requiredType = isFirepoint ? 'CSV' : 'JSON/GeoJSON';
        setMessage({ 
          text: `Please upload a ${requiredType} file for ${uploadData.dataType} data`, 
          type: 'error' 
        });
        return;
      }
      
      setUploadData(prev => ({ ...prev, file }));
      setMessage({ text: '', type: '' });
    }
  };

 
// FileUploadModal.tsx
const confirmAdminUpload = () => {
  const confirmed = window.confirm(
    `You must be a superuser to upload data.\n\nContinue to admin portal?`
  );
  
  if (confirmed) {
    const params = new URLSearchParams();
    params.append('title', uploadData.title);
    params.append('data_type', uploadData.dataType);
    
    // Use the custom URL pattern we defined
    window.open(
      `http://localhost:8000/admin/Firetracker/firepointupload/upload/?${params.toString()}`, 
      '_blank'
    );
    onClose();
  }
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) {
      setMessage({ text: 'Please select a file', type: 'error' });
      return;
    }

    confirmAdminUpload();
  };

  return (
    <div className="file-upload-modal-overlay">
      <div className="file-upload-modal-container">
        <h2 className="file-upload-modal-title">Upload Geographic Data</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="file-upload-input-group">
            <label className="file-upload-label">Title</label>
            <input
              type="text"
              name="title"
              value={uploadData.title}
              onChange={handleInputChange}
              className="file-upload-input"
              required
            />
          </div>

          <div className="file-upload-input-group">
            <label className="file-upload-label">Data Type</label>
            <select
              name="dataType"
              value={uploadData.dataType}
              onChange={handleInputChange}
              className="file-upload-select"
            >
              <option value="firepoint">Fire Points (CSV)</option>
              <option value="province">Provinces (JSON/GeoJSON)</option>
              <option value="district">Districts (JSON/GeoJSON)</option>
            </select>
          </div>

          <div className="file-upload-input-group">
            <label className="file-upload-label">
              Select {uploadData.dataType === 'firepoint' ? 'CSV' : 'JSON/GeoJSON'} File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-upload-file-input"
              accept={uploadData.dataType === 'firepoint' ? '.csv' : '.json,.geojson'}
              required
            />
          </div>

          {message.text && (
            <div className={`file-upload-message file-upload-message-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="file-upload-button-group">
            <button
              type="button"
              onClick={onClose}
              className="file-upload-cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="file-upload-submit-button"
            >
              Continue to Admin Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;