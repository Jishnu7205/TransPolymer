import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/signUp', formData);
            alert(response.data.message);

            // Store the JWT token and userId in localStorage after signup
            localStorage.setItem('jwtToken', response.data.token);
            localStorage.setItem('userId', response.data.user.id);

            // Navigate to prediction page after successful signup
            navigate(`/create-prediction/${response.data.user.id}`,
                { 
                    state: { 
                      email: response.data.user.email,
                      username: response.data.user.username
                    } 
                }
            );
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <h2
                style={{
                    color: '#4CAF50',
                    marginBottom: '30px',
                    fontSize: '3rem',
                }}
            >
                Sign Up
            </h2>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '300px',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    padding: '40px',
                    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    style={{
                        marginBottom: '20px',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #ccc',
                        width: '100%',
                        fontSize: '1.2rem',
                    }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    style={{
                        marginBottom: '20px',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #ccc',
                        width: '100%',
                        fontSize: '1.2rem',
                    }}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    style={{
                        marginBottom: '20px',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #ccc',
                        width: '100%',
                        fontSize: '1.2rem',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '15px 30px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = '#45a049')
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#4CAF50')
                    }
                >
                    Sign Up
                </button>
            </div>
        </form>
    );
};

export default Signup;
