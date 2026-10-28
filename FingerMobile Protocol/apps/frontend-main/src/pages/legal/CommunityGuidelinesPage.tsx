import React, {} from 'react';
import LegalLayout from '../../components/layout/LegalLayout';
import { MembersIcon } from '../../components/icons';
import LegalDocumentBanner from '../../components/legal/LegalDocumentBanner';

const CommunityGuidelinesPage = () => {

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
      <h3 className="text-xl font-black text-slate-900 border-b border-slate-300 pb-2 mb-4">{title}</h3>
      <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed">
        {children}
      </div>
    </section>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <LegalLayout>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 lg:p-8">
        <LegalDocumentBanner
          slug="community-guidelines"
          defaultTitle="FingerMobile Community Guidelines"
          defaultVersion="2.0.0"
          defaultEffectiveDate="October 31, 2025"
        />

        <div className="flex items-center gap-4 mb-6">
          <MembersIcon className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-black text-slate-900">Community Guidelines</h1>
            <p className="text-slate-700 font-medium">Building a safe and respectful community together.</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <Section title="Our Commitment">
            <p>At FingerMobile, we are committed to fostering a safe, respectful, and inclusive community for all members. These guidelines outline our expectations for behavior and content on our platform, and the consequences for violations.</p>
          </Section>

          <Section title="Respect Others">
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Treat all members with respect and kindness, regardless of their background, identity, or beliefs</li>
              <li>Do not engage in harassment, bullying, or hate speech of any kind</li>
              <li>Avoid personal attacks, insults, or inflammatory language</li>
              <li>Respect people's privacy and do not share personal information without consent</li>
              <li>Do not threaten or intimidate other members</li>
            </ul>
          </Section>

          <Section title="Content Standards">
            <p>We encourage creative expression and meaningful discussions, while maintaining standards that promote a positive community experience:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Share original content you have the right to post</li>
              <li>Give credit where credit is due and respect intellectual property rights</li>
              <li>Do not post explicit sexual content, graphic violence, or dangerous activities</li>
              <li>Avoid spamming, excessive self-promotion, or misleading information</li>
              <li>Do not impersonate others or create fake accounts to deceive people</li>
            </ul>
          </Section>

          <Section title="Prohibited Activities">
            <p>The following activities are strictly prohibited on our platform:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Illegal activities or promoting illegal behavior</li>
              <li>Violence or threats of violence</li>
              <li>Child exploitation or endangerment</li>
              <li>Terrorism or organized criminal activity</li>
              <li>Self-harm or suicide promotion</li>
              <li>Scams, fraud, or phishing attempts</li>
              <li>Spam or malicious software distribution</li>
            </ul>
          </Section>

          <Section title="Reporting Violations">
            <p>If you encounter content or behavior that violates our community guidelines, please report it using the reporting tools available on the platform. Our moderation team will review the reported content and take appropriate action.</p>
          </Section>

          <Section title="Appeals Process">
            <p>If your content was removed or your account was suspended, you may appeal the decision by contacting our support team. Please provide detailed information about your case, and our team will review it thoroughly.</p>
          </Section>

          <Section title="Parental Guidance">
            <p>We recommend that parents and guardians familiarize themselves with our platform and discuss online safety with their children. While we strive to maintain a safe environment, parental supervision is encouraged for younger members.</p>
          </Section>

          <Section title="Updates to Guidelines">
            <p>We may update these community guidelines from time to time to reflect changes in our community or legal requirements. Members will be notified of significant changes, and continued use of the platform constitutes acceptance of the updated guidelines.</p>
          </Section>

          <Section title="Contact Us">
            <p>If you have questions about these community guidelines or need assistance with a community-related issue, please contact us at:</p>
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-300 text-slate-800 font-medium">
              <p className="font-bold text-slate-900">FingerMobile Protocol™ Community Team</p>
              <p>Email: info@fingermobileprotocol.com / fingermobileprotocol@gmail.com</p>
              <p>Official Website: https://fingermobileprotocol.com</p>
            </div>
          </Section>

          <div className="mt-8 pt-6 border-t border-gray-300 text-sm text-slate-700">
            <p>Last Updated: December 20, 2025</p>
          </div>
        </div>
      </div>
    </LegalLayout>

    {/* Sovereign Mobile Navigation Quick Dock */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
      <a
        href="/legal"
        aria-label="Legal Center"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">⚖️</span>
        <span>Legal</span>
      </a>
      <a
        href="/contact-us"
        aria-label="Contact Community"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">💬</span>
        <span>Contact</span>
      </a>
      <button
        onClick={() => window.location.reload()}
        aria-label="Reload Guidelines"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">🔄</span>
        <span>Sync</span>
      </button>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to Top"
        className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
      >
        <span className="text-base">⬆️</span>
        <span>Top</span>
      </button>
    </div>
  </div>
  );
};

export default CommunityGuidelinesPage;
