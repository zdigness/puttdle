import './Welcome.css';

function Welcome({isWelcome, onPlayToggle}: {isWelcome: boolean, onPlayToggle: () => void}) {
    return (
        <>
        <div className="container">
            <img src="../public/assets/icons8-golf-100.png"></img>
            <h1>PUTTDLE!</h1>
            <h2>New courses everyday</h2>
            <h2>Make a shot in the least strokes possible!</h2>
            <button className="playbutton" onClick={onPlayToggle}>
                {isWelcome ? 'Play' : 'Back'}
            </button>
            <p>© Good Vibes Inc. 2024</p>
            <div className="links">
                <a href="https://github.com/zdigness/puttdle/">
                <img src="../public/assets/github.png"></img>
                </a>
            </div>
        </div>
        </>
    );
}

export default Welcome