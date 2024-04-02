import './questionModal.css'

const QuestionModal = () => {
    return (
        <div className="modal-content">
            <h1>How To Play</h1>
            <h3>Left click and drag to give the ball power and accuracy</h3>
            <h3>Make the ball in the hole in as few strokes as possible</h3>
            <h2>Things to note!</h2>
            <h3>Water traps will respawn the ball where you took the shot and will add a stroke</h3>
            <h3>Sand traps will slow your ball down</h3>
        </div>
    );
};

export default QuestionModal;