// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Loading state for submit button
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading state
        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });

            if (response.data.success) {
                // Assume the response contains both the user id and the JWT token
                const { user, token } = response.data;

                // Store the JWT in localStorage/sessionStorage (for example, in localStorage)
                localStorage.setItem('jwtToken', token); // Storing the JWT token
                // Optionally, store the user ID separately if needed for some other purposes
                localStorage.setItem('userId', user.id); // Storing the userId for navigation or other actions
                
                // Redirect to dashboard after successful login
                navigate(`/create-prediction/${response.data.user.id}`, { state: { userId: response.data.user.id } });
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error("Login error:", error); // For debugging purposes
            alert('An error occurred during login.');
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#eef2f5',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '60px',
              borderRadius: '15px',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <h1
              style={{
                color: '#4CAF50',
                textAlign: 'center',
                marginBottom: '40px',
                fontSize: '2.5rem',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Log In
            </h1>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    marginBottom: '20px',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                    width: '100%',
                    fontSize: '1.2rem',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    marginBottom: '20px',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                    width: '100%',
                    fontSize: '1.2rem',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '15px',
                  backgroundColor: isLoading ? '#aaa' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%',
                  fontSize: '1.5rem',
                  fontFamily: "'Roboto', sans-serif",
                  transition: 'background-color 0.3s ease',
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      );
      
};

export default Login;
