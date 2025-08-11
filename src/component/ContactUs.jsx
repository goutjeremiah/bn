import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ContactUs() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic form validation
        if (!fullName.trim() || !email.trim() || !message.trim()) {
            toast.error('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('email', email);
        formData.append('message', message);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/contact`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        });

        const data = await response.json();

        if (response.status === 200 || response.status === 201) {
            toast.success('Your message has been sent successfully!');
            setFullName('');
            setEmail('');
            setMessage('');
            setLoading(false);
        } else {
            toast.error(data.message || 'Failed to send message. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-10 px-4 bg-gray-100 min-h-screen font-inter">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">Contact Us</h2>
                <p className="text-center text-gray-600 mb-8">
                    We would love to hear from you! Please fill out the form below.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent transition duration-300"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {/* Email Address Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent transition duration-300"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent transition duration-300 resize-none"
                            placeholder="Your message here..."
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${loading
                            ? 'bg-primary/70 cursor-not-allowed'
                            : 'bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
                            }`}
                    >
                        {loading ? 'Submitting...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
}

