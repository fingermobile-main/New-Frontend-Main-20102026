import React, {} from 'react';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is FingerMobile Protocol?",
      answer: "FingerMobile Protocol is a comprehensive communication platform designed to facilitate various interactions."
    },
    {
      question: "How can I get support?",
      answer: "You can contact our support team through the contact form or email us directly."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data."
    }
  ];

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;