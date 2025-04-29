import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = ({ onLoginSuccess }) => {
  const onSuccess = async (response) => {
    try {
      const res = await axios.post('/api/auth/google-login', { token: response.tokenId });
      onLoginSuccess(res.data);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const onFailure = (response) => {
    console.error('Google login failed', response);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Login;
