import React, { useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import config from "./gameConfig"
import WinModal from "./WinModal"

interface PuttdleProps {
  onAction: () => void
}

const Puttdle: React.FC<PuttdleProps> = (props: { onAction: () => void }) => {
  const gameRef = useRef<Phaser.Game | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [score, setScore] = useState(10)

  useEffect(() => {
    const game = new Phaser.Game(config)
    gameRef.current = game

    return () => {
      game.destroy(true)
    }
  }, [])

  useEffect(() => {
    const game = gameRef.current

    game?.events.on("win", (data: { score: number }) => {
      fetch("http://localhost:3000/api/v1/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: data.score }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("You win! Score:", data.score)
          setScore(data.score)
          setIsModalOpen(true)
          props.onAction()
        })
    })
  }, [gameRef])

  return (
    <>
      <div id="gameCanvas"></div>
      {isModalOpen && (
        <div className="modal__overlay" onClick={() => setIsModalOpen(false)}>
          <WinModal score={score} />
        </div>
      )}
    </>
  )
}

export default Puttdle
