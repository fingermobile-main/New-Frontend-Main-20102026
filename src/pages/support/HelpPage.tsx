import React from 'react';

const HelpPage = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      content: "Learn how to set up your account and navigate the platform."
    },
    {
      title: "Troubleshooting",
      content: "Find solutions to common issues you may encounter."
    },
    {
      title: "Features Guide",
      content: "Detailed explanations of all platform features and capabilities."
    }
  ];

  return (
    <div className="help-page">
      <h1>Help Center</h1>
      <p>Welcome to our help center. Here you can find answers to common questions and guides to help you use our platform effectively.</p>
      
      <div className="help-topics">
        {helpTopics.map((topic, index) => (
          <div key={index} className="help-topic">
            <h2>{topic.title}</h2>
            <p>{topic.content}</p>
            <button>Learn More</button>
          </div>
        ))}
      </div>
      
      <div className="support-contact">
        <h2>Still need help?</h2>
        <p>Our support team is available 24/7 to assist you.</p>
        <ul>
          <li>Email: support@fingermobileprotocol.com</li>
          <li>Phone: +1 (800) 123-4567</li>
          <li>Live Chat: Available on the bottom right corner</li>
        </ul>
      </div>
    </div>
  );
};

export default HelpPage;