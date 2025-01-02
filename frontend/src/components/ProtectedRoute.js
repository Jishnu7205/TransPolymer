// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//     // Check for JWT token in localStorage
//     const token = localStorage.getItem('jwtToken');

//     if (!token) {
//         // Show an alert with a custom message
//         alert('Access denied. Please log in to access this page.');

//         // Render a link to redirect users to the login page
//         return (
//             <div style={{ textAlign: 'center', marginTop: '20px' }}>
//                 <p>You need to log in to access this page.</p>
//                 <Link
//                     to="/login"
//                     style={{
//                         display: 'inline-block',
//                         padding: '10px 20px',
//                         backgroundColor: '#007BFF',
//                         color: 'white',
//                         textDecoration: 'none',
//                         borderRadius: '4px',
//                     }}
//                 >
//                     Go to Login
//                 </Link>
//             </div>
//         );
//     }

//     // Render children if token exists
//     return children;
// };

// export default ProtectedRoute;


// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('jwtToken'); // Check if token exists
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
