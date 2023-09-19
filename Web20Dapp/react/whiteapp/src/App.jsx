import { useState } from 'react';
import { createHash } from 'crypto-browserify'; // Use crypto-browserify

import MerkleTree from 'merkle-tree-gen';

function App() {
  const [inputAddresses, setInputAddresses] = useState([
    'address1',
    'address2',
    'address3',
    'address4',
  ]);

  const handleInputChange = (e, index) => {
    const updatedAddresses = [...inputAddresses];
    updatedAddresses[index] = e.target.value;
    setInputAddresses(updatedAddresses);
  };

  const generateMerkleTree = () => {
    const leafNodes = inputAddresses.map(address => sha256(address));
    const merkleTree = new MerkleTree(leafNodes, sha256);
    const merkleRoot = merkleTree.getRoot().toString('hex');
    return merkleRoot;
  };

  const sha256 = data => {
    return createHash('sha256').update(data).digest();
  };

  return (
    <div className="App">
      <h1>Merkle Tree Generator</h1>
      <div className="input-container">
        <h2>Input Addresses</h2>
        {inputAddresses.map((address, index) => (
          <input
            key={index}
            type="text"
            value={address}
            onChange={e => handleInputChange(e, index)}
          />
        ))}
      </div>
      <div className="result-container">
        <h2>Merkle Root</h2>
        <p>{generateMerkleTree()}</p>
      </div>
    </div>
  );
}

export default App;
