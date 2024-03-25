import React from 'react';
import './Welcome.css';

function Welcome() {
    return (
        <div className="Welcome">
        <header className="Welcome-header">
            <p>
            Welcome to Puttdle!
            </p>
            <a
            className="Welcome-link"
            href="http://localhost:3000/api/google-login"
            rel="noopener noreferrer"
            >
            Login with Google
            </a>
        </header>
        </div>
    );
}

export default Welcome