import { useState, useEffect } from 'react';
import Popup from './Popup';
import { Wallet, Send, ScanLine, Grid } from 'lucide-react';
export default function DashboardFooter() {
    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const message = 'You are not enrolled for the service at the moment. \n Contact support.';

    const handleOpenPopup = (msg) => {
        console.log(msg);
        setPopupMessage(msg);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setPopupMessage(''); // Clear message on close
    };
    return (
        <>
            <Popup
                message={popupMessage}
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
            />
            <footer className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-100 p-3">
                <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center text-red-600">
                        <Wallet size={20} />
                        <span className="text-xs mt-1">Accounts</span>
                    </div>
                    <button onClick={() => handleOpenPopup(message)} className="flex flex-col items-center text-gray-500 hover:text-gray-700">
                        <Send size={20} />
                        <span className="text-xs mt-1">Pay</span>
                    </button>
                    <button onClick={() => handleOpenPopup(message)} className="flex flex-col items-center text-gray-500 hover:text-gray-700">
                        <ScanLine size={20} />
                        <span className="text-xs mt-1">Deposit</span>
                    </button>
                    <button onClick={() => handleOpenPopup(message)} className="flex flex-col items-center text-gray-500 hover:text-gray-700">
                        <Grid size={20} />
                        <span className="text-xs mt-1">Services</span>
                    </button>
                </div>
            </footer>
        </>
    );
}
