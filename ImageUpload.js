import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  // State variables to handle image, loading state, and extracted text
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState(null);

  // Handle file input change (when an image is selected)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle the image upload and API call
  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setError(null); // Reset error message

    try {
      // Make POST request to your API Gateway endpoint
      const response = await axios.post('https://your-api-id.execute-api.us-east-1.amazonaws.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle response with extracted text
      setExtractedText(response.data.extractedText || 'No text found.');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <h1>Upload an Image for Text Extraction</h1>

      {/* Input for selecting an image */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Upload button */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Show loading message */}
      {loading && <p>Processing image...</p>}

      {/* Show error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display extracted text */}
      {extractedText && !loading && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
