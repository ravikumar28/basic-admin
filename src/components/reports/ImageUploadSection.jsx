import React, { useState } from 'react';
import Button from '../common/Button';

const ImageUploadSection = ({ value, onChange, label = 'Upload Image', disabled = false }) => {
  const [preview, setPreview] = useState(value || '');
  
  // In a real application, you'd handle the file upload to a server
  // and get back the URL. For this example, we'll simulate it.
  const handleImageChange = (e) => {
    if (disabled) return;
    
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Create a URL for preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    // In a real application, you'd upload the image and get a URL
    // For this example, we'll just simulate getting a URL back
    const simulatedUploadedUrl = `https://example.com/images/${file.name}`;
    onChange(simulatedUploadedUrl);
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="form-group">
        <label className="form-label mb-2">{label}</label>
        {!disabled && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          />
        )}
        {!disabled && (
          <p className="mt-1 text-xs text-gray-500">
            Upload an image related to {label.toLowerCase()} (max 5MB)
          </p>
        )}
      </div>
      
      {preview && (
        <div className="mt-4">
          <div className="border rounded-lg overflow-hidden">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-h-64 object-contain"
            />
          </div>
          
          {!disabled && (
            <Button 
              variant="secondary" 
              className="mt-2"
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              Remove Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;