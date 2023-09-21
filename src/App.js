// react-qr-reader\src\App.js

import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import LinkSubmitter from './LinkSubmitter';

function App() {

    console.log("API URL:", process.env.REACT_APP_API_URL);
    console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useGoogleLogin({
        
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (user) {
            // Primeiro, vamos validar o token com o Google
            axios
                .get(`https://www.googleapis.com/oauth2/v3/userinfo?id_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    // Aqui, após validação bem-sucedida com o Google, enviaremos o token ao nosso backend
                    console.log("User:", user);
                    return axios.post(process.env.REACT_APP_API_URL + '/authenticate', { token: user.access_token });
                })
                .then((backendResponse) => {
                    // Lide com a resposta do backend (por exemplo, salvar o token JWT em local storage se for o caso)
                    localStorage.setItem('authToken', backendResponse.data.token);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    if (profile) {
        return (
            // Aqui é onde a sua tela original vai ser renderizada.
            <LinkSubmitter />
        );
    } else {
        return (
            <div>
                <h2>React Google Login</h2>
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            </div>
        );
    }
}

export default App;
