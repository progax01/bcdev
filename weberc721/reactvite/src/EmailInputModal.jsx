// EmailInputModal.js
import { React,  useState } from 'react';
import Modal from 'react-modal';
function EmailInputModal({ isOpen, onRequestClose, onSubmit }) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Validate email address if needed
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        // Add modal styles and settings here
      >
        <h2>Enter Your Email Address</h2>
        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </Modal>
    </div>
  );
}

export default EmailInputModal;
