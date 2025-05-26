import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// import styles from './Register.module.scss'; // You will create this

const RegisterPage = () => {
  const [username, setUsername] = useState(''); // Or name, based on UserRegisterRequest
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add other fields as per UserRegisterRequest.java (e.g., name, confirmPassword)
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Add form validation (e.g., password match)
    try {
      // Ensure the object matches UserRegisterRequest.java
      await register({ username, email, password /*, other fields */ });
      navigate('/login'); // Navigate to login after registration
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    // <div className={styles.registerContainer}>
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label> {/* Or Name */}
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {/* Add confirm password field if needed */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default RegisterPage;
