import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for register
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!isLogin) {
            try {
                const response = await axios.post('http://localhost:3001/api/auth/register', { userName, password });
                console.log(response.data);
                onAuthSuccess();
            } catch (error) {
                setError(error.response.data.error);
            }
        }
        else {
            try {
                const response = await axios.post('http://localhost:3001/api/auth/login', { userName, password });
                // console.log(response.data); // Assuming this includes the user's ID and/or other info
                onAuthSuccess(response.data.userId); // Pass user data on successful authentication
            } catch (error) {
                setError(error.response?.data?.error || "An error occurred during login.");
            }
        }
    };

    return (
        <div>
            <button onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? 'Register' : 'Login'}
            </button>
            <form onSubmit={handleSubmit}>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                {!isLogin && (
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                )}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            {error && <p>{error}</p>}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default AuthForm;
