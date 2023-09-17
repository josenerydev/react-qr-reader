import React from 'react';
import QrScanner from 'react-qr-scanner';

class QRScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            scanned: false,
            facingMode: 'environment',  // Default to the back camera
        };

        this.handleScan = this.handleScan.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleCamera = this.toggleCamera.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.setState({
                result: data.text,
                scanned: true
            });
        }
    }

    async handleSubmit() {
        const { result } = this.state;

        try {
            const response = await fetch('https://localhost:5001/WeatherForecast/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: result })
            });

            if (response.ok) {
                window.alert("Dados enviados com sucesso");
            } else {
                window.alert("Erro ao enviar os dados: " + response.statusText);
            }
        } catch (error) {
            window.alert("Erro ao enviar os dados: " + error.message);
        }
    }

    handleError(err) {
        window.alert("Erro ao escanear: " + err.message);
    }

    toggleCamera() {
        this.setState(prevState => ({
            facingMode: prevState.facingMode === 'environment' ? 'user' : 'environment'
        }));
    }

    render() {
        const { scanned, result, facingMode } = this.state;

        return (
            <div>
                {!scanned && <p>Componente QRScanner está sendo renderizado!</p>}
                <QrScanner
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ height: 240, width: 320 }}
                    constraints={{ video: { facingMode } }}
                />
                <button onClick={this.toggleCamera}>Trocar Câmera</button>
                {scanned && (
                    <div>
                        <p>{result}</p>
                        <button onClick={this.handleSubmit}>Enviar</button>
                    </div>
                )}
            </div>
        );
    }
}

export default QRScanner;
