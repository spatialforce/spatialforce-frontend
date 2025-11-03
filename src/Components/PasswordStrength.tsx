import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  // Calculate password strength
  const passwordStrength = zxcvbn(password);

  // Define strength levels and colors
  const strengthLevels = [
    { label: 'Very Weak', color: 'red' },
    { label: 'Weak', color: 'orange' },
    { label: 'Moderate', color: 'yellow' },
    { label: 'Strong', color: 'green' },
    { label: 'Very Strong', color: 'darkgreen' },
  ];

  // Get the current strength level
  const strengthLevel = strengthLevels[passwordStrength.score];

  return (
    <div className="password-strength">
      <p>Password Strength: <strong>{strengthLevel.label}</strong></p>
      <div className="strength-bar">
        <div
          className="bar"
          style={{
            width: `${(passwordStrength.score + 1) * 20}%`,
            backgroundColor: strengthLevel.color,
          }}
        ></div>
      </div>
      {passwordStrength.feedback.suggestions.length > 0 && (
        <div className="suggestions">
          <p>Suggestions:</p>
          <ul>
            {passwordStrength.feedback.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;