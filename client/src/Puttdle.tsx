import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from './gameConfig';

const Puttdle: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div id="gameCanvas"></div>
    );
};

export default Puttdle;