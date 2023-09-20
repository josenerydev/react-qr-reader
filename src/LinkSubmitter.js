import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function LinkSubmitter() {
    const [link, setLink] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Novo estado para monitorar a requisição
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
        if (isLoading) return; // Se estiver carregando, saia

        if (!link.trim()) {
            if (!toast.isActive(toastIds.warn)) {
                const id = toast.warn("Por favor, insira um link.");
                setToastIds(prev => ({ ...prev, warn: id }));
            }
            return;
        }

        if (!containsQrCode(link)) {
            if (!toast.isActive(toastIds.warn)) {
                const id = toast.warn("O link inserido não é válido.");
                setToastIds(prev => ({ ...prev, warn: id }));
            }
            return;
        }

        setIsLoading(true); // Defina o estado de carregamento como true

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
        } finally {
            setIsLoading(false); // Defina o estado de carregamento como false, independentemente de sucesso ou falha
        }
    };

    const clearInput = () => {
        setLink('');
    }

    return (
        <div className="link-wrapper container">
            <div className="row">
                <div className="col-12">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cole o link aqui"
                            value={link}
                            onChange={e => setLink(e.target.value)}
                        />
                        {link && (
                            <div className="input-group-append">
                                <span className="input-group-text" onClick={clearInput}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-6 mb-2">
                    <button className="paste-button btn btn-outline-secondary w-100" onClick={handlePaste}>
                        <FontAwesomeIcon icon={faPaste} /> Colar
                    </button>
                </div>
                <div className="col-6">
                    <button 
                        className="link-button btn btn-outline-primary w-100" 
                        onClick={handleSubmit}
                        disabled={isLoading} // Desative o botão durante o carregamento
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}

export default LinkSubmitter;