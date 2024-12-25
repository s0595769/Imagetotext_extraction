import React, { useState } from 'react';
import AWS from 'aws-sdk';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // AWS Configuration
  AWS.config.update({
    region: 'us-east-1', // Replace with your region
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx', // Replace with your Identity Pool ID
    }),
  });

  const s3 = new AWS.S3();
  const rekognition = new AWS.Rekognition();
  const bucketName = 'image-to-text-storages'; // Your bucket name

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setExtractedText('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);

    // Upload to S3
    const params = {
      Bucket: bucketName,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    try {
      const uploadResponse = await s3.upload(params).promise();
      console.log('File uploaded successfully:', uploadResponse);

      // Extract text using Rekognition
      const rekognitionParams = {
        Image: {
          S3Object: {
            Bucket: bucketName,
            Name: file.name,
          },
        },
      };

      const rekognitionResponse = await rekognition.detectText(rekognitionParams).promise();

      const text = rekognitionResponse.TextDetections.map((text) => text.DetectedText).join(' ');
      setExtractedText(text);
    } catch (err) {
      setError('Error uploading file or extracting text: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Upload Image for Text Extraction</h1>

      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {extractedText && (
        <div className="result">
          <h2>Extracted Text</h2>
          <p>{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default App;
