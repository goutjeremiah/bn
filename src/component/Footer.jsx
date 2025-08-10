import { Send, Phone } from 'lucide-react';
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
                        FBHT Trust operates under the umbrella of the FBHT Group, delivering a comprehensive selection of financial solutions for individuals and businesses. These include banking, investment, and insurance options tailored to diverse client needs. Investment offerings are provided by BAL Investment & Advisory, LLC, a member of FINRA and SIPC. Insurance solutions are arranged through BAL Investment & Advisory, LLC, a licensed insurance agency. Trust and estate management services are handled by FBHT Trust INC, an affiliated organization. Banking products—such as deposit accounts, lending services, and digital banking platforms. Availability of all services depends on eligibility and compliance with applicable terms and regulations. Certain services may be restricted in specific states or regions and may be modified or discontinued without prior notice.
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
                            <div className="flex flex-col space-y-2 mb-4">
                                <p className="flex items-center gap-2 text-sm"><Send size={20} /> help@fbht-trust.com</p>
                                <p className="flex items-center gap-2 text-sm"><Phone size={20} /> +1 863 2194145</p>
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
