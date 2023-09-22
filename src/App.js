// src\App.js

import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import LinkSubmitter from './LinkSubmitter';

function App() {
    useEffect(() => {
        console.log("Componente App montado");
    }, []);


    useEffect(() => {
        console.log("API URL:", process.env.REACT_APP_API_URL);
        console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
    }, []);


    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v3/userinfo?id_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    localStorage.setItem('userProfile', JSON.stringify(res.data));
                    return axios.post(`${process.env.REACT_APP_API_URL}/authenticate`, { token: user.access_token });
                })
                .then((backendResponse) => {
                    localStorage.setItem('authToken', backendResponse.data.token);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    useEffect(() => {
        const preventDefaultScroll = (e) => e.preventDefault();
        document.body.addEventListener('touchmove', preventDefaultScroll, { passive: false });

        return () => {
            document.body.removeEventListener('touchmove', preventDefaultScroll);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.info("Token:", token);
        const storedUserProfile = localStorage.getItem('userProfile');
        console.info("Stored User Profile:", localStorage.getItem('userProfile'));
        if (token && storedUserProfile) {
            axios.post(`${process.env.REACT_APP_API_URL}/Authenticate/verifyToken`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    console.info("Response:", response);
                    if (response.data.isValid) {
                        setProfile(JSON.parse(storedUserProfile));
                    } else {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userProfile');
                        setProfile(null);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userProfile');
                    setProfile(null);
                });
        }
    }, []);

    if (profile) {
        return (
            <div className="d-flex flex-column vh-100 bg-light m-0 p-0">
                <header className="bg-dark text-white">
                    <LinkSubmitter />
                </header>
            </div>
        );
    } else {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light m-0 p-0">
                <div className="text-center p-3">
                    <h2 className="mb-3 h4">Link QR NFC-e Share</h2>
                    <button onClick={() => login()} className="btn btn-primary btn-lg">
                        Sign in with Google 🚀
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
