import React, { useState, useRef } from 'react';
import axios from 'axios';

const HumanVerification = ({ userId, token, onVerified }) => {
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setMessage('Unable to access camera'));
  };

  const captureAndVerify = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    try {
      const response = await axios.post('/api/auth/human-verification', {
        userId,
        biometricData: imageData,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.verified) {
        setMessage('Verification successful!');
        onVerified();
      } else {
        setMessage('Verification failed. Please try again.');
      }
    } catch {
      setMessage('Verification error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Human Verification</h2>
      <video ref={videoRef} autoPlay muted className="w-full rounded mb-4" />
      <button onClick={startCamera} className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition">Start Camera</button>
      <button onClick={captureAndVerify} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Verify</button>
      {message && <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>}
    </div>
  );
};

export default HumanVerification;
