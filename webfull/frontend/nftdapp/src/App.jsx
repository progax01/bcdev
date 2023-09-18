import { useState,useEffect } from 'react'
import axios from 'axios'
import './App.css'
import MetaIntegration from './MetaIntregation'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/')
    .then ((response) => {
      setMessage(response.data);

    })
    .catch((error) => {
      console.error(error);
      setMessage(error);
    });
  }, []);
  return (
    <>
      <h1>MetaMask Integration</h1>
      <MetaIntegration />
      
      <h1>Vite + React</h1>
      <h1>{message}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
       </div>
    </>
  )
}

export default App
