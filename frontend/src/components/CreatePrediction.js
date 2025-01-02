import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import Modal from './Modal'; // Import the Modal component

const PredictionPage = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('Ready to predict');
    const [isLoading, setIsLoading] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [imageData, setImageData] = useState(null);  // State to store the image data
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage the modal visibility
    const { userId } = useParams();

    // Helper to retrieve the token from localStorage
    const getToken = () => localStorage.getItem('jwtToken');

    // Check for token and redirect if missing
    const token = getToken();
    if (!token) {
        alert('Access denied. Please log in to access this page.');
        return <Navigate to="/login" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAnswer('Fetching prediction...');

        try {
            const response = await axios.post(
                `http://localhost:8080/prediction/predict`,
                { userId, question },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAnswer(response.data.prediction.answer);
            setQuestion("");
            await handleFetchPredictions(); // Refetch predictions after submitting
        } catch (err) {
            setAnswer('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchPredictions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/prediction/getAllPredictions?userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPredictions(response.data.predictions);
        } catch (err) {
            console.error('Error fetching predictions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVisualizeImage = async (smiles) => {
        console.log('SMILES:', smiles); // Log the SMILES string
        setIsLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:8080/generate/generate-molecule-image`,
                { smiles },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setImageData(response.data.fileData);
            setIsModalOpen(true); // Open the modal with the generated image
        } catch (err) {
            console.error('Error generating image:', err);
            setImageData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal when clicked
        setImageData(null);    // Optionally reset the image data
    };

    return (
        <div
            style={{
                padding: '40px 0',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                fontFamily: "'Lato', sans-serif",
            }}
        >
            <h1 style={{ color: '#333', fontSize: '2.5em', marginBottom: '30px' }}>
                Prediction Tool
            </h1>

            <div
                style={{
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        width: '80%',
                        maxWidth: '600px',
                    }}
                >
                    <textarea
                        name="question"
                        placeholder="Enter your question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        style={{
                            width: '95%',
                            height: '150px',
                            padding: '15px',
                            fontSize: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            resize: 'none',
                        }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            marginTop: '20px',
                            padding: '15px 30px',
                            fontSize: '16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>

            <div
                style={{
                    marginTop: '30px',
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
            >
                <h2 style={{ color: '#333', marginBottom: '15px' }}>Prediction Result</h2>
                <p style={{ fontSize: '18px', fontStyle: 'italic', color: '#666' }}>{answer}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <button
                    onClick={handleFetchPredictions}
                    disabled={isLoading}
                    style={{
                        padding: '15px 30px',
                        fontSize: '16px',
                        backgroundColor: '#008CBA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {isLoading ? 'Fetching...' : 'Fetch All Predictions'}
                </button>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ color: '#333', marginBottom: '20px' }}>All Predictions</h2>
                {predictions.length > 0 ? (
                    <ul
                        style={{
                            listStyleType: 'none',
                            padding: '0',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {predictions.map((pred, index) => (
                            <li
                                key={index}
                                style={{
                                    background: 'white',
                                    padding: '20px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                }}
                            >
                                <p>
                                    <strong>Question:</strong> {pred.question}
                                </p>
                                <p>
                                    <strong>Answer:</strong> {pred.answer}
                                </p>
                                {/* Visualize Image Button */}
                                <button
                                    onClick={() => handleVisualizeImage(pred.question)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#FF5733',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginTop: '10px',
                                    }}
                                >
                                    Visualize Image
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#888' }}>No predictions found.</p>
                )}
            </div>

            {/* Modal for image display */}
            <Modal isOpen={isModalOpen} imageData={imageData} onClose={closeModal} />
        </div>
    );
};

export default PredictionPage;
