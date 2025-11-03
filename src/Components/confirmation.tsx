import React from 'react';
import { useLocation } from 'react-router-dom';
import './cornfimation.css'

const Confirmation = () => {
  const { state } = useLocation();
  const paymentId = state?.paymentId;

  return (
    <div className="confirmation-container">
      <h2>Payment Successful! 🎉</h2>
      {paymentId && (
        <div className="payment-details">
          <p>Payment ID: {paymentId}</p>
          <p>Thank you for your purchase!</p>
        </div>
      )}
    </div>
  );
};
export default Confirmation