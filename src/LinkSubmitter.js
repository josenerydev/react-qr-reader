import React, { useState } from 'react';

function LinkSubmitter() {
    const [link, setLink] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://api.dotnery.com/QrCode/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: link })
            });

            if (response.ok) {
                window.alert("Dados enviados com sucesso");
                setLink('');
            } else {
                window.alert("Erro ao enviar os dados: " + response.statusText);
            }
        } catch (error) {
            window.alert("Erro ao enviar os dados: " + error.message);
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
        </div>
    );
}

export default LinkSubmitter;
