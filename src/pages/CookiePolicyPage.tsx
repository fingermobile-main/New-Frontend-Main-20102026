import { Link } from 'react-router-dom';
import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';
import LegalDocumentBanner from '../components/legal/LegalDocumentBanner';

const CookiePolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <LegalDocumentBanner
            slug="cookie-policy"
            defaultTitle="FingerMobile Cookie Policy"
            defaultVersion="1.2.0"
            defaultEffectiveDate="October 31, 2025"
          />

          <div className="mb-6">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            FingerMobile Cookie Policy
          </h1>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-gray-700">
                Cookies are small text files that are stored on your device when
                you visit websites. They are widely used to make websites work
                more efficiently and to provide information to the owners of the
                site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-gray-700 mb-4">We use cookies to:</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Recognize your device when you visit our website</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our website</li>
                <li>Improve your browsing experience</li>
                <li>Deliver personalized content and advertising</li>
                <li>Manage our services and detect any service issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Types of Cookies We Use
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.1. Essential Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies are essential for the website to function
                properly. They enable core functionality such as security,
                network management, and accessibility. You cannot opt-out of
                these cookies.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.2. Performance Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies collect information about how you use our website,
                such as which pages you visit most often. All information these
                cookies collect is aggregated and therefore anonymous. They help
                us understand how visitors interact with our website.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.3. Functional Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies enable the website to provide enhanced
                functionality and personalization. They may be set by us or by
                third-party providers whose services we have added to our pages.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.4. Targeting Cookies
              </h3>
              <p className="text-gray-700">
                These cookies may be set through our site by our advertising
                partners. They may be used by those companies to build a profile
                of your interests and show you relevant advertisements on other
                sites. They do not store personal information directly, but are
                based on uniquely identifying your browser and internet device.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="text-gray-700">
                We may also use third-party cookies for:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Analytics (Google Analytics, etc.)</li>
                <li>Advertising (Facebook, Google Ads, etc.)</li>
                <li>Social media integration</li>
                <li>Content delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Managing Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                You can control and/or delete cookies as you wish. You can
                delete all cookies that are already on your device and you can
                set most browsers to prevent them from being placed. However, if
                you do this, you may have to manually adjust some preferences
                every time you visit a site and some services and
                functionalities may not work.
              </p>
              <p className="text-gray-700">
                Most web browsers automatically accept cookies, but you can
                modify your browser settings to decline cookies if you prefer.
                If you choose to decline cookies, you may not be able to fully
                experience the interactive features of the FingerMobile services
                or websites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Changes to This Cookie Policy
              </h2>
              <p className="text-gray-700">
                We may update our Cookie Policy from time to time. We will
                notify you of any changes by posting the new Cookie Policy on
                this page and updating the "Effective Date" at the top of this
                page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our Cookie Policy, please
                contact us at:
              </p>
              <p className="text-gray-700 font-medium">
                info@fingermobileprotocol.com | fingermobileprotocol@gmail.com
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Official Web: https://fingermobileprotocol.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicyPage;
