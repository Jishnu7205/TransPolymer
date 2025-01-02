// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home" style={{ 
            textAlign: 'center', 
            padding: '50px 0', 
            fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            backgroundColor: '#f8f8f8'
        }}>
            <h1 style={{
                color: '#333',
                fontSize: '2.5em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                marginBottom: '30px'
            }}>Welcome to Property Prediction</h1>
            <nav style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '40px'
            }}>
                <Link
                    to="/signUp"
                    style={{
                        margin: '0 15px',
                        padding: '15px 30px',
                        textDecoration: 'none',
                        backgroundColor: '#5c7cfa',
                        color: 'white',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s, transform 0.3s',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        ':hover': {
                            backgroundColor: '#4c6ef5',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Sign Up
                </Link>
                <Link
                    to="/login"
                    style={{
                        margin: '0 15px',
                        padding: '15px 30px',
                        textDecoration: 'none',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s, transform 0.3s',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        ':hover': {
                            backgroundColor: '#059669',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Log In
                </Link>
            </nav>
        </div>
    );
};

export default Home;
