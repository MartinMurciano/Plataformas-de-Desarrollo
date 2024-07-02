import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Welcome from './components/Welcome';
import Register from './components/Register';
import Login from './components/Login';
import EventDetails from './components/EventDetails';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/welcome');
                setUsername(response.data.username);
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            setIsLoggedIn(false);
            setUsername('');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Router>
            <Header username={username} handleLogout={handleLogout} />
            <Routes>
                <Route path="/register" element={<Register setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/login" element={<Login setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/" element={<Welcome isLoggedIn={isLoggedIn} username={username} />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
