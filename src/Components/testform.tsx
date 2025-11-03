import React, { useRef } from 'react';
import './testform.css';

const PasswordInput = () => {
  const passwordRef = useRef(null);

  const handleFocus = () => {
    navigator.credentials.get({
      password: {
        name: 'Your Website Name',
        length: 12,
      },
    }).then((credential) => {
      if (credential && credential.password) {
        passwordRef.current.value = credential.password;
      }
    }).catch((error) => {
      console.error('Error generating password:', error);
    });
  };

  return (
    <div className="container">
      <h1>Create Account</h1>
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        ref={passwordRef}
        onFocus={handleFocus}
        autoComplete="new-password"
        placeholder="Generated Password"
      />
      <p>Click the input to generate a strong password.</p>
    </div>
  );
};

export default PasswordInput;