// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHook } from '../hooks/useAuth'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthHook(); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);
      // Save user info to localStorage
      console.log(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      navigate('/chats'); // Redirect to /chats on successful login
    } catch (error) {
      console.error('Failed to login:', error.message);
      alert(error.message); // Optionally show an error message to the user
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #d4f8e8, #89f7a1)',
    margin: 0,
  },
  form: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    color: '#2e8b57',
    fontSize: '24px',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '0.5rem 0',
    border: '1px solid #89f7a1',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#2e8b57',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#3aa669',
  },
};

export default Login;
