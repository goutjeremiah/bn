import React, { useState } from 'react';

export default function Faq() {
    // State to track the index of the currently open FAQ item.
    // null means all items are closed.
    const [openIndex, setOpenIndex] = useState(null);

    // Example data for the FAQ section.
    // In a real application, this data might be fetched from an API.
    const faqData = [
        {
            question: "How do I open a new bank account?",
            answer: "You can open a new account by visiting our website or mobile app and completing the registration form. You'll need a valid ID and proof of address to get started."
        },
        {
            question: "Is my money safe with your platform?",
            answer: "Yes, your funds are protected with industry-standard security measures, and we are fully licensed and regulated under applicable financial laws. Your deposits are insured as per national financial safety regulations."
        },
        {
            question: "Can I access my account 24/7?",
            answer: "Absolutely! Our digital banking platform is available 24/7 via our website and mobile app, allowing you to manage your finances anytime, anywhere."
        },
        {
            question: "What should I do if I forget my password?",
            answer: "If you forget your password, click on the 'Forgot Password' link on the login page and follow the instructions to reset it securely using your registered email or phone number."
        },
        {
            question: "Are there any fees for using your services?",
            answer: "Most of our banking services are free. However, some transactions or premium features may incur small fees. You can view our full fee schedule on the pricing section of our website."
        }
    ]


    /**
     * Handles the click event on a FAQ question.
     * Toggles the open state of the item.
     * If the clicked item is already open, it closes it.
     * Otherwise, it opens the new item and closes any other open item.
     *
     * @param {number} index The index of the clicked FAQ item.
     */
    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen font-inter">
            <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
                    Frequently Asked Questions
                </h2>

                {/* FAQ list container */}
                <div className="divide-y divide-gray-200">
                    {faqData.map((item, index) => (
                        <div key={index} className="py-4">
                            {/* Question button */}
                            <button
                                className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800 hover:text-primary focus:outline-none focus:text-primary transition-colors duration-200"
                                onClick={() => handleToggle(index)}
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span>{item.question}</span>
                                {/* Plus/Minus icon, rotates with a transition */}
                                <span className={`transform transition-transform duration-300 ease-in-out ${openIndex === index ? 'rotate-45 text-primary' : 'rotate-0'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </span>
                            </button>

                            {/* Answer content, animates with max-height transition */}
                            <div
                                id={`faq-answer-${index}`}
                                role="region"
                                aria-labelledby={`faq-question-${index}`}
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-600 text-base py-2">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
