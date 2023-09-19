import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function LinkSubmitter() {
    const [link, setLink] = useState('');
    const [toastIds, setToastIds] = useState({
        error: null,
        warn: null,
        success: null
    });

    const containsQrCode = (link) => {
        return link.includes('qrcode');
    }

    const handlePaste = () => {
        if (!toast.isActive(toastIds.error)) {
            navigator.clipboard.readText()
                .then(text => {
                    setLink(text);
                })
                .catch(err => {
                    if (err.name === 'NotAllowedError') {
                        const id = toast.error('Por favor, permita o acesso à área de transferência.');
                        setToastIds(prev => ({ ...prev, error: id }));
                    } else {
                        console.error('Erro ao colar o texto: ', err);
                        const id = toast.error('Erro ao acessar a área de transferência.');
                        setToastIds(prev => ({ ...prev, error: id }));
                    }
                });
        }
    }

    const handleSubmit = async () => {
        // Se o link está vazio e o aviso não foi mostrado recentemente:
        if (!link.trim()) {
            if (!toast.isActive(toastIds.warn)) {
                const id = toast.warn("Por favor, insira um link.");
                setToastIds(prev => ({ ...prev, warn: id }));
            }
            return; // Pare a execução aqui para não enviar os dados.
        }

        // Se o link não contém 'qrcode' e o aviso não foi mostrado recentemente:
        if (!containsQrCode(link)) {
            if (!toast.isActive(toastIds.warn)) {
                const id = toast.warn("O link inserido não é válido.");
                setToastIds(prev => ({ ...prev, warn: id }));
            }
            return; // Pare a execução aqui para não enviar os dados.
        }

        // Se chegou aqui, tente enviar os dados:
        try {
            const response = await fetch('https://api.dotnery.com/QrCode/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: link })
            });

            if (response.ok && !toast.isActive(toastIds.success)) {
                const id = toast.success("Dados enviados com sucesso");
                setToastIds(prev => ({ ...prev, success: id }));
                setLink('');
            } else if (!toast.isActive(toastIds.error)) {
                const id = toast.error("Erro ao enviar os dados: " + response.statusText);
                setToastIds(prev => ({ ...prev, error: id }));
            }
        } catch (error) {
            if (!toast.isActive(toastIds.error)) {
                const id = toast.error("Erro ao enviar os dados: " + error.message);
                setToastIds(prev => ({ ...prev, error: id }));
            }
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
