import React from 'react';
import './Welcome.css';

function Welcome({isWelcome, onPlayToggle}) {
    return (
        <>
        <div className="container">
            <div className="welcome">
                <h1>PUTTDLE!</h1>
                <p>New courses everyday</p>
                <p>make your shots in the least strokes possible!</p>
            </div>
            <div className="play">
                <button className="playbutton" onClick={onPlayToggle}>
                    {isWelcome ? 'Play' : 'Back'}
                </button>
            </div>
        </div>
        </>
    );
}

export default Welcome