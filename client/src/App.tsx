/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import Puttdle from "./Puttdle"
import { jwtDecode, JwtPayload } from "jwt-decode"
import "./App.css"
import Welcome from "./Welcome"
import QuestionModal from "./questionModal"
import StatsModal from "./statsModal"

function App() {
  const [isWelcome, setIsWelcome] = useState(true)
  const [user, setUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)
  const [isQuestionOpen, setIsQuestionOpen] = useState(false)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const handleQuestionClick = () => {
    setIsQuestionOpen(true)
  }

  const handleCloseQuestion = () => {
    setIsQuestionOpen(false)
  }

  const handleStatsClick = () => {
    setIsStatsOpen(true)
  }

  const handleCloseStats = () => {
    setIsStatsOpen(false)
  }

  function handleCallbackResponse(response: any) {
    const decoded = jwtDecode<JwtPayload>(response.credential)
    setUser(decoded)
    const loginElement = document.getElementById("login")
    if (loginElement) {
      loginElement.hidden = true
    }
    handleLoginSuccess(decoded)
  }

  function handleLoginSuccess(response: any) {
    fetch("http://localhost:3000/api/v1/users/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((response) => response.json())
      .then((data) => {
        const score = document.getElementById("score")
        const streak = document.getElementById("streak")
        if (score && streak) {
          setScore(data.score)
          setStreak(data.streak)
        }
        console.log("Success:", data)
      })
      .catch((error) => {
        console.error("Error:", error)
      })

    setLoggedIn(true)
  }

  function handleSignOut(e: any) {
    e.preventDefault()
    setUser({})
    const loginElement = document.getElementById("login")
    if (loginElement) {
      loginElement.hidden = false
    }

    setLoggedIn(false)
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "7109401546-mgi2m2lcplmdckrmn4smdqpa17iu7ml9.apps.googleusercontent.com",
      callback: () => handleCallbackResponse(undefined),
    })

    google.accounts.id.renderButton(document.getElementById("login"), {
      type: "icon",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "pill",
    } as any)
  })

  const onPlayToggle = () => {
    setIsWelcome(false)
  }

  return (
    <>
      {isWelcome ? (
        <Welcome isWelcome={isWelcome} onPlayToggle={onPlayToggle} />
      ) : (
        <div>
          <div id="puttdle">
            <header>
              <div className="title">
                <p>PUTTDLE!</p>
              </div>
              <div id="account">
                <img id="question" src="../assets/question.png" alt="question mark" onClick={handleQuestionClick} />
                {loggedIn && (
                  <div id="info">
                    <img id="stats" src="../assets/stats.png" alt="stats" onClick={handleStatsClick} />
                  </div>
                )}
                {Object.keys(user).length != 0 && (
                  <button className="signOutButton" onClick={(e) => handleSignOut(e)}>
                    Sign Out
                  </button>
                )}
                <div id="login" data-type="onload"></div>
              </div>
            </header>
            <main>
              <Puttdle />
            </main>
            <footer>
              <p>Created by Good Vibes Inc.</p>
            </footer>
          </div>
          {isQuestionOpen && (
            <div className="question" onClick={() => handleCloseQuestion()}>
              <QuestionModal></QuestionModal>
            </div>
          )}

          {isStatsOpen && (
            <div className="stats" onClick={() => handleCloseStats()}>
              <StatsModal score={score} streak={streak}></StatsModal>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default App
