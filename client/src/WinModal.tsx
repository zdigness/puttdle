import React from "react"
import "./WinModal.css"

interface WinModalProps {
  score: number
}

const WinModal: React.FC<WinModalProps> = ({ score }) => {
  return (
    <div className="modalContent">
      <h2>You Win!</h2>
      <p id="score">Congratulations, your score is: {score}</p>
    </div>
  )
}

export default WinModal
