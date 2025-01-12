import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

const Help = ({ onClose }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(null);
    const [message, setMessage] = useState("");

    const handleAccordionToggle = (index) => {
        setIsAccordionOpen(isAccordionOpen === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent: ${message}`);
        setMessage("");
        onClose();
    };

    const faqs = [
        {
            question: "How do I add a new field?",
            answer: "Go to the Field Management section and click 'Add Field' to enter field details.",
        },
        {
            question: "How can I update field information?",
            answer: "Click on a field card and use the edit button to modify the field data.",
        },
        {
            question: "What do the analytics graphs represent?",
            answer: "The analytics show soil health, crop growth, and other key metrics for your field.",
        },
    ];

    return (
        <div className="bg-white relative rounded-xl md:w-[500px] w-full min-h-[70vh] flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="flex absolute top-2 right-2 justify-between items-center mb-4 px-2 w-full">
                <h2 className="text-xl font-semibold text-gray-700">Help & Support</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <FaTimes/>
                </button>
            </div>

            {/* Accordion for FAQs */}
            <div className="space-y-2 w-full">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-2">
                        <button
                            onClick={() => handleAccordionToggle(index)}
                            className="flex justify-between items-center w-full text-left text-gray-700 hover:text-blue-600"
                        >
                            <span>{faq.question}</span>
                            <span>
                                {isAccordionOpen === index ?
                                    <FaChevronUp/>:<FaChevronDown/>
                                }
                            </span>
                        </button>
                        {isAccordionOpen === index && (
                            <p className="mt-2 text-gray-600">{faq.answer}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t"></div>

            {/* Help Message Form */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your question or message here..."
                    className="w-full h-24 border rounded p-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                    required
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Help;
