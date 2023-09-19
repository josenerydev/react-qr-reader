import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';

function QRScanner() {
    const [result, setResult] = useState('');
    const [scanned, setScanned] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 segundos

        return () => clearTimeout(timer);
    }, []);

    const handleScan = data => {
        if (data) {
            setResult(data.text);
            setScanned(true);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://api.dotnery.com/QrCode/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: result })
            });

            if (response.ok) {
                window.alert("Dados enviados com sucesso");
                setScanned(false);
                setResult('');
            } else {
                window.alert("Erro ao enviar os dados: " + response.statusText);
            }
        } catch (error) {
            window.alert("Erro ao enviar os dados: " + error.message);
        }
    };

    const handleError = err => {
        window.alert("Erro ao escanear: " + err.message);
    };

    const toggleCamera = () => {
        setFacingMode(prevMode => prevMode === 'environment' ? 'user' : 'environment');
    };

    return (
        <div className="qr-wrapper">
            {isLoading ? <p className="qr-status">Carregando componente...</p> :
                !scanned && <p className="qr-status">Aguarde a leitura do QR Code...</p>}

            <div className="qr-scanner-container">
                <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%', height: '100%' }}
                    constraints={{ video: { facingMode } }}
                />
                <div className="qr-overlay"></div>
            </div>
            <button className="qr-button" onClick={toggleCamera}>Trocar Câmera</button>
            {scanned && (
                <div className="qr-scanned">
                    <p>{result}</p>
                    <button className="qr-button" onClick={handleSubmit}>Enviar</button>
                </div>
            )}
        </div>
    );
}

export default QRScanner;
