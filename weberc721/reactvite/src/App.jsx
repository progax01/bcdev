// App.js
//import React from 'react';
import './App.css'; // Your Tailwind CSS styles
import TokenInfo from './TokenInfo'; // Import the TokenInfo component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TokenInfo /> {/* Include the TokenInfo component */}
      </header>
    </div>
  );
}

export default App;
