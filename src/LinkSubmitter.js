// src\LinkSubmitter.js

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste, faTimes, faLink } from '@fortawesome/free-solid-svg-icons';
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
            const response = await fetch(process.env.REACT_APP_API_URL + '/QrCode/send', {
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
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-3 bg-white rounded m-3">
                <div className="card-body">
                    <h1 className="card-title h4 mb-4 text-dark text-center font-weight-bold">
                        <FontAwesomeIcon icon={faLink} className="mr-2" />
                        Envie o link do QR Code NFC-e
                    </h1>
                    <div className="container-fluid">
                        <div className="row mb-3">
                            <div className="col-12 px-2">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
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
                            <div className="col-12 col-md-6 mb-2 px-2">
                                <button className="paste-button btn btn-outline-secondary btn-lg btn-block" onClick={handlePaste}>
                                    <FontAwesomeIcon icon={faPaste} /> Colar
                                </button>
                            </div>
                            <div className="col-12 col-md-6 px-2">
                                <button
                                    className="link-button btn btn-outline-primary btn-lg btn-block"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar'}
                                </button>
                            </div>
                        </div>
                        <ToastContainer position="top-right" autoClose={5000} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LinkSubmitter;