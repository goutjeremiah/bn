import { Wallet, Send, ScanLine, Grid, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Popup from './Popup';

export default function Footer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    const user = localStorage.getItem('user') || null;

    useEffect(() => {
        setIsLoggedIn(user);
    }, []);


    return (
        <>
            <Popup
                message={popupMessage}
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
            />
            <footer className="bg-primary text-white pt-10 pb-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col gap-10">
                    <div className="text-sm ">
                        FBHT Trust is a division of FBHT Group, offering a broad range of personal and business banking, investment, and insurance products. Investment services are provided through FBHT Securities LLC, a registered broker-dealer and investment adviser, member FINRA and SIPC. Insurance products are offered by FBHT Insurance Partners, a licensed insurance agency. Trust and estate services are administered by FBHT Trust Company, an affiliated entity. Banking services, including deposit accounts, loans, and digital banking tools, are issued by FBHT Bank, Member FDIC. All products are subject to eligibility requirements, terms, and applicable regulations. Investments are not FDIC insured, may lose value, and are not guaranteed by the bank. Services may not be available in all states or jurisdictions and are subject to change without notice.
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {/* Column 1: Company */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                                <li><Link to="#" className="hover:text-white">Careers</Link></li>
                                <li><Link to="#" className="hover:text-white">Blog</Link></li>
                                <li><Link to="#" className="hover:text-white">Press</Link></li>
                            </ul>
                        </div>


                        {/* Column 3: Support */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><Link to="#" className="hover:text-white">Help Center</Link></li>
                                <li><Link to="#" className="hover:text-white">Security</Link></li>
                                <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
                                <li><Link to="#" className="hover:text-white">Accessibility</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Connect */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                            <div className="flex space-x-4 mb-4">
                                <a href="#" className="hover:text-white" aria-label="Facebook"><Facebook size={20} /></a>
                                <a href="#" className="hover:text-white" aria-label="Twitter"><Twitter size={20} /></a>
                                <a href="#" className="hover:text-white" aria-label="LinkedIn"><Linkedin size={20} /></a>
                                <a href="#" className="hover:text-white" aria-label="Instagram"><Instagram size={20} /></a>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-8 pt-4 text-center text-xs text-white/60 px-4">
                    <p>
                        Terms of Service | Privacy Policy | Disclosures | Sitemap
                    </p>
                    <p className="text-xs text-white/60">
                        © {new Date().getFullYear()} FBHT Group. All rights reserved.
                    </p>
                </div>
            </footer >
        </>
    );
}
