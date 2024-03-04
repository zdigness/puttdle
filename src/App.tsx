import { useEffect, useState } from 'react'
import Puttdle from './Puttdle'
import { jwtDecode, JwtPayload } from 'jwt-decode';
import './App.css'

function App() {
  const [ user, setUser ] = useState({})

  function handleCallbackResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential)
    const decoded = jwtDecode<JwtPayload>(response.credential)
    console.log("DecodedJWT ID token: " + JSON.stringify(decoded))
    setUser(decoded)
    const loginElement = document.getElementById('login');
    if (loginElement) {
      loginElement.hidden = true;
    }
  }

  function hangleSignOut(e: any) {
    e.preventDefault()
    setUser({})
    const loginElement = document.getElementById('login');
    if (loginElement) {
      loginElement.hidden = false;
    }
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
    <header>
      <p>Puttdle | Phaser</p>
      { Object.keys(user).length != 0 &&
        <button onClick = { (e) => hangleSignOut(e) }>Sign Out</button>
      }
      { user &&
        <div>
          <img src={user.picture} alt={user.name} />
        </div>
      }
      <div id="login" data-type="onload"></div>
    </header>
    <main>
      <Puttdle />
    </main>
    <footer>
      Created by Good Vibes Inc.
    </footer>
    </>
  );
}

export default App
