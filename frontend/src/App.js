import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Register';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import Header from './components/Header'; // Import your Header component
import Footer from './components/Footer';

export default function App() {
    const [token, setToken] = useState(null);
    const [totalTodos, setTotalTodos] = useState(0);
    const [completedTodos, setCompletedTodos] = useState(0);

    const handleLogin = (token) => {
        setToken(token);
    };

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Registration />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route 
                        path="/todo" 
                        element={
                            token ? (
                                <>
                                    <Header /> {/* Show Header after login */}
                                    <TodoApp 
                                        setTotalTodos={setTotalTodos} 
                                        setCompletedTodos={setCompletedTodos} 
                                        token={token} 
                                    />
                                    <Footer completedTodos={completedTodos} totalTodos={totalTodos} /> {/* Show Footer after login */}
                                </>
                            ) : (
                                <Navigate to="/login" />
                            )
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}
