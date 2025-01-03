import React, { useState } from "react";
import axios from "axios";
import { useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Import the Modal component
import "../styles/CreatePrediction.css"; // Import the CSS file

const PredictionPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Ready to predict");
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [imageData, setImageData] = useState(null); // State to store the image data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage the modal visibility
  const { userId } = useParams();
  const navigate = useNavigate();

  const location = useLocation(); // Import useLocation from react-router-dom
  const { email, username } = location.state || {};
  
  
  // Helper to retrieve the token from localStorage
  const getToken = () => localStorage.getItem("jwtToken");

  // Check for token and redirect if missing
  const token = getToken();
  if (!token && window.location.pathname !== "/login") {
    alert("Access denied. Please log in to access this page.");
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAnswer("Fetching prediction...");

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
      setAnswer("An error occurred. Please try again.");
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
      console.error("Error fetching predictions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualizeImage = async (smiles) => {
    // console.log("SMILES:", smiles); // Log the SMILES string
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
      console.error("Error generating image:", err);
      setImageData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal when clicked
    setImageData(null); // Optionally reset the image data
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove the JWT token from localStorage
    navigate("/login"); // Redirect to the login page
  };


  return (
    <div className="prediction-page">
      <div className="user-info">
        <div className="user-avatar">
          <img src="/avatar.jpg" alt="Avatar" />
        </div>
        <div className="user-details">
          <p>{username}</p>
          <p>{email}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h1>Prediction Tool</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="prediction-form">
          <textarea
            name="question"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="prediction-result">
        <h2>Prediction Result</h2>
        <p>{answer}</p>
      </div>

      <div>
        <button
          onClick={handleFetchPredictions}
          disabled={isLoading}
          style={{padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginTop: '16px'}}
        >
          {isLoading ? "Fetching..." : "Fetch All Predictions"}
        </button>
      </div>

      <div className="predictions-list">
        <h2>All Predictions</h2>
        {predictions.length > 0 ? (
          <ul>
            {predictions.map((pred, index) => (
              <li key={index}>
                <p>
                  <strong>Question:</strong> {pred.question}
                </p>
                <p>
                  <strong>Answer:</strong> {pred.answer}
                </p>
                <button
                  onClick={() => handleVisualizeImage(pred.question)}
                  className="visualize-button"
                >
                  Visualize Image
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No predictions found.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} imageData={imageData} onClose={closeModal} />
    </div>
  );
};

export default PredictionPage;
