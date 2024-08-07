import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css'; // Import the CSS file

const Results: React.FC = () => {
  const result: any = JSON.parse(localStorage.getItem('result') || 'null');
  const navigate = useNavigate();

  // Function to clear token and redirect to home page
  const handleHomeRedirect = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentId');
    localStorage.removeItem('token');

    navigate('/');
  };

  return (
    <div className="results-container">
      <h1 className="results-heading">Your Performance Summary</h1>
      {result ? (
        <div className="results-summary">
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Total Questions:</strong> {result.total}</p>
          <p><strong>Questions Attended:</strong> {result.attended}</p>
        </div>
      ) : (
        <p>No results available.</p>
      )}
      <button className="home-button" onClick={handleHomeRedirect}>Go to Home</button>
    </div>
  );
};

export default Results;
