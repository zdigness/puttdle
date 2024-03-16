import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import config from './gameConfig';
import WinModal from './WinModal';

const Puttdle: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [score, setScore] = useState(10);

    useEffect(() => {
        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            game.destroy(true);
        };
    }, []);

    useEffect(() => {
        const game = gameRef.current;

        game?.events.on('win', (data: { score: number }) => {
            console.log('You win! Score:', data.score);
            setScore(data.score);
            setIsModalOpen(true);
            console.log('Modal open')
        });
    }
    , [gameRef]);

    return (
        <>
            <div id="gameCanvas"></div>
            { isModalOpen &&
                <WinModal score={score}/>
            }
        </>
    );
};

export default Puttdle;