import React, { useState } from 'react';

function LinkSubmitter() {
    const [link, setLink] = useState('');
    const [message, setMessage] = useState(null);

    const containsQrCode = (link) => {
        return link.includes('qrcode');
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
            <button className="link-button" onClick={handleSubmit}>Enviar</button>
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default LinkSubmitter;
