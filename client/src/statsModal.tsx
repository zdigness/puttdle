import React from 'react';
import './statsModal.css';

interface StatsModalProps {
    score: number;
    streak: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ score, streak }) => {
    return (
        <div className="modal-content">
            <h1>Your Stats</h1>
            <p>Score: {score}</p>
            <p>Streak: {streak}</p>  
        </div>
    );
};

export default StatsModal;