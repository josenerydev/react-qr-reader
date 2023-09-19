import React from 'react';
import './App.css';
import LinkSubmitter from './LinkSubmitter';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Envie o link do QR Code NFC-e</h1>
                <LinkSubmitter />
            </header>
        </div>
    );
}

export default App;
