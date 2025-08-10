import React from 'react';

/**
 * A reusable Popup component.
 *
 * @param {object} props - The component props.
 * @param {string} props.message - The message to display inside the popup.
 * @param {boolean} props.isOpen - Controls the visibility of the popup.
 * @param {function} props.onClose - Function to call when the popup needs to be closed.
 */
export default function Popup({ message, isOpen, onClose }) {
    if (!isOpen) {
        return null; // Don't render anything if the popup is not open
    }

    return (
        // Overlay: Fixed, full screen, semi-transparent black background, centered content
        <div
            className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose} // Allows closing by clicking on the overlay
        >
            {/* Popup Container: White background, rounded corners, shadow, relative for close button positioning */}
            <div
                className="bg-white p-6 rounded-lg shadow-2xl relative max-w-sm w-full mx-auto transform transition-all duration-300 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
            >
                {/* Close Button: Absolute positioned at top-right */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label="Close popup"
                >
                    &times; {/* '×' character for a clear 'X' */}
                </button>

                {/* Popup Message */}
                <div className="mt-4 text-center">
                    <p className="text-gray-700 font-semibold text-base">{message}</p>
                </div>
            </div>
        </div>
    );
}

// Example Usage (for demonstration, you'd integrate this into your App.jsx or other component)
/*
import React, { useState } from 'react';
import Popup from './Popup'; // Assuming Popup.jsx is in the same directory

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleOpenPopup = (msg) => {
    setPopupMessage(msg);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupMessage(''); // Clear message on close
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">My React App</h1>
      <button
        onClick={() => handleOpenPopup('This is a success message!')}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md mr-4"
      >
        Show Success Popup
      </button>
      <button
        onClick={() => handleOpenPopup('Oops! Something went wrong. Please try again.')}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
      >
        Show Error Popup
      </button>

      <Popup
        message={popupMessage}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default App;
*/
