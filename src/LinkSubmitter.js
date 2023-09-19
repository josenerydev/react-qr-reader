import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function LinkSubmitter() {
    const [link, setLink] = useState('');

    const containsQrCode = (link) => {
        return link.includes('qrcode');
    }

    const handlePaste = () => {
        navigator.clipboard.readText()
            .then(text => {
                setLink(text);
            })
            .catch(err => {
                console.error('Erro ao colar o texto: ', err);
                toast.error('Erro ao colar o texto.');
            });
    }

    const handleSubmit = async () => {
        if (!link.trim()) {
            toast.warn("Por favor, insira um link.");
            return;
        }

        if (!containsQrCode(link)) {
            toast.warn("O link inserido não é válido.");
            return;
        }

        try {
            const response = await fetch('https://api.dotnery.com/QrCode/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: link })
            });

            if (response.ok) {
                toast.success("Dados enviados com sucesso");
                setLink('');
            } else {
                toast.error("Erro ao enviar os dados: " + response.statusText);
            }
        } catch (error) {
            toast.error("Erro ao enviar os dados: " + error.message);
        }
    };

    return (
        <div className="link-wrapper">
            <input
                type="text"
                placeholder="Cole o link aqui"
                value={link}
                onChange={e => setLink(e.target.value)}
            />
            <div className="button-group">
                <button className="paste-button" onClick={handlePaste}>
                    <FontAwesomeIcon icon={faPaste} /> Colar
                </button>
                <button className="link-button" onClick={handleSubmit}>Enviar</button>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}

export default LinkSubmitter;
