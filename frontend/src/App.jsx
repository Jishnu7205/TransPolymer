// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './components/Home';
// import Signup from './components/Signup';
// import Login from './components/Login';
// // import Predictions from './components/Predictions';
// import CreatePrediction from './components/CreatePrediction';
// import './App.css';

// const App = () => {
//     return (
//         <Router>
//             <div className="App">
             
//                 <Routes>
//                     <Route exact path="/" element={<Home/>} />
//                     <Route path="/signUp" element={<Signup/>} />
//                     <Route path="/login" element={<Login/>} />
//                     {/* <Route path="/predictions" element={<Predictions/>} /> */}
//                     <Route path="/create-prediction/:userId" element={<CreatePrediction/>} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App;


// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import CreatePrediction from './components/CreatePrediction';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/signUp" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/create-prediction/:userId"
                        element={
                            <ProtectedRoute>
                                <CreatePrediction />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
