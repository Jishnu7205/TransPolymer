import React from 'react';

const Modal = ({ isOpen, imageData, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
                <img src={imageData} alt="Molecule" style={imageStyle} />
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px',
    backgroundColor: '#FF5733',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
};

const imageStyle = {
    width: '100%',
    maxWidth: '600px',
};

export default Modal;
