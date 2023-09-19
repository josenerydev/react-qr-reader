import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste } from '@fortawesome/free-solid-svg-icons';

function LinkSubmitter() {
    const [link, setLink] = useState('');
    const [message, setMessage] = useState(null);

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
            });
    }

    const handleSubmit = async () => {
        if (!link.trim()) {
            setMessage("Por favor, insira um link.");
            return;
        }

        if (!containsQrCode(link)) {
            setMessage("O link inserido não é válido.");
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
                setMessage("Dados enviados com sucesso");
                setLink('');
            } else {
                setMessage("Erro ao enviar os dados: " + response.statusText);
            }
        } catch (error) {
            setMessage("Erro ao enviar os dados: " + error.message);
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
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default LinkSubmitter;
