import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';  // Removed .tsx extension


const CommunityGuidelinesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Guidelines</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Commitment</h2>
          <p className="text-gray-600 mb-4">
            At FingerMobile, we're dedicated to fostering a safe, inclusive, and respectful community for all members. These guidelines outline our expectations for all members and help create a positive environment for everyone.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Respectful Interaction</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Treat all members with dignity, respect, and kindness</li>
            <li>Engage constructively and avoid personal attacks or harassment</li>
            <li>Listen actively and consider diverse perspectives</li>
            <li>Communicate in a professional and courteous manner</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Content Standards</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Share content that adds value to the community</li>
            <li>Credit sources appropriately and respect intellectual property rights</li>
            <li>Avoid posting misleading or false information</li>
            <li>Ensure content aligns with our community values</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prohibited Activities</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Hate speech, discrimination, or incitement to violence</li>
            <li>Harassment, bullying, or threatening behavior</li>
            <li>Sharing explicit, sexual, or inappropriate content</li>
            <li>Spam, phishing, or fraudulent activities</li>
            <li>Impersonating others or misrepresenting identity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy and Consent</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Respect others' privacy and personal information</li>
            <li>Obtain consent before sharing private communications</li>
            <li>Do not share others' personal details without permission</li>
            <li>Be mindful of privacy in shared spaces</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reporting Violations</h2>
          <p className="text-gray-600 mb-4">
            If you witness or experience violations of these guidelines, please report them using our reporting tools or contact our moderation team directly. We investigate all reports promptly and confidentially.
          </p>
          <p className="text-gray-600">
            Together, we can maintain a community that promotes positive interactions and meaningful contributions from all members.
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default CommunityGuidelinesPage;