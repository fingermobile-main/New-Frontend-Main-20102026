import { Link } from 'react-router-dom';
import React, {} from 'react';

import { useAppContext } from '../../contexts/AppContext';

import PropTypes from 'prop-types';

const LegalLinkCard = React.memo(({ to, title, description }: { to: string; title: string; description?: string }) => (
    <Link to={to} className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </Link>
));

LegalLinkCard.displayName = 'LegalLinkCard';

const LegalPage: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Legal Information</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LegalLinkCard 
                    to="/legal/privacy-policy" 
                    title="Privacy Policy" 
                    description="How we handle your data" 
                />
                <LegalLinkCard 
                    to="/legal/terms-of-service" 
                    title="Terms of Service" 
                    description="Rules for using our platform" 
                />
                <LegalLinkCard 
                    to="/legal/community-guidelines" 
                    title="Community Guidelines" 
                    description="Our community standards" 
                />
            </div>
        </div>
    );
};

export default LegalPage;