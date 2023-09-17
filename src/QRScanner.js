import React from 'react';
import QrScanner from 'react-qr-scanner';

class QRScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: 'No result',
        };

        this.handleScan = this.handleScan.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.setState({
                result: data.text, // Aqui é a correção
            });
        }
    }

    handleError(err) {
        console.error(err);
    }

    render() {
        return (
            <div>
                <QrScanner
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ height: 240, width: 320 }}
                    facingMode="environment"
                />
                <p>{this.state.result}</p>
            </div>
        );
    }
}

export default QRScanner;