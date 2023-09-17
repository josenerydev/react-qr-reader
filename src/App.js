import React from 'react';
import './App.css';
import QRScanner from './QRScanner';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Leitor de QR Code NFC-e</h1>
                <QRScanner />
            </header>
        </div>
    );
}

export default App;
