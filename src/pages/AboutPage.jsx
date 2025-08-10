import React, { useEffect } from 'react';
import ContactUs from '../component/ContactUs'; // Assuming ContactUs is in the same directory for this example.

export default function AboutPage() {
    // useEffect hook to run after the component mounts
    useEffect(() => {
        // Scroll the window to the top of the page
        window.scrollTo(0, 0);
    }, []); // The empty dependency array [] ensures this runs only once on mount.

    return (
        <div className="px-4 py-12 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
                <p className="text-gray-600 leading-7 text-lg">
                    At <span className="font-semibold text-gray-800">Fbht Group Inc</span>, we are committed to providing secure, reliable, and innovative financial solutions tailored to meet the needs of individuals, families, and businesses.
                    Whether you're managing daily expenses, saving for the future, or growing your business, we offer a full range of banking services—from personal and business accounts to loans, savings, and digital banking tools.
                </p>
                <p className="text-gray-600 leading-7 text-lg mt-4">
                    We believe in building long-term relationships based on trust, transparency, and customer satisfaction. Our digital platforms are designed to make banking easy and accessible, anytime and anywhere.
                    With 24/7 customer support, robust security systems, and user-friendly technology, your financial wellbeing is always our top priority.
                </p>
                <p className="text-gray-600 leading-7 text-lg mt-4">
                    Explore our website to learn more about how we can support your goals. For assistance, visit one of our branches, contact our support team, or use our mobile app for instant access to your accounts.
                    <span className="block mt-2">Fbht Group Inc</span> is fully licensed and regulated, and your deposits are protected under applicable financial safety regulations.
                    We are proud to serve our community and help you achieve more with confidence.
                </p>
            </div>

            <div className="max-w-4xl mx-auto mt-12">
                <ContactUs />
            </div>
        </div>
    );
}
