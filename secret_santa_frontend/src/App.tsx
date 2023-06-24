import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

type RegistrationResponse = {
  message: string;
};
/*
const FlipCard: React.FC<{ value: number }> = ({ value }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [value]);

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="countdown-value">{value}</div>
        </div>
        <div className="flip-card-back">
          <div className="countdown-value">{value}</div>
        </div>
      </div>
    </div>
  );
};*/

const FlipCard: React.FC<{ value: number }> = ({ value }) => {
  const [flipped, setFlipped] = useState(false);
  const [prevValue, setPrevValue] = useState<number | null>(null);

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
      setFlipped(true);

      const timeout = setTimeout(() => {
        setFlipped(false);
      }, 600);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [value, prevValue]);

  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="countdown-value">{prevValue}</div>
        </div>
        <div className="flip-card-back">
          <div className="countdown-value">{value}</div>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post<RegistrationResponse>('/api/users', { name, address, email });
      setRegistrationMessage('Registration successful!');
      setRegistrationError('');
    } catch (error: any) {
      setRegistrationError('Registration failed. Please try again.');
      if (error.response && error.response.data && error.response.data.message) {
        setRegistrationError(error.response.data.message);
      }
      setRegistrationMessage('');
    }
  };

  const calculateCountdown = () => {
    const now = new Date();
    const deadline = new Date(now.getFullYear(), 10, 1); // November 1 (month is zero-based)

    const timeRemaining = deadline.getTime() - now.getTime();
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    setCountdown({ days, hours, minutes, seconds });
  };

  useEffect(() => {
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="App">
      <h1 className="heading">Secret Santa Registration</h1>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {registrationMessage && (
        <div className="success-message">
          <p>{registrationMessage}</p>
          <button onClick={() => setRegistrationMessage('')}>Close</button>
        </div>
      )}
      {registrationError && (
        <div className="error-message">
          <p>{registrationError}</p>
          <button onClick={() => setRegistrationError('')}>Close</button>
        </div>
      )}
      <div className="countdown">
        Countdown:
        <div className="countdown-timer">
          <div className="countdown-item">
            <FlipCard value={countdown.days} />
            <div className="countdown-label">Days</div>
          </div>
          <div className="countdown-item">
            <FlipCard value={countdown.hours} />
            <div className="countdown-label">Hours</div>
          </div>
          <div className="countdown-item">
            <FlipCard value={countdown.minutes} />
            <div className="countdown-label">Minutes</div>
          </div>
          <div className="countdown-item">
            <FlipCard value={countdown.seconds} />
            <div className="countdown-label">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

