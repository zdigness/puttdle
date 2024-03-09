import { useEffect, useState } from 'react'
import Puttdle from './Puttdle'
import { jwtDecode, JwtPayload } from 'jwt-decode';
import './App.css'
import React from 'react';

function App() {

  const [ user, setUser ] = useState({})
  const [ loggedIn, setLoggedIn ] = useState(false)

  function handleCallbackResponse(response: any) {
    const decoded = jwtDecode<JwtPayload>(response.credential)
    setUser(decoded)
    const loginElement = document.getElementById('login');
    if (loginElement) {
      loginElement.hidden = true;
    }
    handleLoginSuccess(decoded)
  }

  function handleLoginSuccess(response: any) {
    fetch('http://localhost:3000/api/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })

    setLoggedIn(true)
  }

  function hangleSignOut(e: any) {
    e.preventDefault()
    setUser({})
    const loginElement = document.getElementById('login');
    if (loginElement) {
      loginElement.hidden = false;
    }

    setLoggedIn(false)
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: '7109401546-mgi2m2lcplmdckrmn4smdqpa17iu7ml9.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    })

    google.accounts.id.renderButton(
      document.getElementById('login'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
      }
    )
  }, [])

  return (
    <>
    <div id="fuckyou">
    <header>
      <p>Puttdle | Phaser</p>
      <div id="account">
        { Object.keys(user).length != 0 &&
          <button onClick = { (e) => hangleSignOut(e) }>Sign Out</button>
        }
        { loggedIn &&
          <div>
            <img id="pfp" src={user.picture} alt={null}/>
          </div>
        }
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
    </>
  );
}

export default App
