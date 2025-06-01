import React, { useState } from 'react';
import Button from '../common/Button';  // Adjust the import path if needed
import { uploadImageToS3 } from '../../utils/uploadImageToS3'; // Adjust the import path as needed

const ImageUploadSection = ({
  value,
  onChange,
  label = 'Upload Image',
  disabled = false,
}) => {
  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    if (disabled || uploading) return;

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      // Show local preview while uploading
      setPreview(URL.createObjectURL(file));
      // Upload to S3, get URL
      const s3Url = await uploadImageToS3(file);
      setPreview(s3Url);
      onChange(s3Url);
    } catch (err) {
      alert('Failed to upload image.');
      setPreview('');
      onChange('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (disabled || uploading) return;
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
            className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled || uploading}
          />
        )}
        {uploading && <p className="text-xs text-primary-600 mt-1">Uploading...</p>}
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
              disabled={disabled || uploading}
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