import React from 'react';
import QrScanner from 'react-qr-scanner';

class QRScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            scanned: false,
        };

        this.handleScan = this.handleScan.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                console.log("Dados enviados com sucesso");
            } else {
                console.error("Erro ao enviar os dados", response);
            }
        } catch (error) {
            console.error("Erro ao enviar os dados", error);
        }
    }

    handleError(err) {
        console.error(err);
    }

    render() {
        const { scanned, result } = this.state;

        return (
            <div>
                {!scanned && <p>Componente QRScanner está sendo renderizado!</p>}
                <QrScanner
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ height: 240, width: 320 }}
                    facingMode={{ exact: "environment" }}
                />
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
