import React, {} from 'react';
import ConferenceRoom from '../components/ConferenceRoom';
import PageHeader from '../components/PageHeader';

const ConferencePage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Conference Room"
        description="Join your team meeting"
      />

      <div className="flex-1 overflow-hidden">
        <ConferenceRoom />
      </div>
    </div>
  );
};

export default ConferencePage;
